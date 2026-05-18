/* eslint-disable */
// Fountain pen cursor.
// - Default: small vellum dot.
// - Over interactive elements: dot fades, nib SVG appears, rotated toward last motion.
// - Trail: faint plum ink stroked into a canvas, decays over ~300ms.
// - Hidden on touch / coarse-pointer devices.

function Cursor() {
  const dotRef = React.useRef(null);
  const nibRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const stateRef = React.useRef({
    x: -100, y: -100,
    lastX: -100, lastY: -100,
    angle: 0,
    points: [], // {x, y, age}
    overInteractive: false,
    rafId: 0,
  });

  React.useEffect(() => {
    const coarse =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const isInteractive = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "A" || tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "LABEL")
        return true;
      if (el.closest && el.closest("a, button, input, textarea, select, label, [data-cursor='nib']"))
        return true;
      return false;
    };

    const onMove = (e) => {
      const s = stateRef.current;
      s.lastX = s.x;
      s.lastY = s.y;
      s.x = e.clientX;
      s.y = e.clientY;
      const dx = s.x - s.lastX;
      const dy = s.y - s.lastY;
      if (dx * dx + dy * dy > 1) {
        s.angle = Math.atan2(dy, dx);
      }
      const over = isInteractive(e.target);
      if (over !== s.overInteractive) {
        s.overInteractive = over;
        if (wrapRef.current) {
          wrapRef.current.classList.toggle("cursor-active", over);
        }
      }
      // emit a trail point
      s.points.push({ x: s.x, y: s.y, age: 0 });
      if (s.points.length > 60) s.points.shift();
    };

    const onLeave = () => {
      const s = stateRef.current;
      s.x = -100;
      s.y = -100;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      const s = stateRef.current;

      // Position dot & nib
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;
      }
      if (nibRef.current) {
        const deg = (s.angle * 180) / Math.PI + 135; // nib tip points along motion
        nibRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) rotate(${deg}deg)`;
      }

      // Update + draw trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = s.points;
      // age all points
      for (let i = 0; i < pts.length; i++) pts[i].age += dt;
      // drop expired
      while (pts.length && pts[0].age > 320) pts.shift();

      if (pts.length > 1) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1];
          const b = pts[i];
          const life = 1 - b.age / 320;
          if (life <= 0) continue;
          const alpha = Math.max(0, Math.min(1, life)) * (s.overInteractive ? 0.55 : 0.28);
          ctx.strokeStyle = `rgba(169, 138, 201, ${alpha})`;
          ctx.lineWidth = 1.1 + life * 1.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      s.rafId = requestAnimationFrame(tick);
    };
    stateRef.current.rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(stateRef.current.rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={wrapRef}>
      <canvas ref={canvasRef} className="cursor-trail-canvas" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <svg
        ref={nibRef}
        className="cursor-nib"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
      >
        {/* Nib: an elongated diamond with a centred slit */}
        <path
          d="M11 1 L17 11 L11 21 L5 11 Z"
          fill="var(--vellum)"
          stroke="rgba(14,7,22,0.4)"
          strokeWidth="0.5"
        />
        <path d="M11 5 L11 17" stroke="rgba(14,7,22,0.55)" strokeWidth="0.8" />
        <circle cx="11" cy="11" r="1.1" fill="var(--plum)" />
      </svg>
    </div>
  );
}

window.Cursor = Cursor;
