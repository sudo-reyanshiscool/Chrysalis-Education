/* eslint-disable */
// Top nav — ported from Hero.html with the design vocabulary kept:
// Chrysalis mask-icon + Instrument Serif wordmark on the left,
// nav links centred, and a glass "Enquire" pill on the right.

function NavBar() {
  return (
    <nav
      style={{
        position: "relative",
        zIndex: 20,
        padding: "1.6rem clamp(1.25rem, 4vw, 3.5rem)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1400,
          margin: "0 auto",
          gap: "2rem",
        }}
      >
        <a
          href="#top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            color: "var(--paper)",
            fontFamily: "var(--ff-display)",
            fontSize: "1.55rem",
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          <span
            className="chrysalis-mark"
            style={{ width: 26, height: 26 }}
            aria-hidden="true"
          />
          <span>Chrysalis</span>
        </a>

        <div
          className="nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.4rem",
          }}
        >
          <a href="#philosophy" className="nav-link">Philosophy</a>
          <a href="#programmes" className="nav-link">Programmes</a>
          <a href="#faculty"    className="nav-link">Faculty</a>
          <a href="#voices"     className="nav-link">Voices</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="#reading-list"
            className="reading-link"
            style={{
              fontFamily: "var(--ff-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--paper)",
            }}
          >
            Reading List
          </a>
          <a
            href="#contact"
            className="liquid-glass"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.7rem 1.4rem",
              borderRadius: 999,
              fontFamily: "var(--ff-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--paper)",
            }}
          >
            Enquire
          </a>
        </div>
      </div>

      <style>{`
        .nav-link {
          font-family: var(--ff-mono);
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(242,235,224,0.75);
          transition: color 250ms var(--ease-hover);
          position: relative;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0; bottom: -6px;
          width: 0; height: 1px;
          background: var(--heliotrope);
          transition: width 350ms var(--ease-hover);
        }
        .nav-link:hover { color: var(--paper); }
        .nav-link:hover::after { width: 100%; }

        .reading-link {
          position: relative;
          transition: color 250ms var(--ease-hover);
        }
        .reading-link::after {
          content: "";
          position: absolute;
          left: 0; bottom: -4px;
          width: 100%;
          height: 1px;
          background: rgba(242,235,224,0.4);
          transition: background 250ms var(--ease-hover);
        }
        .reading-link:hover { color: var(--heliotrope); }
        .reading-link:hover::after { background: var(--heliotrope); }

        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .reading-link { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

window.NavBar = NavBar;
