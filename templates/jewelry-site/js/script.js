const products = [
  { name: "انگشتر طلای آریانا", category: "انگشتر زنانه", price: "۱۸,۹۸۰,۰۰۰", old: "۲۱,۵۰۰,۰۰۰", discount: "۱۲٪", gender: "women", image: "images/img-992629-700.jpg" },
  { name: "گردنبند ظریف لیانا", category: "گردنبند زنانه", price: "۱۲,۴۵۰,۰۰۰", old: "", discount: "", gender: "women", image: "images/img-685050-700.jpg" },
  { name: "دستبند طلای سلین", category: "دستبند زنانه", price: "۱۵,۷۹۰,۰۰۰", old: "۱۹,۲۰۰,۰۰۰", discount: "۱۸٪", gender: "women", image: "images/img-188729-700.jpg" },
  { name: "انگشتر مردانه آرکو", category: "انگشتر مردانه", price: "۹,۸۵۰,۰۰۰", old: "", discount: "", gender: "men", image: "images/img-890951-700.jpg" },
  { name: "ست انگشتر اِلورا", category: "ست زیورآلات", price: "۲۳,۶۰۰,۰۰۰", old: "۲۸,۹۰۰,۰۰۰", discount: "۲۰٪", gender: "women", image: "images/img-680736-700.jpg" },
  { name: "دستبند مردانه نوآر", category: "دستبند مردانه", price: "۷,۴۹۰,۰۰۰", old: "", discount: "", gender: "men", image: "images/img-673983-700.jpg" },
  { name: "حلقه کلاسیک والنتین", category: "حلقه و انگشتر", price: "۱۱,۹۰۰,۰۰۰", old: "۱۴,۰۰۰,۰۰۰", discount: "۱۵٪", gender: "women", image: "images/img-680788-700.jpg" },
  { name: "گوشواره طلای نورا", category: "گوشواره زنانه", price: "۱۳,۲۸۰,۰۰۰", old: "", discount: "", gender: "women", image: "images/img-431893-700.jpg" },
];

const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

const productGrid = document.querySelector("#product-grid");
productGrid.innerHTML = products
  .map(
    (product, index) => `
    <article class="product-card" data-gender="${product.gender}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.discount ? `<span class="discount-badge">${product.discount}-</span>` : ""}
        <button class="wishlist" type="button" data-index="${index}" aria-label="افزودن ${product.name} به علاقه‌مندی‌ها" aria-pressed="false">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
        </button>
        <button class="quick-add" type="button" data-product="${product.name}">افزودن به سبد خرید</button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-prices">
          <span>${product.price} تومان</span>
          ${product.old ? `<span class="old-price">${product.old} تومان</span>` : ""}
        </div>
      </div>
    </article>`,
  )
  .join("");

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

// Hero slider
const slider = document.querySelector("#hero-slider");
const slides = [...slider.querySelectorAll(".slide")];
const dots = [...slider.querySelectorAll(".slider-dots button")];
const slideNumber = document.querySelector("#slide-number");
let currentSlide = 0;
let sliderTimer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === currentSlide));
  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === currentSlide;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-selected", String(active));
  });
  slideNumber.textContent = toPersianDigits(String(currentSlide + 1).padStart(2, "0"));
}

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
    const productName = products[Number(button.dataset.index)].name;
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
