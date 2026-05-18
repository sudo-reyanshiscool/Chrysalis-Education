/* eslint-disable */
// Closing CTA + footer.
// "Arrange a Consultation" form with hand-drawn plum underlines that animate
// in on focus, and a footer with address + colophon.

function ContactCTA() {
  return (
    <section id="contact" className="section" style={{ paddingBottom: 0 }}>
      <div className="wrap wrap-narrow">
        <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
          v. &nbsp; Arrange a Consultation
        </div>

        <RevealOnScroll>
          <h2
            className="section-title"
            style={{ margin: 0, maxWidth: "18ch" }}
          >
            A first conversation, <em className="italic-plum">no charge</em>.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll>
          <p
            className="body-prose"
            style={{
              marginTop: "1.6rem",
              maxWidth: "56ch",
              color: "rgba(242,235,224,0.72)",
            }}
          >
            Tell us a little about your reader, and we will arrange a first
            conversation with one of the three tutors. There is no fee for the
            consultation, and no obligation to begin.
          </p>
        </RevealOnScroll>

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            marginTop: "clamp(2.5rem, 5vw, 4rem)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 2.4rem) clamp(2rem, 4vw, 3rem)",
          }}
        >
          <PenField label="Parent or guardian" name="name" placeholder="Anita Rao" />
          <PenField label="Email" name="email" type="email" placeholder="anita@example.in" />
          <PenField label="Student name & year" name="student" placeholder="Aarav, Year 11" />
          <PenField label="Examination" name="exam" placeholder="IGCSE / IB / A-Level / CBSE" />
          <div style={{ gridColumn: "1 / -1" }}>
            <PenField
              label="A line about your reader"
              name="note"
              textarea
              placeholder="What they read for pleasure, what they struggle with, what brought you to us."
            />
          </div>
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <p
              className="footnote"
              style={{ textTransform: "none", letterSpacing: "0.08em", fontFamily: "var(--ff-body)", fontStyle: "italic", fontSize: "1rem", color: "rgba(242,235,224,0.55)", margin: 0 }}
            >
              We answer in person, within two working days.
            </p>
            <SubmitButton />
          </div>
        </form>
      </div>

      <Footer />
    </section>
  );
}

function PenField({ label, name, type = "text", placeholder, textarea = false }) {
  const ref = React.useRef(null);
  const underlineRef = React.useRef(null);
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (!underlineRef.current) return;
    underlineRef.current.style.strokeDashoffset = focused ? "0" : "320";
  }, [focused]);

  const sharedProps = {
    id: name,
    name,
    placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: "100%",
      background: "transparent",
      border: 0,
      borderRadius: 0,
      padding: "0.6rem 0 0.8rem",
      fontFamily: "var(--ff-body)",
      fontSize: "1.1rem",
      color: "var(--paper)",
      caretColor: "var(--plum-hot)",
    },
  };

  return (
    <div style={{ position: "relative" }}>
      <label
        htmlFor={name}
        className="eyebrow"
        style={{
          color: focused ? "var(--plum-hot)" : "var(--heliotrope)",
          transition: "color 250ms var(--ease-hover)",
          display: "block",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea ref={ref} rows={3} {...sharedProps} />
      ) : (
        <input ref={ref} type={type} {...sharedProps} />
      )}
      {/* Hand-drawn plum underline */}
      <svg
        width="100%"
        height="6"
        viewBox="0 0 320 6"
        preserveAspectRatio="none"
        style={{
          display: "block",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          color: "var(--plum-hot)",
        }}
        aria-hidden="true"
      >
        {/* baseline (always present, low opacity) */}
        <path
          d="M0 3 C 60 5.4, 140 1.4, 200 3.2 S 320 4, 320 3"
          stroke="var(--hairline-strong)"
          strokeWidth="1"
          fill="none"
        />
        {/* fountain-pen stroke that draws in on focus */}
        <path
          ref={underlineRef}
          d="M0 3 C 60 5.4, 140 1.4, 200 3.2 S 320 4, 320 3"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="320"
          strokeDashoffset="320"
          style={{
            transition: "stroke-dashoffset 500ms var(--ease-entrance)",
          }}
        />
      </svg>
    </div>
  );
}

function SubmitButton() {
  return (
    <button
      type="submit"
      className="submit-btn"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.8rem",
        padding: "1rem 1.6rem 1rem 0",
        fontFamily: "var(--ff-display)",
        fontSize: "1.6rem",
        fontStyle: "italic",
        color: "var(--paper)",
        transition: "color 350ms var(--ease-hover)",
      }}
    >
      <span>Send the note</span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "3rem",
          height: "1px",
          background: "var(--plum-hot)",
          position: "relative",
          transition: "transform 400ms var(--ease-hover)",
          transformOrigin: "left center",
        }}
        className="submit-arrow"
      />
      <style>{`
        .submit-btn:hover { color: var(--heliotrope); }
        .submit-btn:hover .submit-arrow { transform: scaleX(1.7); }
      `}</style>
    </button>
  );
}

function Footer() {
  return (
    <footer
      style={{
        marginTop: "clamp(5rem, 10vw, 9rem)",
        padding: "clamp(3rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 3rem)",
        background: "var(--aubergine)",
        position: "relative",
      }}
    >
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(2.5rem, 4vw, 4rem)",
            alignItems: "start",
          }}
        >
          <div>
            <a
              href="#top"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                color: "var(--paper)",
                fontFamily: "var(--ff-display)",
                fontSize: "1.8rem",
                letterSpacing: "-0.01em",
                marginBottom: "0.8rem",
              }}
            >
              <span
                className="chrysalis-mark"
                style={{ width: 30, height: 30 }}
                aria-hidden="true"
              />
              <span>Chrysalis</span>
            </a>
            <p
              className="body-prose"
              style={{
                color: "rgba(242,235,224,0.6)",
                fontStyle: "italic",
                fontSize: "1rem",
                maxWidth: "32ch",
              }}
            >
              A small studio in New Delhi for the teaching of English literature,
              composition, and examination preparation.
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: "0.8rem" }}>
              Studio
            </div>
            <p className="body-prose" style={{ fontSize: "1rem", color: "var(--paper)", lineHeight: 1.6 }}>
              Lajpat Nagar III<br />
              New Delhi 110024<br />
              India
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: "0.8rem" }}>
              Hours
            </div>
            <p className="body-prose" style={{ fontSize: "1rem", color: "var(--paper)", lineHeight: 1.6 }}>
              Monday to Friday<br />
              by appointment only<br />
              <span style={{ color: "var(--heliotrope)", fontStyle: "italic" }}>
                study@chrysalis.in
              </span>
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: "0.8rem" }}>
              Index
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                ["Philosophy", "#philosophy"],
                ["Programmes", "#programmes"],
                ["Faculty", "#faculty"],
                ["Voices", "#voices"],
                ["Arrange a consultation", "#contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    style={{
                      fontFamily: "var(--ff-mono)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(242,235,224,0.7)",
                      transition: "color 250ms var(--ease-hover)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--heliotrope)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(242,235,224,0.7)")}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: "clamp(3rem, 6vw, 5rem)",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--hairline)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span className="footnote">
            © Chrysalis 2011 — 2026. &nbsp;Set in Instrument Serif & EB Garamond.
          </span>
          <span className="footnote">
            <span style={{ color: "var(--heliotrope)" }}>Colophon</span> · Lajpat Nagar
          </span>
        </div>
      </div>
    </footer>
  );
}

window.ContactCTA = ContactCTA;
