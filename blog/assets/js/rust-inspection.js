for (const artwork of document.querySelectorAll("[data-rust-inspection]")) {
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const layers = [...artwork.querySelectorAll(".rust-inspection-layers img")];
  const hand = artwork.querySelector(".rust-inspection-hand");
  const head = artwork.querySelector(".rust-inspection-head");
  const crack = artwork.querySelector("[data-crack-path]");
  const travel = Math.min(54, crack.getTotalLength());
  const start = crack.getPointAtLength(0);
  const end = crack.getPointAtLength(travel);
  const elbow = { x: 305, y: 710 };
  const restAngle = Math.atan2(start.y - elbow.y, start.x - elbow.x);
  const restReach = Math.hypot(start.x - elbow.x, start.y - elbow.y);
  let ready = false;
  let inView = false;
  let target = 0;
  let progress = 0;
  let frame = 0;
  let previousTime = 0;
  let blurred = false;

  function enabled() {
    return ready && motion.matches && !document.hidden && !blurred && inView;
  }

  function paint() {
    const tip = crack.getPointAtLength(progress * travel);
    const angle = Math.atan2(tip.y - elbow.y, tip.x - elbow.x) - restAngle;
    const reach = Math.hypot(tip.x - elbow.x, tip.y - elbow.y) / restReach;
    // Keep the elbow under the sleeve while the entire hand and pick follow the crack.
    hand.style.transform = `rotate(${angle}rad) scale(${reach})`;
    head.style.transform = `rotate(${-progress * 1.6}deg)`;
  }

  function draw(time) {
    frame = 0;
    if (!enabled()) {
      sync();
      return;
    }
    const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
    previousTime = time;
    progress += (target - progress) * (1 - Math.exp(-elapsed / (pointer.matches ? 140 : 90)));
    const settled = Math.abs(target - progress) < 0.0005;
    if (settled) progress = target;
    paint();
    if (!settled) frame = requestAnimationFrame(draw);
    else previousTime = 0;
  }

  function animate() {
    if (!frame && enabled()) frame = requestAnimationFrame(draw);
  }

  function reset() {
    if (!pointer.matches) return;
    target = 0;
    artwork.removeAttribute("data-inspecting");
    animate();
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = previousTime = target = progress = 0;
    hand.style.removeProperty("transform");
    head.style.removeProperty("transform");
    artwork.removeAttribute("data-inspecting");
    artwork.toggleAttribute("data-layered", enabled());
    followScroll();
  }

  function follow(event) {
    if (!enabled() || !pointer.matches || event.pointerType === "touch") return;
    const bounds = artwork.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = (event.clientX - bounds.left) / bounds.width * 1536;
    const y = (event.clientY - bounds.top) / bounds.height * 1024;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    target = Math.max(0, Math.min(1, ((x - start.x) * dx + (y - start.y) * dy) / (dx * dx + dy * dy)));
    artwork.setAttribute("data-inspecting", "");
    animate();
  }

  function followScroll() {
    if (!enabled() || pointer.matches) return;
    const bounds = artwork.getBoundingClientRect();
    target = Math.max(0, Math.min(1, 1.25 - 1.5 * (bounds.top + bounds.height / 2) / window.innerHeight));
    animate();
  }

  artwork.addEventListener("pointerenter", follow);
  artwork.addEventListener("pointermove", follow);
  artwork.addEventListener("pointerleave", reset);
  artwork.addEventListener("pointercancel", reset);
  window.addEventListener("scroll", followScroll, { passive: true });
  window.addEventListener("blur", () => { blurred = true; sync(); });
  window.addEventListener("focus", () => { blurred = false; sync(); });
  window.addEventListener("resize", sync);
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
  pointer.addEventListener("change", sync);
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });
  observer.observe(artwork);

  Promise.all(layers.map((image) => image.decode()))
    .then(() => {
      ready = true;
      sync();
    })
    .catch(() => {
      // Keep the complete still image if any optional cutout fails to load.
    });
}
