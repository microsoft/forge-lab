for (const artwork of document.querySelectorAll("[data-kernel-repair]")) {
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const layers = [...artwork.querySelectorAll(".kernel-repair-layers img")];
  const hand = artwork.querySelector(".kernel-repair-hand");
  const forearm = artwork.querySelector(".kernel-repair-forearm");
  const head = artwork.querySelector(".kernel-repair-head");
  const elbow = { x: 365, y: 500 };
  const wrist = { x: 550, y: 500 };
  const contact = { x: 755, y: 607 };
  const forearmLength = Math.hypot(wrist.x - elbow.x, wrist.y - elbow.y);
  const toolLength = Math.hypot(contact.x - wrist.x, contact.y - wrist.y);
  const restForearmAngle = Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x);
  const restHandAngle = Math.atan2(contact.y - wrist.y, contact.x - wrist.x);
  let ready = false;
  let inView = false;
  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let frame = 0;
  let previousTime = 0;
  let blurred = false;

  function enabled() {
    return ready && motion.matches && !document.hidden && !blurred && inView;
  }

  function paint() {
    const tip = { x: contact.x + x * 12.5, y: contact.y - x * 4.3 + y * 0.8 };
    const dx = tip.x - elbow.x;
    const dy = tip.y - elbow.y;
    const distance = Math.hypot(dx, dy);
    const along = (forearmLength ** 2 - toolLength ** 2 + distance ** 2) / (2 * distance);
    const bend = Math.sqrt(Math.max(0, forearmLength ** 2 - along ** 2));
    // Solve the elbow/wrist linkage so the chisel rocks without stretching or losing contact.
    const nextWrist = {
      x: elbow.x + (dx * along + dy * bend) / distance,
      y: elbow.y + (dy * along - dx * bend) / distance,
    };
    const armAngle = Math.atan2(nextWrist.y - elbow.y, nextWrist.x - elbow.x) - restForearmAngle;
    const handAngle = Math.atan2(tip.y - nextWrist.y, tip.x - nextWrist.x) - restHandAngle;
    forearm.style.transform = `rotate(${armAngle}rad)`;
    hand.style.transform = `translate(${(nextWrist.x - wrist.x) / 1536 * 100}%, ${(nextWrist.y - wrist.y) / 1024 * 100}%) rotate(${handAngle}rad)`;
    head.style.transform = `rotate(${x * 2.7 + y * 1.1}deg)`;
  }

  function draw(time) {
    frame = 0;
    if (!enabled()) {
      sync();
      return;
    }
    const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
    previousTime = time;
    const easing = 1 - Math.exp(-elapsed / (pointer.matches ? 140 : 90));
    x += (targetX - x) * easing;
    y += (targetY - y) * easing;
    const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.0005;
    if (settled) {
      x = targetX;
      y = targetY;
    }
    paint();
    if (!settled) frame = requestAnimationFrame(draw);
    else previousTime = 0;
  }

  function animate() {
    if (!frame && enabled()) frame = requestAnimationFrame(draw);
  }

  function reset() {
    if (!pointer.matches) return;
    targetX = targetY = 0;
    animate();
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = previousTime = targetX = targetY = x = y = 0;
    hand.style.removeProperty("transform");
    forearm.style.removeProperty("transform");
    head.style.removeProperty("transform");
    artwork.toggleAttribute("data-layered", enabled());
    followScroll();
  }

  function follow(event) {
    if (!enabled() || !pointer.matches || event.pointerType === "touch") return;
    const bounds = artwork.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    animate();
  }

  function followScroll() {
    if (!enabled() || pointer.matches) return;
    const bounds = artwork.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, 1.5 - 3 * (bounds.top + bounds.height / 2) / window.innerHeight));
    targetY = 0;
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
      // Keep the complete painting visible when an optional layer fails to load.
    });
}
