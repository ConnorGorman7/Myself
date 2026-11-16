#!/usr/bin/env node
/**
 * Intro video pipeline: raw recording → /v/<slug> page.
 *
 *   npm run video -- <file> "<Company>" [--recipient Sarah] [--role "AI Engineer"]
 *                    [--slug existing-slug] [--model medium.en] [--no-upload]
 *
 * 1. Compress to 1080p H.264 + AAC (tone-maps iPhone HDR, normalizes loudness)
 * 2. Grab a poster frame        → public/v/<slug>.jpg  (also the link-preview image)
 * 3. Transcribe with Whisper    → public/v/<slug>.vtt  (edit typos by hand, then commit)
 * 4. Upload mp4 to Vercel Blob  (needs BLOB_READ_WRITE_TOKEN in .env.local)
 *    --no-upload copies it to public/v/ instead, for local preview only (gitignored)
 * 5. Add/replace the entry in src/data/videos.json — then write the TLDR there.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { randomBytes } from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DATA = path.join(ROOT, "src/data/videos.json");
const PUBLIC_V = path.join(ROOT, "public/v");

// ── args ────────────────────────────────────────────────────────────────────
const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    recipient: { type: "string" },
    role: { type: "string" },
    slug: { type: "string" },
    model: { type: "string", default: "medium.en" },
    "no-upload": { type: "boolean", default: false },
  },
});
const [input, company] = positionals;
if (!input || !company) {
  console.error('Usage: npm run video -- <file> "<Company>" [--recipient Name] [--role "Role"] [--slug s] [--no-upload]');
  process.exit(1);
}
if (!existsSync(input)) fail(`Input not found: ${input}`);

function fail(msg) {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
}

// ── tools ───────────────────────────────────────────────────────────────────
function findTool(name) {
  const exe = process.platform === "win32" ? `${name}.exe` : name;
  if (spawnSync(name, ["-version"], { stdio: "ignore" }).status === 0) return name;
  // winget installs Gyan.FFmpeg here but PATH only updates in new terminals.
  const pkgs = path.join(homedir(), "AppData/Local/Microsoft/WinGet/Packages");
  if (existsSync(pkgs)) {
    for (const pkg of readdirSync(pkgs).filter((d) => d.startsWith("Gyan.FFmpeg"))) {
      for (const build of readdirSync(path.join(pkgs, pkg))) {
        const p = path.join(pkgs, pkg, build, "bin", exe);
        if (existsSync(p)) return p;
      }
    }
  }
  fail(`${name} not found. Install with: winget install Gyan.FFmpeg`);
}
const FFMPEG = findTool("ffmpeg");
const FFPROBE = findTool("ffprobe");
const PYTHON = path.join(ROOT, process.platform === "win32" ? ".venv-video/Scripts/python.exe" : ".venv-video/bin/python");
if (!existsSync(PYTHON)) {
  fail("Whisper venv missing. Run: python -m venv .venv-video && .venv-video/Scripts/python -m pip install faster-whisper");
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "inherit"] }).toString();
const ff = (args) => run(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args]);

// ── slug + paths ────────────────────────────────────────────────────────────
const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const slug = opts.slug ?? `${slugify(company)}-${randomBytes(3).toString("hex").slice(0, 4)}`;
const work = path.join(ROOT, "video-work", slug);
mkdirSync(work, { recursive: true });
mkdirSync(PUBLIC_V, { recursive: true });

const outMp4 = path.join(work, `${slug}.mp4`);
const wav = path.join(work, "audio.wav");
const transcriptTxt = path.join(work, "transcript.txt");
const posterJpg = path.join(PUBLIC_V, `${slug}.jpg`);
const vtt = path.join(PUBLIC_V, `${slug}.vtt`);

// ── 1. compress ─────────────────────────────────────────────────────────────
const probe = JSON.parse(
  run(FFPROBE, ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", input]),
);
const vStream = probe.streams.find((s) => s.codec_type === "video");
if (!vStream) fail("No video stream in input.");
const isHdr = ["arib-std-b67", "smpte2084"].includes(vStream.color_transfer);

const scale = "scale=-2:'min(1080,ih)'";
const vf = isHdr
  ? `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,${scale},format=yuv420p`
  : `${scale},format=yuv420p`;

console.log(`\n▸ Compressing${isHdr ? " (HDR → SDR tone-map)" : ""}…`);
ff([
  "-i", input,
  "-vf", vf,
  "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-profile:v", "high",
  "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
  "-c:a", "aac", "-b:a", "128k", "-ac", "2",
  "-movflags", "+faststart",
  outMp4,
]);
const durationSec = Number(
  run(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", outMp4]).trim(),
);
const sizeMb = (statSync(outMp4).size / 1e6).toFixed(1);
console.log(`  ${sizeMb} MB, ${durationSec.toFixed(1)} s`);
if (durationSec > 150) console.warn("  ⚠ Over 2.5 minutes. Recruiters rarely watch past 90 s.");

// ── 2. poster ───────────────────────────────────────────────────────────────
console.log("▸ Poster frame…");
const posterAt = Math.min(1.5, durationSec / 3).toFixed(2);
ff(["-ss", posterAt, "-i", outMp4, "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "3", posterJpg]);

// ── 3. captions ─────────────────────────────────────────────────────────────
console.log(`▸ Transcribing with Whisper (${opts.model}, first run downloads the model)…`);
ff(["-i", outMp4, "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", wav]);
execFileSync(PYTHON, ["-I", path.join(ROOT, "scripts/video/transcribe.py"), wav, vtt, transcriptTxt, opts.model], {
  stdio: "inherit",
});

// ── 4. upload ───────────────────────────────────────────────────────────────
let videoUrl;
if (opts["no-upload"]) {
  copyFileSync(outMp4, path.join(PUBLIC_V, `${slug}.mp4`));
  videoUrl = `/v/${slug}.mp4`;
  console.log("▸ --no-upload: copied to public/v/ (local preview only, gitignored)");
} else {
  const envFile = path.join(ROOT, ".env.local");
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    fail("BLOB_READ_WRITE_TOKEN missing from .env.local (or rerun with --no-upload to preview locally).");
  }
  const { put } = await import("@vercel/blob");
  console.log("▸ Uploading to Vercel Blob…");
  const blob = await put(`intro/${slug}.mp4`, readFileSync(outMp4), {
    access: "public",
    addRandomSuffix: true,
    contentType: "video/mp4",
    multipart: true,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  videoUrl = blob.url;
}

// ── 5. data entry ───────────────────────────────────────────────────────────
const data = JSON.parse(readFileSync(DATA, "utf8"));
const prev = data.videos[slug];
data.videos[slug] = {
  slug,
  company,
  ...(opts.recipient ?? prev?.recipient ? { recipient: opts.recipient ?? prev.recipient } : {}),
  ...(opts.role ?? prev?.role ? { role: opts.role ?? prev.role } : {}),
  tldr: prev?.tldr ?? [],
  videoUrl,
  captions: `/v/${slug}.vtt`,
  poster: `/v/${slug}.jpg`,
  durationSec: Math.round(durationSec),
  createdAt: prev?.createdAt ?? new Date().toISOString().slice(0, 10),
};
writeFileSync(DATA, JSON.stringify(data, null, 2) + "\n");

console.log(`
✔ Done: /v/${slug}

Transcript (check names and numbers, then fix any typos in public/v/${slug}.vtt):
──────────────────────────────────────────────────────────────────────────────
${readFileSync(transcriptTxt, "utf8").trim()}
──────────────────────────────────────────────────────────────────────────────
Next: add 2–4 TLDR bullets to src/data/videos.json → "${slug}".tldr, then commit + push.
Link: https://connorgorman.ca/v/${slug}
`);
