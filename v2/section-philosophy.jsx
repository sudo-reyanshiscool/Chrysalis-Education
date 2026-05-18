/* eslint-disable */
// i. Philosophy
// A full-bleed pull-quote band, two prose statements with marginalia,
// and counted stats.

function PhilosophySection() {
  const numRef1 = React.useRef(null);
  const numRef2 = React.useRef(null);
  const numRef3 = React.useRef(null);

  React.useEffect(() => {
    const animateNumber = (el, target, duration = 1600) => {
      if (!el) return;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-out
        const e = 1 - Math.pow(1 - t, 3);
        const val = Math.round(target * e);
        el.textContent = String(val);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const targets = [
      { el: numRef1.current, n: 2011 },
      { el: numRef2.current, n: 14 },
      { el: numRef3.current, n: 3 },
    ];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = "1";
            const t = targets.find((tt) => tt.el === entry.target);
            if (t) animateNumber(t.el, t.n);
          }
        });
      },
      { threshold: 0.5 }
    );
    targets.forEach((t) => t.el && io.observe(t.el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="philosophy" className="section">
      <div className="wrap wrap-narrow">
        <div className="eyebrow" style={{ marginBottom: "2rem" }}>
          i. &nbsp; Philosophy
        </div>
      </div>

      {/* Full-width pull-quote band */}
      <div className="pullband">
        <div className="wrap">
          <div className="mb-block">
            <div className="mb-content">
              <RevealOnScroll>
                <h2
                  className="display"
                  style={{
                    fontSize: "clamp(2.4rem, 6.5vw, 5.6rem)",
                    lineHeight: 1.04,
                    margin: 0,
                    maxWidth: "20ch",
                  }}
                >
                  Every lesson is{" "}
                  <em className="italic-plum-strong">prepared</em>. Every
                  student is <em className="italic-plum-strong">read</em>.
                </h2>
              </RevealOnScroll>
            </div>
            <aside className="mb-rail">
              <Marginalia rotate={-2}>
                this is the whole thesis.
              </Marginalia>
            </aside>
          </div>
        </div>
      </div>

      {/* Below the band: two statements + stat row */}
      <div className="wrap" style={{ marginTop: "clamp(5rem, 9vw, 8rem)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          <div className="mb-block">
            <div className="mb-content">
              <p
                className="display"
                style={{
                  fontSize: "clamp(1.6rem, 2.6vw, 2.6rem)",
                  lineHeight: 1.18,
                  margin: 0,
                  maxWidth: "26ch",
                }}
              >
                We do not chase{" "}
                <em className="italic-plum">trends</em>.
              </p>
              <p
                className="body-prose"
                style={{
                  marginTop: "1.4rem",
                  color: "rgba(242, 235, 224, 0.72)",
                  maxWidth: "52ch",
                }}
              >
                Pedagogy is not a marketplace, and a classroom is not a feed.
                We teach the texts that have weight, in the way they have
                always been taught: slowly, with patience, and in the company
                of a tutor who has read them more than once.
              </p>
            </div>
            <aside className="mb-rail">
              <Marginalia rotate={-1.6}>
                and we do not apologise for it.
              </Marginalia>
            </aside>
          </div>

          <div className="mb-block mb-left">
            <div className="mb-content">
              <p
                className="display"
                style={{
                  fontSize: "clamp(1.6rem, 2.6vw, 2.6rem)",
                  lineHeight: 1.18,
                  margin: 0,
                  maxWidth: "26ch",
                }}
              >
                A class of <em className="italic-plum">four</em>, never a
                lecture of forty.
              </p>
              <p
                className="body-prose"
                style={{
                  marginTop: "1.4rem",
                  color: "rgba(242, 235, 224, 0.72)",
                  maxWidth: "52ch",
                }}
              >
                The work is read aloud. The arguments are made on paper, with
                a pencil in hand. Each student leaves the room having spoken,
                and having been argued with kindly.
              </p>
            </div>
            <aside className="mb-rail">
              <Marginalia rotate={1.2} side="left">
                the way a tutorial used to feel.
              </Marginalia>
            </aside>
          </div>
        </div>

        {/* Stat row */}
        <div
          style={{
            marginTop: "clamp(4rem, 8vw, 7rem)",
            paddingTop: "clamp(2rem, 4vw, 3rem)",
            borderTop: "1px solid var(--hairline)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          <StatBlock numRef={numRef1} suffix="" label="Founded" detail="New Delhi, India" />
          <StatBlock numRef={numRef2} suffix="" label="Years in Studio" detail="and counting" />
          <StatBlock numRef={numRef3} suffix="" label="Readers in Residence" detail="Kavita, Nikasha, Supriya" />
        </div>
      </div>
    </section>
  );
}

function StatBlock({ numRef, suffix, label, detail }) {
  return (
    <div>
      <div className="stat-value">
        <span ref={numRef}>0</span>
        {suffix}
      </div>
      <div
        className="eyebrow"
        style={{ marginTop: "0.6rem", color: "var(--paper)" }}
      >
        {label}
      </div>
      {detail && (
        <div
          className="caption"
          style={{
            marginTop: "0.3rem",
            textTransform: "none",
            letterSpacing: "0.08em",
            fontStyle: "italic",
            fontFamily: "var(--ff-body)",
            fontSize: "0.95rem",
          }}
        >
          {detail}
        </div>
      )}
    </div>
  );
}

// Lightweight reveal helper
function RevealOnScroll({ children }) {
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
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}

window.PhilosophySection = PhilosophySection;
window.RevealOnScroll = RevealOnScroll;
