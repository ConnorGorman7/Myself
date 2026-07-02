export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-mono text-xs text-text-dim">
          © {new Date().getFullYear()} Connor Gorman
        </span>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/ConnorGorman7"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-text-dim transition-colors hover:text-green"
          >
            GitHub ↗
          </a>
          <a
            href="mailto:connorgorman@live.ca"
            className="font-mono text-xs text-text-dim transition-colors hover:text-green"
          >
            Email ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
