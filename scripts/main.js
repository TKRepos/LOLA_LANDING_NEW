// main.js

const DEFAULT_LANG = "ru";

const CONTACT_LINK = "tel:+998903481730";

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setActiveLangButtons(lang) {
  document.querySelectorAll(".header__lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
}

function applyTexts(lang) {
  const dict = window.TEXTS?.[lang] || window.TEXTS?.[DEFAULT_LANG];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = getNested(dict, key);
    if (typeof value === "string") el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-list]").forEach((el) => {
    const key = el.dataset.i18nList;
    const items = getNested(dict, key);
    if (Array.isArray(items)) {
      el.innerHTML = items.map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    }
  });

  // Telegram links
  const book1 = document.getElementById("bookBtn");
  const book2 = document.getElementById("bookBtn2");
  const tgFooter = document.getElementById("telegramLinkFooter");
  [book1, book2, tgFooter].forEach((a) => {
    if (a) a.href = CONTACT_LINK;
  });

  setActiveLangButtons(lang);
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
}

function initLanguage() {
  const saved = localStorage.getItem("lang");
  const lang = saved && window.TEXTS?.[saved] ? saved : DEFAULT_LANG;

  applyTexts(lang);

  document.querySelectorAll(".header__lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyTexts(btn.dataset.lang));
  });
}

function closeMobileMenu() {
  const panel = document.querySelector(".header__menu-mobile");
  const burger = document.querySelector(".header__menu-burger");
  if (!panel || !burger) return;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
}

function toggleMobileMenu() {
  const panel = document.querySelector(".header__menu-mobile");
  const burger = document.querySelector(".header__menu-burger");
  if (!panel || !burger) return;

  const isOpen = panel.classList.toggle("is-open");
  panel.setAttribute("aria-hidden", String(!isOpen));
  burger.classList.toggle("is-open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
}

function initMobileMenu() {
  const burger = document.querySelector(".header__menu-burger");
  if (!burger) return;

  burger.addEventListener("click", toggleMobileMenu);

  // Close on outside click
  document.addEventListener("click", (e) => {
    const panel = document.querySelector(".header__menu-mobile");
    if (!panel?.classList.contains("is-open")) return;
    const inside = e.target.closest(".header__menu-mobile") || e.target.closest(".header__menu-burger");
    if (!inside) closeMobileMenu();
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });
}

function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");

    // Игнорируем пустые якоря
    if (!href || href === "#" || href === "#!") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMobileMenu();
  });
}


function initFooterYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initMobileMenu();
  initSmoothScroll();
  initFooterYear();
  initReveal();
});
