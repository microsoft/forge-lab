const landscape = document.querySelector("[data-ink-landscape]");

if (landscape) {
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
  const sparkRoot = landscape.querySelector(".forge-burst");
  const particles = [];
  const layers = [...landscape.querySelectorAll("[data-depth]")].map((element) => ({
    element,
    depth: Number(element.dataset.depth),
    turn: Number(element.dataset.turn ?? 0),
    drift: Number(element.dataset.drift ?? 1),
    ease: Number(element.dataset.ease ?? 240),
    isHammer: element.classList.contains("forge-piece-hammer"),
    x: 0,
    y: 0,
  }));
  let ready = false;
  let targetX = 0;
  let targetY = 0;
  let targetEnergy = 0;
  let energy = 0;
  let gust = 0;
  let impulse = 0;
  let wind = 0;
  let phase = 0;
  let frame = 0;
  let previousTime = 0;
  let pointerActive = false;
  let strikeArmed = true;
  let previousHammerAngle = 0;
  let flash = 0;

  function strike(strength) {
    if (!sparkRoot) return;
    const count = Math.round(14 + strength * 20);
    const colors = ["#b65329", "#d97c30", "#f0ac51", "#c65c27"];
    for (let i = 0; i < count; i++) {
      if (particles.length >= 64) particles.shift().element.remove();
      const element = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const direction = -Math.PI * (0.1 + Math.random() * 0.8);
      const speed = (180 + Math.random() * 430) * (0.65 + strength * 0.5);
      element.setAttribute("stroke", colors[i % colors.length]);
      element.setAttribute("stroke-width", (3.5 + Math.random() * 4.5).toFixed(2));
      sparkRoot.append(element);
      particles.push({
        element,
        x: 756 + (Math.random() - 0.5) * 28,
        y: 669 + Math.random() * 4,
        vx: Math.cos(direction) * speed + gust * 90,
        vy: Math.sin(direction) * speed,
        age: 0,
        life: 0.4 + Math.random() * 0.65,
      });
    }
    flash = 1;
    impulse = Math.max(impulse, strength);
  }

  function updateSparks(seconds) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.age += seconds;
      if (particle.age >= particle.life) {
        particle.element.remove();
        particles.splice(i, 1);
        continue;
      }
      particle.vx *= Math.exp(-seconds * 1.2);
      particle.vy += 760 * seconds;
      particle.x += particle.vx * seconds;
      particle.y += particle.vy * seconds;
      particle.element.setAttribute("x1", (particle.x - particle.vx * 0.045).toFixed(2));
      particle.element.setAttribute("y1", (particle.y - particle.vy * 0.045).toFixed(2));
      particle.element.setAttribute("x2", particle.x.toFixed(2));
      particle.element.setAttribute("y2", particle.y.toFixed(2));
      particle.element.setAttribute("opacity", Math.pow(1 - particle.age / particle.life, 1.4).toFixed(3));
    }
    flash *= Math.exp(-seconds * 12);
    if (flash < 0.002) flash = 0;
    landscape.style.setProperty("--forge-strike", flash.toFixed(3));
  }

  function draw(time) {
    frame = 0;
    const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
    previousTime = time;
    phase += elapsed / 1000;
    let settled = true;
    for (const layer of layers) {
      const easing = 1 - Math.exp(-elapsed / layer.ease);
      layer.x += (targetX - layer.x) * easing;
      layer.y += (targetY - layer.y) * easing;
      if (Math.abs(targetX - layer.x) + Math.abs(targetY - layer.y) < 0.001) {
        layer.x = targetX;
        layer.y = targetY;
      } else {
        settled = false;
      }
      const angle = (layer.y + layer.x * 0.25) * layer.turn;
      if (layer.isHammer) {
        landscape.style.setProperty("--forge-lift", Math.min(1, Math.abs(angle) / 5).toFixed(3));
        // A new hit needs a lift first; hovering near contact must not retrigger.
        if (pointerActive && angle <= 0) strikeArmed = true;
        if (pointerActive && strikeArmed && previousHammerAngle < 8 && angle >= 8) {
          strike(Math.min(1, Math.max(0.3, (angle - previousHammerAngle) / elapsed * 5)));
          strikeArmed = false;
        }
        previousHammerAngle = angle;
      }
      layer.element.style.transform = `translate(${layer.x * layer.depth}px, ${layer.y * layer.depth * 0.55 * layer.drift}px) rotate(${angle}deg)`;
    }
    impulse *= Math.exp(-elapsed / 500);
    if (impulse < 0.002) impulse = 0;
    else settled = false;
    const heat = Math.min(1, targetEnergy + impulse * 0.5);
    energy += (heat - energy) * (1 - Math.exp(-elapsed / 220));
    if (Math.abs(heat - energy) < 0.001) energy = heat;
    else settled = false;
    const breeze = targetX * 0.35 + gust * impulse;
    wind += (breeze - wind) * (1 - Math.exp(-elapsed / 160));
    if (Math.abs(breeze - wind) < 0.001) wind = breeze;
    else settled = false;
    landscape.style.setProperty("--forge-energy", energy.toFixed(3));
    landscape.style.setProperty("--forge-wind", wind.toFixed(3));
    landscape.style.setProperty("--forge-flicker", (impulse * (Math.sin(phase * 17) * 0.6 + Math.sin(phase * 29) * 0.3)).toFixed(3));
    updateSparks(elapsed / 1000);
    if (particles.length || flash) settled = false;
    if (!settled) frame = requestAnimationFrame(draw);
    else previousTime = 0;
  }

  function animate() {
    if (!frame && ready && motion.matches && !document.hidden) {
      frame = requestAnimationFrame(draw);
    }
  }

  function reset() {
    pointerActive = strikeArmed = false;
    targetX = targetY = targetEnergy = gust = impulse = 0;
    animate();
  }

  function syncMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    pointerActive = strikeArmed = false;
    previousHammerAngle = flash = 0;
    for (const particle of particles) particle.element.remove();
    particles.length = 0;
    targetX = targetY = targetEnergy = energy = gust = impulse = wind = phase = 0;
    for (const layer of layers) {
      layer.x = layer.y = 0;
      layer.element.style.removeProperty("transform");
    }
    landscape.style.removeProperty("--forge-energy");
    landscape.style.removeProperty("--forge-wind");
    landscape.style.removeProperty("--forge-flicker");
    landscape.style.removeProperty("--forge-lift");
    landscape.style.removeProperty("--forge-strike");
    landscape.dataset.layered = String(ready && motion.matches && !document.hidden);
  }

  landscape.addEventListener("pointermove", (event) => {
    if (!ready || !motion.matches || event.pointerType === "touch") return;
    const bounds = landscape.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pointerActive = true;
    if (previousHammerAngle <= 0) strikeArmed = true;
    const nextX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const nextY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    impulse = Math.min(1, impulse + Math.hypot(nextX - targetX, nextY - targetY) * 2);
    gust = Math.max(-1, Math.min(1, (nextX - targetX) * 8));
    targetX = nextX;
    targetY = nextY;
    targetEnergy = Math.min(1, 0.25 + Math.hypot(targetX, targetY) * 0.65);
    animate();
  });
  landscape.addEventListener("pointerleave", reset);
  landscape.addEventListener("pointercancel", reset);
  window.addEventListener("blur", reset);
  window.addEventListener("resize", reset);
  document.addEventListener("visibilitychange", syncMotion);
  motion.addEventListener("change", syncMotion);
  syncMotion();

  // Keep the intact painting visible until every cutout can be composited.
  Promise.all([...landscape.querySelectorAll(".forge-piece")].map((image) => image.decode()))
    .then(() => {
      ready = true;
      syncMotion();
    })
    .catch(() => {
      // The original illustration remains usable if an optional layer fails.
    });
}
