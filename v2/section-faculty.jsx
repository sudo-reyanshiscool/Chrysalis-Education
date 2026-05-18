/* eslint-disable */
// iii. Faculty — three editorial portrait spreads with parallax on the image plate.

const FACULTY = [
  {
    name: "Kavita Chandhok",
    role: "Founder & Director",
    subRole: "Holistic Pedagogy",
    bio: [
      "Kavita founded Chrysalis in 2011 after eighteen years in international classrooms and an English degree from Lady Shri Ram. She still teaches the senior literature seminar every week, on the principle that a director who does not teach is something other than a director.",
      "Her students have read for English at Cambridge, Oxford, and Ashoka; more importantly, several have come back to teach with her.",
    ],
    initials: "KC",
    side: "left",
  },
  {
    name: "Nikasha",
    role: "Senior Tutor",
    subRole: "Composition & Drama",
    bio: [
      "Nikasha holds an MA in English Literature and trained at the Royal Court Young Writers' Programme. She runs the composition workshop and the Wednesday evening play-reading, in which students read whole acts aloud and then argue about them.",
      "Her marking is famously slow and famously useful. We do not apologise for the first; we are quietly proud of the second.",
    ],
    initials: "N",
    side: "right",
  },
  {
    name: "Supriya",
    role: "Tutor",
    subRole: "Reading & Foundations",
    bio: [
      "Supriya teaches the youngest readers at Chrysalis, from Year 7 to Year 10. She holds an MPhil in Comparative Literature from JNU and a stubborn belief that there are no slow readers, only impatient classrooms.",
      "Her sessions begin with twenty minutes of reading in the room. Phones go in the drawer. Books come out. The drawer is famous.",
    ],
    initials: "S",
    side: "left",
  },
];

function FacultySection() {
  return (
    <section id="faculty" className="section">
      <div className="wrap wrap-narrow">
        <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
          iii. &nbsp; Faculty
        </div>
        <RevealOnScroll>
          <h2
            className="section-title"
            style={{ margin: 0, maxWidth: "18ch" }}
          >
            Three readers in <em className="italic-plum">residence</em>.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll>
          <p
            className="body-prose"
            style={{
              marginTop: "1.6rem",
              maxWidth: "58ch",
              color: "rgba(242,235,224,0.72)",
            }}
          >
            Chrysalis is not a tutoring agency. Each programme is taught by
            one of three tutors, who know each student by name, by reading
            history, and by the shape of their sentences.
          </p>
        </RevealOnScroll>
      </div>

      <div className="wrap" style={{ marginTop: "clamp(4rem, 8vw, 7rem)" }}>
        {FACULTY.map((f, i) => (
          <FacultySpread key={f.name} f={f} index={i} />
        ))}
      </div>
    </section>
  );
}

function FacultySpread({ f, index }) {
  const portraitRef = React.useRef(null);

  // Soft parallax on the portrait plate
  React.useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;
    let rafId = 0;
    let pending = false;
    const apply = () => {
      pending = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Only animate while in/near viewport
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) / vh; // -1..1 across the viewport
      const ty = offset * -28; // px
      el.style.transform = `translate3d(0, ${ty}px, 0)`;
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

  const flip = f.side === "right";

  return (
    <article
      className="faculty-spread"
      style={{
        position: "relative",
        padding: "clamp(3rem, 6vw, 5rem) 0",
        borderTop: index === 0 ? "1px solid var(--hairline)" : "1px solid var(--hairline)",
      }}
    >
      <div
        className={`faculty-grid ${flip ? "faculty-flip" : ""}`}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "clamp(2rem, 4vw, 4rem)",
          alignItems: "start",
        }}
      >
        {/* Portrait plate */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            ref={portraitRef}
            style={{
              willChange: "transform",
            }}
          >
            <div
              className="placeholder"
              style={{ aspectRatio: "3 / 4", width: "100%" }}
            >
              <span className="placeholder-caption">
                Portrait pending · {f.name.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <RevealOnScroll>
            <div
              className="eyebrow"
              style={{ color: "var(--heliotrope)" }}
            >
              {String(index + 1).padStart(2, "0")} &nbsp; · &nbsp; Faculty
            </div>
            <h3
              className="display"
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
                margin: "0.8rem 0 0.5rem",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
              }}
            >
              {f.name}
            </h3>
            <div
              className="display"
              style={{
                fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                color: "var(--plum-hot)",
                fontStyle: "italic",
                marginBottom: "1.6rem",
              }}
            >
              {f.role} &nbsp;·&nbsp;{" "}
              <span style={{ color: "var(--heliotrope)", fontStyle: "italic" }}>
                {f.subRole}
              </span>
            </div>
            {f.bio.map((para, i) => (
              <p
                key={i}
                className="body-prose"
                style={{
                  color: "rgba(242,235,224,0.78)",
                  maxWidth: "52ch",
                  marginTop: i === 0 ? 0 : "1.1rem",
                }}
              >
                {para}
              </p>
            ))}

            {/* Signature mark */}
            <SignatureMark initials={f.initials} />
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .faculty-grid { grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr) !important; }
          .faculty-flip > div:first-child { order: 2; }
          .faculty-flip > div:last-child  { order: 1; }
        }
      `}</style>
    </article>
  );
}

function SignatureMark({ initials }) {
  // A small SVG that mimics an inked signature flourish, in plum.
  return (
    <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      <svg
        width="120"
        height="48"
        viewBox="0 0 120 48"
        fill="none"
        aria-hidden="true"
        style={{ color: "var(--plum-hot)" }}
      >
        <path
          d="M2 38 C 14 8, 30 8, 26 30 C 23 44, 12 40, 22 24 C 32 8, 50 8, 46 28 C 43 42, 32 38, 40 24 C 50 8, 70 8, 70 28 C 70 40, 64 40, 70 30 L 110 18"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M104 14 L 110 18 L 108 24"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--ff-hand)",
          fontSize: "1.6rem",
          color: "var(--heliotrope)",
          opacity: 0.9,
        }}
      >
        {initials}.
      </span>
    </div>
  );
}

window.FacultySection = FacultySection;
