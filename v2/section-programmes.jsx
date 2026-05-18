/* eslint-disable */
// ii. Programmes — four chapter spreads, alternating left/right.

const PROGRAMMES = [
  {
    no: "01.",
    name: "Literature & Composition",
    range: "Years 9 to 13",
    body:
      "A close reading practice that takes the long view. We work through the set texts in full, not in summary, and we write about them in our own voices. The aim is not to score a paper; the aim is to leave Chrysalis able to think about a poem and say something true about it. The papers come along because of that, not in spite of it.",
    looks: [
      "Two close-reading sessions a week",
      "Weekly written response, marked in pencil",
      "Termly tutorial with the founder",
    ],
  },
  {
    no: "02.",
    name: "Examination Preparation",
    range: "IGCSE · IB · A-Level · CBSE",
    body:
      "Boards are a craft of their own and we treat them as one. Students learn the rubrics, the marking schemes, and the small, surprising things that distinguish a top band from a comfortable band. We do this in the second half of the year. The first half is reading. The order matters.",
    looks: [
      "Past papers timed and annotated in tutorial",
      "Marker-eye feedback on every answer",
      "Mock weeks at half-term and at full term",
    ],
  },
  {
    no: "03.",
    name: "Reading Seminars",
    range: "Private cohorts",
    body:
      "Small groups, four students each, gathered around a single text for a term. Recent seminars: the late Auden, the short stories of Mavis Gallant, the political essays of James Baldwin. The seminar is not for the syllabus; it is for the habit. We have found that the habit is what makes the syllabus inevitable.",
    looks: [
      "Four students, one tutor, one text",
      "Discussion-led, no slides, no projector",
      "One short paper at term's end, read aloud",
    ],
  },
  {
    no: "04.",
    name: "University Writing",
    range: "UCAS · Common App · SOPs",
    body:
      "We do not write our students' essays for them. We sit beside them while they write their own. The Chrysalis personal statement is recognisable because it sounds like the student who wrote it, which is the only thing an admissions reader is really looking for. Six drafts is the average. One has gone to thirteen.",
    looks: [
      "Up to twelve drafts, line-edited",
      "One supervisor through the cycle",
      "Interview rehearsal in the final fortnight",
    ],
  },
];

function ProgrammesSection() {
  return (
    <section id="programmes" className="section">
      <div className="wrap wrap-narrow">
        <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
          ii. &nbsp; Programmes
        </div>
        <RevealOnScroll>
          <h2
            className="section-title"
            style={{ margin: 0, maxWidth: "16ch" }}
          >
            Four chapters of <em className="italic-plum">study</em>.
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
            The studio offers four lines of work, each held by a tutor who has
            taught it for the better part of a decade. There is no entry test.
            There is a conversation, and a reading.
          </p>
        </RevealOnScroll>
      </div>

      <div className="wrap" style={{ marginTop: "clamp(4rem, 8vw, 7rem)" }}>
        {PROGRAMMES.map((p, i) => (
          <Chapter key={p.no} programme={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Chapter({ programme, flip }) {
  return (
    <article
      className="chapter"
      style={{
        position: "relative",
        padding: "clamp(3rem, 6vw, 5rem) 0",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "clamp(2rem, 4vw, 3.5rem)",
          alignItems: "start",
        }}
        className={`chapter-grid ${flip ? "chapter-flip" : ""}`}
      >
        <div
          style={{
            position: "relative",
            minHeight: "clamp(220px, 28vw, 360px)",
          }}
        >
          <div
            className="chapter-num"
            style={{
              position: "absolute",
              left: flip ? "auto" : "-1.2rem",
              right: flip ? "-1.2rem" : "auto",
              top: "-1.4rem",
              fontSize: "clamp(8rem, 18vw, 18rem)",
              lineHeight: 0.85,
            }}
          >
            {programme.no}
          </div>
          <div className="placeholder" style={{ position: "absolute", inset: 0, marginTop: "5rem" }}>
            <span className="placeholder-caption">
              Plate {programme.no.replace(".", "")} · {programme.name.toLowerCase()}
            </span>
          </div>
        </div>

        <div>
          <RevealOnScroll>
            <div className="eyebrow" style={{ color: "var(--heliotrope)" }}>
              {programme.range}
            </div>
            <h3
              className="display"
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                margin: "0.8rem 0 1.6rem",
                lineHeight: 1.04,
              }}
            >
              {programme.name}
            </h3>
            <p
              className="body-prose"
              style={{ color: "rgba(242,235,224,0.78)", maxWidth: "56ch" }}
            >
              {programme.body}
            </p>
            <div
              style={{
                marginTop: "1.8rem",
                borderTop: "1px solid var(--hairline)",
                paddingTop: "1.4rem",
              }}
            >
              <div className="eyebrow" style={{ marginBottom: "0.8rem" }}>
                What this looks like
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {programme.looks.map((l, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.8rem",
                      fontFamily: "var(--ff-mono)",
                      fontSize: "0.78rem",
                      letterSpacing: "0.08em",
                      color: "rgba(242,235,224,0.82)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--heliotrope)",
                        letterSpacing: "0.2em",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .chapter-grid { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr) !important; }
          .chapter-flip > div:first-child { order: 2; }
          .chapter-flip > div:last-child  { order: 1; }
        }
      `}</style>
    </article>
  );
}

window.ProgrammesSection = ProgrammesSection;
