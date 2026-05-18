/* eslint-disable */
// Hero — looping video plate + scroll-bound kinetic display type.
// The headline "Language, refined through craft." performs as the user scrolls:
//  - The drop-cap "L" gets a plum ink fill rising from baseline upward
//  - The italic word "craft" tracks outward and shifts hue toward plum
//  - All four words land in via word-stagger on mount

const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";
// TODO: replace with the Chrysalis-specific hero video (ink on paper / turning pages)
// when supplied. The fade-loop logic does not depend on this URL.

function Hero() {
  const videoRef = React.useRef(null);
  const fadingOutRef = React.useRef(false);
  const rafRef = React.useRef(null);

  const headingRef = React.useRef(null);
  const craftRef = React.useRef(null);
  const dropFillRef = React.useRef(null);
  const heroSectionRef = React.useRef(null);
  const wordsRef = React.useRef(null);

  // Video fade loop (preserved from original hero spec)
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const cancelAnim = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const animateOpacity = (from, to, duration) => {
      cancelAnim();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        video.style.opacity = String(from + (to - from) * t);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const fadeIn = () => {
      const current = parseFloat(video.style.opacity || "0");
      fadingOutRef.current = false;
      animateOpacity(current, 1, 500);
    };
    const fadeOut = () => {
      const current = parseFloat(video.style.opacity || "1");
      animateOpacity(current, 0, 500);
    };

    const handleLoaded = () => {
      video.style.opacity = "0";
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
      fadeIn();
    };
    const handleTimeUpdate = () => {
      if (!video.duration || isNaN(video.duration)) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeOut();
      }
    };
    const handleEnded = () => {
      video.style.opacity = "0";
      cancelAnim();
      setTimeout(() => {
        video.currentTime = 0;
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
        fadeIn();
      }, 100);
    };

    video.style.opacity = "0";
    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    if (video.readyState >= 2) handleLoaded();

    return () => {
      cancelAnim();
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Word-stagger reveal on mount
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (headingRef.current) headingRef.current.classList.add("is-in");
    }, 220);
    return () => clearTimeout(t);
  }, []);

  // Scroll-bound type transformation
  React.useEffect(() => {
    const heroEl = heroSectionRef.current;
    const craftEl = craftRef.current;
    const fillEl = dropFillRef.current;
    if (!heroEl || !craftEl || !fillEl) return;

    let rafId = 0;
    let pending = false;

    const apply = () => {
      pending = false;
      const rect = heroEl.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when hero top is at viewport top, 1 when bottom has scrolled past viewport top
      const total = Math.max(1, rect.height);
      const p = Math.max(0, Math.min(1, -rect.top / total));

      // Letter tracking: -0.02em → 0.06em
      const tracking = -0.02 + p * 0.08;
      // Hue shift: paper → plum
      // Interpolate between #F2EBE0 and #8853AF
      const lerp = (a, b, t) => Math.round(a + (b - a) * t);
      const r = lerp(0xF2, 0x88, p);
      const g = lerp(0xEB, 0x53, p);
      const b = lerp(0xE0, 0xAF, p);
      craftEl.style.letterSpacing = `${tracking}em`;
      craftEl.style.color = `rgb(${r}, ${g}, ${b})`;

      // Drop cap ink fill height: 0% → 100% as scroll progresses through first half
      const fillP = Math.max(0, Math.min(1, p * 1.6));
      fillEl.style.height = `${fillP * 100}%`;
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
    <section
      ref={heroSectionRef}
      className="hero-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "var(--ink-deep)",
      }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={HERO_VIDEO_SRC}
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translateY(17%)",
          opacity: 0,
          filter: "saturate(0.78) hue-rotate(-12deg) brightness(0.74)",
        }}
      />
      {/* Plum/aubergine wash so the video sits inside the brand palette */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 80% at 50% 30%, rgba(14,7,22,0.65) 0%, rgba(14,7,22,0.25) 40%, rgba(14,7,22,0.85) 100%), linear-gradient(180deg, rgba(42,26,61,0.35) 0%, rgba(14,7,22,0.0) 35%, rgba(14,7,22,0.55) 100%)",
        }}
      />

      {/* Foreground */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <NavBar />

        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              width: "100%",
              textAlign: "center",
              transform: "translateY(-4%)",
            }}
          >
            <div className="eyebrow reveal" style={{ marginBottom: "2.4rem" }} ref={(el) => {
              if (el && !el.dataset.in) {
                el.dataset.in = "1";
                setTimeout(() => el.classList.add("is-in"), 100);
              }
            }}>
              Est. 2011 &nbsp;·&nbsp; A Centre for English Studies &nbsp;·&nbsp; Lajpat Nagar
            </div>

            <h1
              ref={headingRef}
              className="hero-display reveal-words"
              style={{ margin: 0 }}
            >
              <span ref={wordsRef} style={{ display: "inline" }}>
                <span className="word">
                  <span className="drop-cap-wrap" aria-hidden="false">
                    L
                    <span ref={dropFillRef} className="drop-cap-fill">L</span>
                  </span>
                  anguage,
                </span>{" "}
                <span className="word">refined</span>{" "}
                <span className="word">through</span>{" "}
                <span className="word" ref={craftRef} style={{ fontStyle: "italic" }}>
                  craft.
                </span>
              </span>
            </h1>

            <p
              className="body-prose reveal"
              ref={(el) => {
                if (el && !el.dataset.in) {
                  el.dataset.in = "1";
                  setTimeout(() => el.classList.add("is-in"), 700);
                }
              }}
              style={{
                maxWidth: "44ch",
                margin: "2.6rem auto 2.6rem",
                color: "rgba(242, 235, 224, 0.78)",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 1vw + 0.6rem, 1.4rem)",
                lineHeight: 1.45,
              }}
            >
              A small studio in New Delhi teaching English literature, composition,
              and examination preparation, since 2011.
            </p>

            <div
              className="reveal"
              ref={(el) => {
                if (el && !el.dataset.in) {
                  el.dataset.in = "1";
                  setTimeout(() => el.classList.add("is-in"), 900);
                }
              }}
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href="#programmes" className="ghost-btn">
                <span>The Programmes</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href="#contact"
                className="liquid-glass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.7rem",
                  padding: "0.95rem 1.6rem",
                  borderRadius: 999,
                  fontFamily: "var(--ff-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                }}
              >
                Arrange a Consultation
              </a>
            </div>
          </div>
        </main>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "0 clamp(1.25rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3rem)",
            fontFamily: "var(--ff-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(242, 235, 224, 0.4)",
          }}
        >
          <span>№ 01 &nbsp;·&nbsp; Prelude</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            Scroll <span aria-hidden="true" style={{ fontSize: "1rem" }}>↓</span>
          </span>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
