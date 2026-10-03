const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

// Theme
const themeToggle = document.querySelector("#theme-toggle");
const metaTheme = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem("lumora-theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", theme === "dark" ? "فعال‌سازی حالت روشن" : "فعال‌سازی حالت تاریک");
  metaTheme.setAttribute("content", theme === "dark" ? "#121310" : "#f7f5f1");
}

setTheme(savedTheme || (preferredDark ? "dark" : "light"));
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("lumora-theme", nextTheme);
});

// Hero slider (slides are rendered by the Django template)
(function initHeroSlider() {
  const slider = document.querySelector("#hero-slider");
  if (!slider) return;
  const slides = [...slider.querySelectorAll(".slide")];
  const dots = [...slider.querySelectorAll(".slider-dots button")];
  const slideNumber = document.querySelector("#slide-number");
  const slideTotal = document.querySelector("#slide-total");
  let currentSlide = 0;
  let sliderTimer;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
      dot.setAttribute("aria-selected", String(i === currentSlide));
    });
    if (slideNumber) slideNumber.textContent = toPersianDigits(String(currentSlide + 1).padStart(2, "0"));
  }

  if (slideTotal) slideTotal.textContent = toPersianDigits(String(slides.length).padStart(2, "0"));
  showSlide(0);
  if (slides.length < 2) return;

  function startSlider() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => showSlide(currentSlide + 1), 4800);
  }

  slider.querySelector(".next").addEventListener("click", () => { showSlide(currentSlide + 1); startSlider(); });
  slider.querySelector(".prev").addEventListener("click", () => { showSlide(currentSlide - 1); startSlider(); });
  dots.forEach((dot, index) => dot.addEventListener("click", () => { showSlide(index); startSlider(); }));
  slider.addEventListener("mouseenter", () => clearInterval(sliderTimer));
  slider.addEventListener("mouseleave", startSlider);
  slider.addEventListener("focusin", () => clearInterval(sliderTimer));
  slider.addEventListener("focusout", startSlider);
  startSlider();
})();

// Mobile navigation
const menuToggle = document.querySelector("#menu-toggle");
const mainMenu = document.querySelector("#main-menu");
function closeMenu() {
  mainMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}
menuToggle.addEventListener("click", () => {
  const opening = !mainMenu.classList.contains("open");
  mainMenu.classList.toggle("open", opening);
  document.body.classList.toggle("menu-open", opening);
  menuToggle.setAttribute("aria-expanded", String(opening));
});
mainMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

// Profile menu
const profileButton = document.querySelector("#profile-button");
const profileMenu = document.querySelector("#profile-menu");
profileButton.addEventListener("click", (event) => {
  event.stopPropagation();
  const opening = !profileMenu.classList.contains("open");
  profileMenu.classList.toggle("open", opening);
  profileButton.setAttribute("aria-expanded", String(opening));
});
document.addEventListener("click", () => {
  profileMenu.classList.remove("open");
  profileButton.setAttribute("aria-expanded", "false");
});

// Search overlay
const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#site-search");
function closeSearch() {
  searchPanel.classList.remove("open");
  searchPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("search-open");
}
document.querySelector(".search-toggle").addEventListener("click", () => {
  searchPanel.classList.add("open");
  searchPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("search-open");
  setTimeout(() => searchInput.focus(), 300);
});
document.querySelector(".search-close").addEventListener("click", closeSearch);
document.querySelector(".search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast(searchInput.value.trim() ? `جستجو برای «${searchInput.value.trim()}»` : "عبارت مورد نظر را وارد کنید");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSearch();
    closeMenu();
  }
});

// Cart, wishlist and product filters
let cartItems = 0;
const cartCount = document.querySelector("#cart-count");
const cartButton = document.querySelector(".cart-button");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelectorAll(".quick-add").forEach((button) => {
  button.addEventListener("click", () => {
    cartItems += 1;
    cartCount.textContent = toPersianDigits(cartItems);
    cartButton.setAttribute("aria-label", `سبد خرید، ${toPersianDigits(cartItems)} محصول`);
    showToast(`${button.dataset.product} به سبد خرید اضافه شد`);
  });
});

document.querySelectorAll(".wishlist").forEach((button) => {
  button.addEventListener("click", () => {
    const active = button.classList.toggle("active");
    const productName = button.dataset.name;
    button.setAttribute("aria-pressed", String(active));
    showToast(active ? `${productName} به علاقه‌مندی‌ها اضافه شد` : `${productName} از علاقه‌مندی‌ها حذف شد`);
  });
});

document.querySelectorAll(".product-tabs button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".product-tabs button").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("hidden", tab.dataset.filter !== "all" && card.dataset.gender !== tab.dataset.filter);
    });
  });
});

// Header and scroll-to-top behavior
const header = document.querySelector("#site-header");
const scrollTopButton = document.querySelector("#scroll-top");
function updateScrollUI() {
  header.classList.toggle("scrolled", window.scrollY > 20);
  scrollTopButton.classList.toggle("visible", window.scrollY > 500);
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();
scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Newsletter feedback
document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#newsletter-message").textContent = "عضویت شما با موفقیت انجام شد.";
  event.currentTarget.reset();
});
