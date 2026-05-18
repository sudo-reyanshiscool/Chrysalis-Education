/* eslint-disable */
// iv. Voices — magazine pull-quote spread, one quote per viewport on desktop.
// Includes one non-elite testimonial as the brief specified.

const VOICES = [
  {
    quote: [
      "She came to us disliking ",
      { hi: "poetry" },
      ". She left Chrysalis writing it. Whatever they did in that room, I am ",
      { hi: "grateful" },
      " for.",
    ],
    by: "Anita R., parent of a Year 12 student",
    book: "Keats",
    note: "the kids really do walk in disliking poetry.",
  },
  {
    quote: [
      "We were not looking for a tutor who would polish the essay. We were looking for one who would teach our son to ",
      { hi: "think" },
      ". He has the offer from Cambridge, and a habit of reading on the train. The second matters more.",
    ],
    by: "Vivek M., parent of an A-Level student",
    book: "Cambridge Prospectus",
    note: "the offer was the second-best outcome.",
  },
  {
    quote: [
      "My son arrived at Chrysalis struggling with comprehension. He did not need ",
      { hi: "extension" },
      ". He needed someone to slow down and rebuild the basics with him. That is what Kavita's team did, patiently, for two years.",
    ],
    by: "Priya S., parent of a Year 9 student",
    book: "Notebook",
    note: "this is the work we are most proud of.",
  },
  {
    quote: [
      "I have marked English papers for thirty years and I can tell you a Chrysalis student in the first paragraph. They are the ones who have read the ",
      { hi: "whole text" },
      ", and they are the ones who write like they have.",
    ],
    by: "Examiner, IB English HL (anonymised)",
    book: "Marked Paper",
    note: "we will take this as the compliment it is.",
  },
];

function VoicesSection() {
  return (
    <section id="voices" className="section" style={{ paddingBlock: "clamp(5rem, 11vw, 11rem)" }}>
      <div className="wrap wrap-narrow">
        <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
          iv. &nbsp; Voices
        </div>
        <RevealOnScroll>
          <h2
            className="section-title"
            style={{ margin: 0, maxWidth: "18ch" }}
          >
            What the work has <em className="italic-plum">produced</em>.
          </h2>
        </RevealOnScroll>
      </div>

      <div style={{ marginTop: "clamp(4rem, 8vw, 7rem)" }}>
        {VOICES.map((v, i) => (
          <Voice key={i} v={v} index={i} />
        ))}
      </div>
    </section>
  );
}

function Voice({ v, index }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId = 0;
    let pending = false;
    const apply = () => {
      pending = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) / vh;
      const ty = offset * -40;
      const pageEl = el.querySelector(".voice-bg");
      if (pageEl) pageEl.style.transform = `translate3d(0, ${ty}px, 0)`;
    };
    const onScroll = () => {
      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(apply);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <article
      ref={ref}
      className="voice"
      style={{
        position: "relative",
        padding: "clamp(4rem, 8vw, 7rem) 0",
        borderTop: "1px solid var(--hairline)",
        overflow: "hidden",
      }}
    >
      {/* Faint blurred book-page placeholder behind */}
      <div
        className="voice-bg"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-20% -10%",
          background:
            "radial-gradient(60% 50% at 30% 50%, rgba(169,138,201,0.18) 0%, transparent 60%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />

      <div className="wrap">
        <div
          className="voice-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "clamp(2rem, 4vw, 4rem)",
            alignItems: "center",
          }}
        >
          {/* Book reference plate */}
          <div style={{ position: "relative" }}>
            <div
              className="placeholder"
              style={{ aspectRatio: "4 / 5", width: "100%", maxWidth: 360 }}
            >
              <span className="placeholder-caption">
                Page from · {v.book.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Quote */}
          <div className="marginalia-host">
            <RevealOnScroll>
              <blockquote
                className="display"
                style={{
                  margin: 0,
                  fontSize: "clamp(1.6rem, 3.4vw, 3.2rem)",
                  lineHeight: 1.12,
                  fontStyle: "italic",
                  color: "var(--paper)",
                  letterSpacing: "-0.015em",
                }}
              >
                <span aria-hidden="true" style={{ color: "var(--heliotrope)", opacity: 0.6 }}>
                  “
                </span>
                {v.quote.map((part, i) =>
                  typeof part === "string" ? (
                    <span key={i}>{part}</span>
                  ) : (
                    <em
                      key={i}
                      style={{
                        color: "var(--plum-hot)",
                        fontStyle: "italic",
                      }}
                    >
                      {part.hi}
                    </em>
                  )
                )}
                <span aria-hidden="true" style={{ color: "var(--heliotrope)", opacity: 0.6 }}>
                  ”
                </span>
              </blockquote>

              <div
                style={{
                  marginTop: "1.6rem",
                  fontFamily: "var(--ff-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--plum-hot)",
                  paddingLeft: "2.4rem",
                  position: "relative",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "0.55em",
                    width: "2rem",
                    height: "1px",
                    background: "currentColor",
                    opacity: 0.5,
                  }}
                />
                {v.by}
              </div>

              <div style={{ marginTop: "1rem" }}>
                <Marginalia rotate={index % 2 === 0 ? -1.4 : 1.2}>
                  {v.note}
                </Marginalia>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .voice-grid { grid-template-columns: minmax(0, 0.55fr) minmax(0, 1.2fr) !important; }
        }
      `}</style>
    </article>
  );
}

window.VoicesSection = VoicesSection;
