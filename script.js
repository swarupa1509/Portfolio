const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll(".nav-links a");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("is-open", !isOpen);
});

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-30% 0px -60% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

const skillObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.style.setProperty("--level", `${entry.target.dataset.level}%`);
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.35 });

document.querySelectorAll(".skill").forEach((skill) => skillObserver.observe(skill));

const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function showFieldError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

form.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => showFieldError(field, ""));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.name;
  const email = form.elements.email;
  const message = form.elements.message;
  const trimmedEmail = email.value.trim();

  showFieldError(name, name.value.trim() ? "" : "Please enter your name.");
  showFieldError(email, emailPattern.test(trimmedEmail) ? "" : "Please enter a valid email address.");
  showFieldError(message, message.value.trim() ? "" : "Please add a short note about your project.");

  const invalidField = form.querySelector('[aria-invalid="true"]');
  if (invalidField) {
    formStatus.textContent = "Please check the highlighted fields and try again.";
    invalidField.focus();
    return;
  }

  const subject = encodeURIComponent(`Portfolio enquiry from ${name.value.trim()}`);
  const body = encodeURIComponent(`${message.value.trim()}\n\nFrom: ${name.value.trim()}\nEmail: ${trimmedEmail}`);
  formStatus.textContent = "Your email app will open with your message ready to send.";
  window.location.href = `mailto:hello@alexmorgan.dev?subject=${subject}&body=${body}`;
});

document.querySelector("#year").textContent = new Date().getFullYear();
