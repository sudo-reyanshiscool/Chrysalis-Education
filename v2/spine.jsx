/* eslint-disable */
// Editorial spine — pinned roman numerals on the left rail.
// Items become active when their associated section is the dominant section in view.

function Spine({ items }) {
  const [activeIdx, setActiveIdx] = React.useState(-1);

  React.useEffect(() => {
    if (!items || items.length === 0) return;

    const observe = () => {
      const els = items
        .map((it) => document.getElementById(it.id))
        .filter(Boolean);
      if (els.length === 0) return null;

      const io = new IntersectionObserver(
        (entries) => {
          // Choose the entry with the largest intersectionRatio that is intersecting.
          let bestEl = null;
          let bestRatio = 0;
          els.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            // Use a "centerness" score: how much of the section overlaps the viewport center band
            const top = Math.max(0, rect.top);
            const bot = Math.min(vh, rect.bottom);
            const visible = Math.max(0, bot - top);
            const score = visible / Math.min(rect.height || 1, vh);
            if (score > bestRatio) {
              bestRatio = score;
              bestEl = el;
            }
          });
          if (bestEl) {
            const idx = els.findIndex((e) => e === bestEl);
            setActiveIdx(idx);
          }
        },
        { threshold: [0, 0.15, 0.35, 0.55, 0.75] }
      );
      els.forEach((el) => io.observe(el));
      const onScroll = () => {
        // Cheap recompute on scroll to keep active in sync
        let bestEl = null;
        let bestScore = 0;
        els.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const top = Math.max(0, rect.top);
          const bot = Math.min(vh, rect.bottom);
          const visible = Math.max(0, bot - top);
          const score = visible / Math.min(rect.height || 1, vh);
          if (score > bestScore) {
            bestScore = score;
            bestEl = el;
          }
        });
        if (bestEl) {
          const idx = els.findIndex((e) => e === bestEl);
          setActiveIdx(idx);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    };

    const cleanup = observe();
    return cleanup;
  }, [items]);

  const roman = ["i.", "ii.", "iii.", "iv.", "v.", "vi."];

  return (
    <nav className="spine" aria-label="Section guide">
      {items.map((it, i) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          className={`spine-item ${activeIdx === i ? "is-active" : ""}`}
          style={{ pointerEvents: "auto" }}
          aria-label={`Jump to ${it.label}`}
        >
          {roman[i]} &nbsp; {it.label}
        </a>
      ))}
    </nav>
  );
}

window.Spine = Spine;
