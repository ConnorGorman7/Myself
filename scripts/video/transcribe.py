"""Transcribe an audio file to WebVTT captions with faster-whisper (runs locally, CPU).

Usage: transcribe.py <audio.wav> <out.vtt> <transcript.txt> [model]

Cues are built from word timestamps so they stay short and readable:
max 2 lines of ~42 chars, max ~6 s, breaking early at sentence ends.
"""

import sys
import wave

import numpy as np
from faster_whisper import WhisperModel

MAX_LINE = 42
MAX_CUE_CHARS = MAX_LINE * 2
MAX_CUE_SEC = 6.0

# Biases the model toward spelling these correctly.
VOCAB = (
    "Connor Gorman. Novari Health, VitalHub. Queen's University, Kingston, Ottawa. "
    "Azure OpenAI, LLM, RAG, IDP, C#, Python, TypeScript. Cultivate Kingston. TN visa."
)


def ts(sec: float) -> str:
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def wrap(text: str) -> str:
    """Split one cue into at most two balanced lines."""
    if len(text) <= MAX_LINE:
        return text
    words = text.split()
    best, best_diff = text, len(text)
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        diff = abs(len(a) - len(b))
        if diff < best_diff:
            best, best_diff = f"{a}\n{b}", diff
    return best


def load_wav(path: str) -> np.ndarray:
    """Read the 16 kHz mono s16 WAV that process.mjs writes.

    Passing samples directly skips faster-whisper's PyAV decoder, which breaks
    across PyAV versions.
    """
    with wave.open(path, "rb") as w:
        assert w.getframerate() == 16000 and w.getnchannels() == 1 and w.getsampwidth() == 2
        pcm = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return pcm.astype(np.float32) / 32768.0


def main() -> None:
    audio, out_vtt, out_txt = sys.argv[1], sys.argv[2], sys.argv[3]
    model_name = sys.argv[4] if len(sys.argv) > 4 else "medium.en"

    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(
        load_wav(audio),
        language="en",
        word_timestamps=True,
        vad_filter=True,
        initial_prompt=VOCAB,
    )

    words = [w for seg in segments for w in (seg.words or [])]
    cues: list[tuple[float, float, str]] = []
    cur: list = []

    def flush() -> None:
        if cur:
            text = "".join(w.word for w in cur).strip()
            cues.append((cur[0].start, cur[-1].end, text))
            cur.clear()

    for w in words:
        candidate = "".join(x.word for x in cur + [w]).strip()
        too_long = len(candidate) > MAX_CUE_CHARS
        too_slow = cur and (w.end - cur[0].start) > MAX_CUE_SEC
        if cur and (too_long or too_slow):
            flush()
        cur.append(w)
        if w.word.strip().endswith((".", "?", "!")) and len("".join(x.word for x in cur)) > 20:
            flush()
    flush()

    with open(out_vtt, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for i, (start, end, text) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(start)} --> {ts(end)}\n{wrap(text)}\n\n")

    transcript = " ".join(text for _, _, text in cues)
    with open(out_txt, "w", encoding="utf-8") as f:
        f.write(transcript + "\n")
    print(f"{len(cues)} cues written")


if __name__ == "__main__":
    main()
