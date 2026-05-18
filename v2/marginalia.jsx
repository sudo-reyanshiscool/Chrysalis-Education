/* eslint-disable */
// Marginalia: a hand-script annotation that fades in when scrolled into view.
// Drop it inside any .marginalia-host container so the parent's :hover can brighten it.

function Marginalia({ children, side = "right", rotate = -1.2 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="marginalia"
      style={{
        transform: `translateX(${side === "right" ? "-12px" : "12px"}) rotate(${rotate}deg)`,
        textAlign: side === "left" ? "right" : "left",
      }}
    >
      {children}
    </span>
  );
}

// Two-column block: content + marginalia rail. Collapses to one column < lg.
function MarginaliaBlock({ children, note, side = "right", rotate }) {
  return (
    <div className={`marginalia-host mb-block ${side === "left" ? "mb-left" : ""}`}>
      <div className="mb-content">{children}</div>
      <aside className="mb-rail">
        <Marginalia side={side} rotate={rotate}>{note}</Marginalia>
      </aside>
    </div>
  );
}

window.Marginalia = Marginalia;
window.MarginaliaBlock = MarginaliaBlock;
