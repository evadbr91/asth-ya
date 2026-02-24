// Year
document.querySelectorAll("#year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Mobile nav
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
    mobileNav.hidden = expanded;
  });
}

// Reveal on scroll
const reveals = Array.from(document.querySelectorAll(".reveal"));
if (reveals.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
}

// Contact form (mailto)
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("name")?.value || "").trim();
    const who = (document.getElementById("who")?.value || "").trim();
    const msg = (document.getElementById("msg")?.value || "").trim();

    const subject = encodeURIComponent("Demande — Thés / Infusions / Bijoux");
    const body = encodeURIComponent(
      `Bonjour Sylvie,\n\nJe m'appelle ${name}.\nContact: ${who}\n\nMessage:\n${msg}\n\nMerci !`
    );

    window.location.href = `mailto:sylvie.breu@laposte.net?subject=${subject}&body=${body}`;
  });
}

/* =========================
   Carousel (4:5 + flèches + dots)
   ========================= */
(function () {
  const carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const slides = track ? Array.from(track.querySelectorAll(".slide")) : [];
    const prev = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    const dotsWrap = carousel.parentElement.querySelector("[data-dots]");

    if (!track || slides.length === 0) return;

    const getGap = () => {
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.gap || styles.columnGap || "0");
      return Number.isFinite(gap) ? gap : 0;
    };

    const getSlideStep = () => {
      const w = slides[0].getBoundingClientRect().width;
      return w + getGap();
    };

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const getIndex = () => {
      const step = getSlideStep();
      if (!step) return 0;
      return clamp(Math.round(track.scrollLeft / step), 0, slides.length - 1);
    };

    const setActiveDot = (i) => {
      if (!dotsWrap) return;
      const dots = Array.from(dotsWrap.querySelectorAll("button"));
      dots.forEach((d, idx) => d.setAttribute("aria-current", idx === i ? "true" : "false"));
    };

    const scrollToIndex = (i) => {
      const step = getSlideStep();
      const idx = clamp(i, 0, slides.length - 1);
      track.scrollTo({ left: idx * step, behavior: "smooth" });
      setActiveDot(idx);
    };

    // Dots
    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map(
          (_, i) =>
            `<button type="button" aria-label="Aller à la slide ${i + 1}" aria-current="${i === 0 ? "true" : "false"}"></button>`
        )
        .join("");

      Array.from(dotsWrap.querySelectorAll("button")).forEach((btn, i) => {
        btn.addEventListener("click", () => scrollToIndex(i));
      });
    }

    // Buttons
    prev?.addEventListener("click", () => scrollToIndex(getIndex() - 1));
    next?.addEventListener("click", () => scrollToIndex(getIndex() + 1));

    // Sync dots on scroll
    track.addEventListener(
      "scroll",
      () => setActiveDot(getIndex()),
      { passive: true }
    );

    // Recalc on resize
    window.addEventListener("resize", () => scrollToIndex(getIndex()));

    scrollToIndex(0);
  });
})();
