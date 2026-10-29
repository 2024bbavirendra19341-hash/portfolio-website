const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const progressBar = document.getElementById("scrollProgress");

// Theme toggle (preference is kept for this browser session).
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) root.dataset.theme = savedTheme;
themeToggle.textContent = root.dataset.theme === "dark" ? "☀" : "☾";
themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  themeToggle.textContent = nextTheme === "dark" ? "☀" : "☾";
});

// Mobile navigation.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Scroll progress.
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${percent}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Count-up stats when visible.
const countObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    observer.unobserve(element);
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach(el => countObserver.observe(el));

// Project filters.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !visible);
    });
  });
});

// Demo contact form: prepare a message in the visitor's email app.
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const service = formData.get("service");
  const message = formData.get("message").trim();
  const subject = encodeURIComponent(`Portfolio enquiry: ${service}`);
  const body = encodeURIComponent(`Hi Virendra,\n\n${message}\n\nName: ${name}\nEmail: ${email}\nService: ${service}`);
  // Update this address to your real email before publishing.
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
  formNote.textContent = "Your email app should open with a drafted message. Replace hello@example.com with your real email before publishing.";
});

document.getElementById("year").textContent = new Date().getFullYear();
