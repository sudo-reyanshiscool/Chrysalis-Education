"use client";

import {
  useEffect,
  useRef,
  useState,
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from "react";

/* ---------- Icons ---------- */
type IconProps = SVGProps<SVGSVGElement> & { size?: number; children?: ReactNode };
const Icon = ({ children, size = 24, ...p }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    {children}
  </svg>
);
const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Icon>
);
const Instagram = (p: IconProps) => (
  <Icon {...p}>
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </Icon>
);
const Phone = (p: IconProps) => (
  <Icon {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </Icon>
);
const MapPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

/* ---------- Slide list ---------- */
const SLIDE_IDS = [
  "hero",
  "thesis",
  "about",
  "programmes",
  "boards",
  "faculty",
  "testimonials",
  "faq",
  "contact",
] as const;
const SLIDE_LABELS = [
  "Chrysalis",
  "Thesis",
  "A Centre",
  "Programmes",
  "Curricula",
  "Faculty",
  "In Their Words",
  "Enquiries",
  "Correspondence",
];
const ROMAN = ["", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii"];

/* ---------- Top nav ---------- */
function TopNav({ activeIdx }: { activeIdx: number }) {
  return (
    <nav className={`top-nav ${activeIdx > 0 ? "solid" : ""}`}>
      <a
        href="#hero"
        className="flex items-center gap-2.5"
        data-cursor="link"
        style={{ color: "var(--cream)" }}
      >
        <span className="chrysalis-mark" style={{ width: 26, height: 26 }} aria-hidden="true" />
        <span className="display" style={{ fontSize: "1.35rem" }}>
          Chrysalis
        </span>
      </a>
      <div className="hidden md:flex items-center gap-9">
        {(
          [
            ["About", "about"],
            ["Programmes", "programmes"],
            ["Faculty", "faculty"],
            ["Voices", "testimonials"],
            ["Contact", "contact"],
          ] as const
        ).map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            className="serif-body"
            data-cursor="link"
            style={{
              color: "rgba(242,235,224,0.78)",
              fontSize: "1.02rem",
              transition: "color 300ms",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--cream)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "rgba(242,235,224,0.78)")}
          >
            {label}
          </a>
        ))}
      </div>
      <a
        href="#contact"
        className="liquid-glass pill-btn"
        data-cursor="link"
        style={{ padding: "0.55rem 1.4rem", fontSize: "0.95rem" }}
      >
        Enquire
      </a>
    </nav>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadingOutRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const cancel = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    const anim = (from: number, to: number, dur: number) => {
      cancel();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        v.style.opacity = String(from + (to - from) * t);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(tick);
    };
    const fadeIn = () => {
      fadingOutRef.current = false;
      anim(parseFloat(v.style.opacity || "0"), 1, 500);
    };
    const fadeOut = () => anim(parseFloat(v.style.opacity || "1"), 0, 500);
    const onLoaded = () => {
      v.style.opacity = "0";
      v.play().catch(() => {});
      fadeIn();
    };
    const onTime = () => {
      if (!v.duration) return;
      if (v.duration - v.currentTime <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeOut();
      }
    };
    const onEnded = () => {
      v.style.opacity = "0";
      cancel();
      setTimeout(() => {
        v.currentTime = 0;
        v.play().catch(() => {});
        fadeIn();
      }, 100);
    };
    v.style.opacity = "0";
    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    if (v.readyState >= 2) onLoaded();
    return () => {
      cancel();
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => titleRef.current && titleRef.current.classList.add("go"), 240);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      className="slide hero-shell"
      style={{ padding: 0, justifyContent: "flex-start" }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,8,23,0.25) 0%, rgba(14,8,23,0.40) 60%, rgba(14,8,23,0.85) 100%), radial-gradient(70% 60% at 50% 50%, rgba(142,91,184,0.20), rgba(142,91,184,0) 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full w-full">
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 text-center"
          style={{ transform: "translateY(-6%)" }}
        >
          <p className="eyebrow mb-8 hero-fx" style={{ transitionDelay: "400ms" }}>
            Est. 2011
            <span
              style={{
                display: "inline-block",
                width: 48,
                height: 1,
                background: "currentColor",
                margin: "0 0.9rem",
                opacity: 0.6,
              }}
            />
            A Centre for English Studies
            <span
              style={{
                display: "inline-block",
                width: 48,
                height: 1,
                background: "currentColor",
                margin: "0 0.9rem",
                opacity: 0.6,
              }}
            />
            New Delhi
          </p>

          <h1
            ref={titleRef}
            className="hero-title display italic-plum"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              lineHeight: 0.95,
              color: "var(--cream)",
              margin: "0 0 2rem",
              maxWidth: "14ch",
            }}
          >
            {["Language,", "refined", "through", "craft."].map((w, i) => (
              <span
                key={i}
                className="hero-word"
                style={{
                  display: "inline-block",
                  marginRight: "0.32em",
                  transitionDelay: `${i * 120 + 240}ms`,
                }}
              >
                {w === "craft." ? <em>craft.</em> : w}
              </span>
            ))}
          </h1>

          <p
            className="serif-body hero-fx"
            style={{
              color: "rgba(242,235,224,0.78)",
              fontSize: "1.25rem",
              maxWidth: "34rem",
              lineHeight: 1.55,
              margin: "0 0 2.5rem",
              transitionDelay: "900ms",
            }}
          >
            A studio in New Delhi devoted to English literature, composition, and the patient work
            of thinking well on the page.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4 hero-fx"
            style={{ transitionDelay: "1100ms" }}
          >
            <a href="#programmes" className="liquid-glass pill-btn" data-cursor="link">
              Explore the Programmes
            </a>
            <a href="#contact" className="pill-btn" data-cursor="link">
              Arrange a Consultation
              <span className="arrow">
                <ArrowRight size={18} />
              </span>
            </a>
          </div>
        </div>

        <div className="scroll-cue">
          <span>Read on</span>
          <span className="line" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Word-stagger heading ---------- */
function StaggerHeading({
  children,
  className = "",
  style = {},
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const arr = Children.toArray(children);
  let i = 0;
  const out: ReactNode[] = [];
  arr.forEach((child) => {
    if (typeof child === "string") {
      child
        .split(/(\s+)/)
        .filter((s) => s)
        .forEach((word) => {
          if (/^\s+$/.test(word)) {
            out.push(
              <span key={"s" + i} style={{ display: "inline" }}>
                {" "}
              </span>,
            );
          } else {
            out.push(
              <span key={"w" + i} style={{ transitionDelay: `${300 + i * 70}ms` }}>
                {word}
              </span>,
            );
            i++;
          }
        });
    } else if (isValidElement(child)) {
      const el = child as ReactElement<{ style?: CSSProperties }>;
      out.push(
        cloneElement(el, {
          key: "j" + i,
          style: { ...(el.props.style || {}), transitionDelay: `${300 + i * 70}ms` },
        }),
      );
      i++;
    } else {
      out.push(child);
    }
  });
  return (
    <h2 className={`display italic-plum word-stagger ${className}`} style={style}>
      {out}
    </h2>
  );
}

/* ---------- THESIS ---------- */
function Thesis() {
  return (
    <section id="thesis" className="slide" style={{ textAlign: "center", alignItems: "center" }}>
      <div
        className="slide-inner"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <p className="eyebrow" data-anim data-delay="1">
          <span className="rule-draw" />
          The thesis of the studio
        </p>

        <StaggerHeading
          className="mt-8"
          style={{
            fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)",
            lineHeight: 1.05,
            maxWidth: "18ch",
            color: "var(--cream)",
            textAlign: "center",
          }}
        >
          {"Every lesson is prepared. "}
          <em>Every student is read.</em>
        </StaggerHeading>

        <p
          className="serif-body italic"
          data-anim
          data-delay="5"
          style={{
            color: "rgba(242,235,224,0.62)",
            maxWidth: "30rem",
            fontSize: "1.15rem",
            lineHeight: 1.6,
            marginTop: "3rem",
            textAlign: "center",
          }}
        >
          We do not chase trends. We do not shortcut the work. What we offer is older and plainer
          than that: attention, time, and the patient company of people who love the language.
        </p>

        <span
          className="script"
          data-anim
          data-delay="6"
          style={{
            color: "var(--plum)",
            fontSize: "1.6rem",
            marginTop: "2.5rem",
            transform: "rotate(-1.5deg)",
            display: "inline-block",
          }}
        >
          this is the whole thesis.
        </span>
      </div>
    </section>
  );
}

/* ---------- ABOUT ---------- */
function Stat({
  n,
  label,
  suffix = "",
  delay = 3,
}: {
  n: number;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const check = () => {
      if (started) return;
      const slide = el.closest(".slide");
      if (slide && slide.classList.contains("is-active")) {
        started = true;
        const start = Date.now();
        const dur = 1600;
        const id = setInterval(() => {
          const t = Math.min(1, (Date.now() - start) / dur);
          setVal(Math.round((1 - Math.pow(1 - t, 3)) * n));
          if (t >= 1) clearInterval(id);
        }, 30);
      }
    };
    const id = setInterval(check, 200);
    check();
    return () => clearInterval(id);
  }, [n]);
  return (
    <div ref={ref} data-anim data-delay={delay}>
      <div className="stat-num">
        {val}
        {suffix}
      </div>
      <div className="mono" style={{ color: "rgba(242,235,224,0.55)", marginTop: "0.5rem" }}>
        {label}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="slide">
      <div className="slide-inner">
        <p className="eyebrow" data-anim data-delay="1">
          <span className="rule-draw" />
          <span>i.</span>&nbsp;&nbsp;A centre
        </p>
        <StaggerHeading
          className="mt-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.02,
            color: "var(--cream)",
            marginBottom: "3rem",
            maxWidth: "24ch",
          }}
        >
          {"A quiet place for "}
          <em>serious</em>
          {" study."}
        </StaggerHeading>

        <div className="grid md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-7">
            <p
              data-anim
              data-delay="3"
              className="serif-body"
              style={{
                fontSize: "1.3rem",
                lineHeight: 1.55,
                color: "rgba(242,235,224,0.92)",
                marginBottom: "1.5rem",
              }}
            >
              Named for the chrysalis, that patient, hidden stage of transformation, our centre was
              founded in 2011 on a simple conviction: that command of the English language is
              cultivated slowly, in conversation with experienced teachers and enduring texts.
            </p>
            <p
              data-anim
              data-delay="4"
              className="serif-body"
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.65,
                color: "rgba(242,235,224,0.72)",
                maxWidth: "34rem",
              }}
            >
              Our tutors are career educators who have spent decades reading closely and teaching
              with care.
            </p>
          </div>

          <div className="md:col-span-5">
            <div
              className="grid grid-cols-2 gap-8"
              style={{ borderLeft: "1px solid var(--hairline)", paddingLeft: "2rem" }}
            >
              <Stat n={14} label="Years since founding" delay={3} />
              <Stat n={300} label="Students guided" suffix="+" delay={4} />
              <Stat n={3} label="Faculty members" delay={5} />
              <Stat n={6} label="Curricula taught" delay={6} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PROGRAMMES ---------- */
const programmes = [
  {
    num: "01",
    title: "Literature Seminars",
    body:
      "Close reading of poetry, drama, and the novel, from Chaucer to the contemporary, in small discussion-led groups of four to six.",
  },
  {
    num: "02",
    title: "Composition & Style",
    body:
      "Weekly essay instruction grounded in classical rhetoric: argument, clarity, cadence, and the careful revision of one’s own prose.",
  },
  {
    num: "03",
    title: "Examination Preparation",
    body:
      "A Level, O Level, IGCSE, IB, CBSE, and ICSE, with equal attention to technique and substance.",
  },
  {
    num: "04",
    title: "Private Tutorials",
    body:
      "One-to-one mentorship written for one student, whether nurturing a gifted writer or rebuilding fundamentals with patience.",
  },
];

function Programmes() {
  return (
    <section id="programmes" className="slide">
      <div className="slide-inner">
        <p className="eyebrow" data-anim data-delay="1">
          <span className="rule-draw" />
          <span>ii.</span>&nbsp;&nbsp;Programmes
        </p>
        <StaggerHeading
          className="mt-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.02,
            color: "var(--cream)",
            marginBottom: "3rem",
          }}
        >
          {"Programs of "}
          <em>study</em>.
        </StaggerHeading>

        <div className="grid md:grid-cols-2 gap-5">
          {programmes.map((p, i) => (
            <article key={p.num} className="liquid-glass service-card" data-anim data-delay={3 + i}>
              <span className="service-num">{p.num}.</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- BOARDS ---------- */
const boards = [
  { roman: "i.", name: "A Level", note: "Cambridge & Edexcel" },
  { roman: "ii.", name: "O Level", note: "Cambridge Assessment" },
  { roman: "iii.", name: "IGCSE", note: "Cambridge & Edexcel" },
  { roman: "iv.", name: "IB", note: "MYP & Diploma" },
  { roman: "v.", name: "CBSE", note: "Central Board, India" },
  { roman: "vi.", name: "ICSE", note: "Indian School Cert." },
];

function Boards() {
  return (
    <section id="boards" className="slide">
      <div className="slide-inner">
        <p className="eyebrow" data-anim data-delay="1">
          <span className="rule-draw" />
          <span>iii.</span>&nbsp;&nbsp;Curricula
        </p>
        <StaggerHeading
          className="mt-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.02,
            color: "var(--cream)",
            marginBottom: "3rem",
            maxWidth: "22ch",
          }}
        >
          {"Boards we "}
          <em>prepare</em>
          {" for."}
        </StaggerHeading>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {boards.map((b, i) => (
            <div
              key={b.name}
              className="liquid-glass board-card"
              data-anim
              data-delay={3 + Math.floor(i / 2)}
            >
              <div>
                <span className="mono" style={{ color: "var(--heliotrope)" }}>
                  {b.roman}
                </span>
                <h4
                  className="display"
                  style={{
                    fontSize: "1.7rem",
                    color: "var(--cream)",
                    margin: "0.3rem 0 0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {b.name}
                </h4>
                <p
                  className="serif-body italic"
                  style={{
                    color: "rgba(242,235,224,0.6)",
                    margin: "0.4rem 0 0",
                    fontSize: "0.92rem",
                  }}
                >
                  {b.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FACULTY ---------- */
const faculty = [
  {
    name: "Kavita",
    role: "Founder & Head of Holistic Development",
    bio:
      "Kavita draws on years of teaching at The British School New Delhi to shape an approach that reaches beyond academics into how students think, communicate, and carry themselves. That philosophy is the foundation everything here is built on.",
  },
  {
    name: "Nikasha",
    role: "Lead IGCSE & IB Educator",
    bio:
      "A proud alumna of The British School New Delhi, Nikasha brings a rare insider’s view of the very curricula she now teaches. She pairs that firsthand experience with a warm but demanding classroom style.",
  },
  {
    name: "Supriya",
    role: "Primary Educator",
    bio:
      "Supriya turns early learning into something children actually look forward to. Her classroom is structured but joyful, laying the groundwork in literacy, numeracy, and confidence.",
  },
];

function Faculty() {
  return (
    <section id="faculty" className="slide">
      <div className="slide-inner">
        <p className="eyebrow" data-anim data-delay="1">
          <span className="rule-draw" />
          <span>iv.</span>&nbsp;&nbsp;The faculty
        </p>
        <StaggerHeading
          className="mt-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.02,
            color: "var(--cream)",
            marginBottom: "3rem",
          }}
        >
          {"The tutors of "}
          <em>Chrysalis</em>.
        </StaggerHeading>

        <div className="grid md:grid-cols-3 gap-8">
          {faculty.map((f, i) => (
            <article key={f.name} data-anim data-delay={3 + i}>
              <div
                className="placeholder-img"
                style={{ aspectRatio: "4/5", marginBottom: "1.5rem" }}
                data-caption="portrait pending"
              />
              <h3
                className="display"
                style={{
                  fontSize: "2.2rem",
                  color: "var(--cream)",
                  margin: "0 0 0.4rem",
                  lineHeight: 1,
                }}
              >
                {f.name}
              </h3>
              <p
                className="display italic"
                style={{ color: "var(--plum)", fontSize: "1.15rem", margin: "0 0 1rem" }}
              >
                {f.role}
              </p>
              <p
                className="serif-body"
                style={{
                  color: "rgba(242,235,224,0.7)",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.bio}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
const quotes = [
  {
    q: "My daughter arrived at Chrysalis reluctant to write a sentence. She now writes essays with a voice that is unmistakably her own.",
    emp: "a voice that is unmistakably her own",
    who: "Parent, Form V",
  },
  {
    q: "The seminars feel like university the way university ought to feel. Small, demanding, and entirely unhurried.",
    emp: "entirely unhurried",
    who: "A Level Student",
  },
  {
    q: "I credit Chrysalis with the essay that secured my Cambridge offer. The attention to revision was unlike anything I had known.",
    emp: "attention to revision",
    who: "University Matriculant, 2024",
  },
  {
    q: "I walked in thinking I disliked poetry. I walked out having memorised half of Keats’s odes, somehow by accident.",
    emp: "somehow by accident",
    who: "IB Student",
  },
  {
    q: "They gave my writing an ear. I did not know prose could sound like anything until I studied here.",
    emp: "gave my writing an ear",
    who: "Former Student, now reading English at Oxford",
  },
];

function hl(text: string, phrase: string): ReactNode {
  const i = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <em>{text.slice(i, i + phrase.length)}</em>
      {text.slice(i + phrase.length)}
    </>
  );
}

function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % quotes.length), 5800);
    return () => clearInterval(id);
  }, []);
  return (
    <section id="testimonials" className="slide">
      <div className="slide-inner">
        <p className="eyebrow" data-anim data-delay="1">
          <span className="rule-draw" />
          <span>v.</span>&nbsp;&nbsp;In their words
        </p>
        <StaggerHeading
          className="mt-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.02,
            color: "var(--cream)",
            marginBottom: "3rem",
          }}
        >
          {"Notes from "}
          <em>readers</em>.
        </StaggerHeading>

        <div className="testimonial-stack" data-anim data-delay="3">
          {quotes.map((t, i) => (
            <figure key={i} className={`testimonial ${i === idx ? "is-active" : ""}`}>
              <blockquote
                className="display italic-plum"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  lineHeight: 1.18,
                  color: "var(--cream)",
                  margin: 0,
                  maxWidth: "36ch",
                }}
              >
                <span style={{ color: "var(--heliotrope)", opacity: 0.5 }}>“</span>
                {hl(t.q, t.emp)}
                <span style={{ color: "var(--heliotrope)", opacity: 0.5 }}>”</span>
              </blockquote>
              <figcaption
                className="mono"
                style={{
                  color: "var(--heliotrope)",
                  marginTop: "2rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 36,
                    height: 1,
                    background: "currentColor",
                    opacity: 0.6,
                    marginRight: "0.9rem",
                  }}
                />
                {t.who}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="test-dots mt-12" data-anim data-delay="4">
          {quotes.map((_, i) => (
            <button
              key={i}
              className={i === idx ? "is-active" : ""}
              onClick={() => setIdx(i)}
              data-cursor="link"
              aria-label={`Quote ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const faqs = [
  {
    q: "What age groups do you teach?",
    a: "Students from roughly age ten through university entrance, from early literature appreciation to advanced composition.",
  },
  {
    q: "Are sessions one-to-one or in groups?",
    a: "Both. Literature seminars are four to six students; composition and examination preparation are offered privately or in pairs.",
  },
  {
    q: "Do you offer online tuition?",
    a: "Yes. Students outside Delhi attend by video, with shared documents for live annotation.",
  },
  {
    q: "How are fees structured?",
    a: "Fees vary by programme, format, and frequency. Write or call for a tailored proposal.",
  },
  {
    q: "How do I begin?",
    a: "Arrange a brief consultation through the contact form, WhatsApp, or a phone call.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" className="slide">
      <div className="slide-inner">
        <p className="eyebrow" data-anim data-delay="1">
          <span className="rule-draw" />
          <span>vi.</span>&nbsp;&nbsp;Enquiries
        </p>
        <StaggerHeading
          className="mt-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.02,
            color: "var(--cream)",
            marginBottom: "2rem",
          }}
        >
          {"Frequently "}
          <em>asked</em>.
        </StaggerHeading>

        <div data-anim data-delay="3" style={{ maxWidth: "860px" }}>
          {faqs.map((f, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? -1 : i)}
                data-cursor="link"
              >
                <span className="display">{f.q}</span>
                <span className="faq-sign" aria-hidden="true" />
              </button>
              <div className="faq-a">
                <div className="faq-a-inner serif-body">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  const [sent, setSent] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <section id="contact" className="slide">
      <div className="slide-inner">
        <p className="eyebrow" data-anim data-delay="1">
          <span className="rule-draw" />
          <span>vii.</span>&nbsp;&nbsp;Correspondence
        </p>
        <StaggerHeading
          className="mt-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.02,
            color: "var(--cream)",
            marginBottom: "2.5rem",
          }}
        >
          {"Begin a "}
          <em>correspondence</em>.
        </StaggerHeading>

        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-7" data-anim data-delay="3">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <label className="field">
                  <span className="field-label">Your name</span>
                  <input type="text" required className="field-input" data-cursor="link" />
                </label>
                <label className="field">
                  <span className="field-label">Email</span>
                  <input type="email" required className="field-input" data-cursor="link" />
                </label>
              </div>
              <label className="field">
                <span className="field-label">Subject of enquiry</span>
                <input type="text" className="field-input" data-cursor="link" />
              </label>
              <label className="field">
                <span className="field-label">A few sentences about the student</span>
                <textarea rows={4} required className="field-textarea" data-cursor="link" />
              </label>
              <div className="pt-2 flex items-center gap-4 flex-wrap">
                <button type="submit" className="liquid-glass pill-btn" data-cursor="link">
                  Send the letter
                  <span className="arrow">
                    <ArrowRight size={18} />
                  </span>
                </button>
                {sent && (
                  <span
                    className="script"
                    style={{ color: "var(--heliotrope)", fontSize: "1.3rem" }}
                  >
                    thank you — a tutor will write back.
                  </span>
                )}
              </div>
            </form>
          </div>

          <aside className="md:col-span-5" data-anim data-delay="4">
            <p className="mono" style={{ color: "var(--heliotrope)", marginBottom: "1.5rem" }}>
              Or, more directly
            </p>
            <ul className="space-y-5" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <a
                  href="tel:+919810954868"
                  className="flex items-center gap-4 serif-body"
                  data-cursor="link"
                  style={{ color: "var(--cream)", fontSize: "1.05rem" }}
                >
                  <span
                    className="liquid-glass rounded-full p-3 flex"
                    style={{ color: "var(--heliotrope)" }}
                  >
                    <Phone size={18} />
                  </span>
                  +91 98109 54868
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/chrysalisthecenter"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-4 serif-body"
                  data-cursor="link"
                  style={{ color: "var(--cream)", fontSize: "1.05rem" }}
                >
                  <span
                    className="liquid-glass rounded-full p-3 flex"
                    style={{ color: "var(--heliotrope)" }}
                  >
                    <Instagram size={18} />
                  </span>
                  @chrysalisthecenter
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/NNWcwjmY4PgULJU67"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-4 serif-body"
                  data-cursor="link"
                  style={{ color: "var(--cream)", fontSize: "1.05rem" }}
                >
                  <span
                    className="liquid-glass rounded-full p-3 flex"
                    style={{ color: "var(--heliotrope)" }}
                  >
                    <MapPin size={18} />
                  </span>
                  The studio, Lajpat Nagar
                </a>
              </li>
            </ul>

            <p
              className="script"
              style={{
                color: "var(--plum)",
                fontSize: "1.45rem",
                marginTop: "2.8rem",
                transform: "rotate(-1.5deg)",
                maxWidth: "18rem",
              }}
            >
              we read every note that arrives.
            </p>
          </aside>
        </div>

        <div className="mt-20 pt-10" style={{ borderTop: "1px solid var(--hairline)" }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className="chrysalis-mark"
                style={{ width: 22, height: 22, color: "var(--cream)" }}
                aria-hidden="true"
              />
              <span className="display" style={{ fontSize: "1.2rem", color: "var(--cream)" }}>
                Chrysalis
              </span>
            </div>
            <div className="mono" style={{ color: "rgba(242,235,224,0.4)" }}>
              © {year ?? ""} &nbsp;·&nbsp; Est. 2011
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Spine + scroll manager + cursor ---------- */
function SiteChrome({ onActive }: { onActive: (idx: number) => void }) {
  const currentRef = useRef<string | null>(null);

  useEffect(() => {
    const updateActive = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const slides = document.querySelectorAll<HTMLElement>(".slide");
      if (!slides.length) return;
      let best: HTMLElement | null = null;
      let bestVis = 0;
      slides.forEach((s) => {
        const r = s.getBoundingClientRect();
        const top = Math.max(0, r.top);
        const bot = Math.min(vh, r.bottom);
        const vis = Math.max(0, bot - top);
        if (vis > bestVis) {
          bestVis = vis;
          best = s;
        }
      });
      if (!best) return;
      const bestEl = best as HTMLElement;
      if (bestEl.id !== currentRef.current) {
        slides.forEach((s) => {
          if (s === bestEl) s.classList.add("is-active");
          else {
            if (s.classList.contains("is-active")) s.classList.add("has-left");
            s.classList.remove("is-active");
          }
        });
        currentRef.current = bestEl.id;
        const idx = SLIDE_IDS.indexOf(bestEl.id as (typeof SLIDE_IDS)[number]);
        document
          .querySelectorAll<HTMLButtonElement>("#spine button")
          .forEach((b) => b.classList.toggle("is-active", b.dataset.target === bestEl.id));
        onActive(idx);
        const aura = document.querySelector<HTMLElement>(".plum-aura");
        if (aura) {
          const focused = ["thesis", "testimonials", "contact"];
          aura.style.opacity = focused.includes(bestEl.id) ? "1.6" : "1";
        }
      }
      const fill = document.getElementById("progressFill");
      if (fill) {
        const total = document.documentElement.scrollHeight - vh;
        const pct = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
        fill.style.width = (pct * 100).toFixed(2) + "%";
      }
    };
    updateActive();
    const onScroll = () => updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive);
    const ivl = setInterval(updateActive, 250);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActive);
      clearInterval(ivl);
    };
  }, [onActive]);

  // Pen cursor
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    const cursor = document.getElementById("pen-cursor");
    if (!cursor) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx,
      cy = my;
    let lastTrail = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.classList.remove("hidden");
      const now = Date.now();
      if (now - lastTrail > 38) {
        lastTrail = now;
        const dot = document.createElement("span");
        dot.className = "ink-trail-dot";
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
        document.body.appendChild(dot);
        setTimeout(() => {
          dot.style.opacity = "0";
          dot.style.transform = `translate(${(Math.random() - 0.5) * 8}px, ${
            (Math.random() - 0.5) * 8
          }px)`;
        }, 16);
        setTimeout(() => dot.remove(), 720);
      }
    };
    const onLeave = () => cursor.classList.add("hidden");
    const onEnter = () => cursor.classList.remove("hidden");
    const isInteractive = (el: Element | null): boolean => {
      if (!el) return false;
      if (
        el.matches &&
        el.matches('a, button, input, textarea, select, [data-cursor="link"]')
      )
        return true;
      return el.parentElement ? isInteractive(el.parentElement) : false;
    };
    const onOver = (e: MouseEvent) =>
      cursor.classList.toggle("nib-mode", isInteractive(e.target as Element));

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);

    const step = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.transform = `translate(${cx - cursor.offsetWidth / 2}px, ${
        cy - cursor.offsetHeight / 2
      }px)`;
      raf = requestAnimationFrame(step);
    };
    step();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div id="pen-cursor" aria-hidden="true">
        <span className="dot" />
        <svg className="nib" viewBox="0 0 30 30" fill="none">
          <path d="M15 2 L23 14 L18 14 L15 28 L12 14 L7 14 Z" fill="#C5A8E3" opacity="0.95" />
          <circle cx="15" cy="13" r="1.6" fill="#0E0817" />
        </svg>
      </div>

      <div className="progress">
        <div className="progress__fill" id="progressFill" />
      </div>

      <div className="plum-aura" aria-hidden="true" />

      <aside className="spine" id="spine" aria-hidden="true">
        {SLIDE_IDS.map((id, i) => (
          <button
            key={id}
            type="button"
            data-target={id}
            onClick={() => {
              const el = document.getElementById(id);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="num">{ROMAN[i]}</span>
            <span className="tick" />
            <span className="label">{SLIDE_LABELS[i]}</span>
          </button>
        ))}
      </aside>
    </>
  );
}

/* ---------- App ---------- */
export default function ChrysalisSite() {
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <>
      <SiteChrome onActive={setActiveIdx} />
      <TopNav activeIdx={activeIdx} />
      <Hero />
      <Thesis />
      <About />
      <Programmes />
      <Boards />
      <Faculty />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
