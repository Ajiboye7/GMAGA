// G. Maga Import & Export — shared behaviour
const WHATSAPP_NUMBER = "2348140300645"; // 0814 030 0645 in international format

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Inventory filtering (inventory.html)
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("[data-category]");
  const emptyState = document.querySelector(".empty-state");
  function applyFilter(cat) {
    let visibleCount = 0;
    cards.forEach(card => {
      const match = cat === "all" || card.dataset.category === cat;
      card.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });
    if (emptyState) emptyState.style.display = visibleCount ? "none" : "block";
  }
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilter(btn.dataset.filter);
      });
    });
    // Deep-link support: index.html#trucks -> pre-select that category
    const hash = window.location.hash.replace("#", "");
    const target = Array.from(filterBtns).find(b => b.dataset.filter === hash);
    if (target) {
      filterBtns.forEach(b => b.classList.remove("active"));
      target.classList.add("active");
      applyFilter(hash);
    }
  }

  // Per-item WhatsApp enquiry buttons
  document.querySelectorAll("[data-wa-item]").forEach(btn => {
    const item = btn.getAttribute("data-wa-item");
    const msg = `Hello G. Maga Import & Export, I'm interested in the ${item}. Could you share more details and current pricing?`;
    btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  });

  // General "chat on WhatsApp" buttons (no specific item)
  document.querySelectorAll("[data-wa-general]").forEach(btn => {
    const msg = "Hello G. Maga Import & Export, I'd like to enquire about your vehicles, equipment and goods.";
    btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  });

  // Contact form -> builds a WhatsApp message from the fields
  const form = document.querySelector("#enquiry-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const interest = form.interest.value;
      const message = form.message.value.trim();

      if (!name || !phone || !message) {
        showFormStatus("Please fill in your name, phone number, and message.", true);
        return;
      }

      const text =
        `New enquiry from the website:\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Interested in: ${interest || "Not specified"}\n` +
        `Message: ${message}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      showFormStatus("Opening WhatsApp with your enquiry ready to send…", false);
      window.open(url, "_blank", "noopener");
      form.reset();
    });
  }

  function showFormStatus(msg, isError) {
    let status = document.querySelector("#form-status");
    if (!status) return;
    status.textContent = msg;
    status.style.color = isError ? "#B3261E" : "#1E7A46";
  }
});
