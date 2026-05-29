const modalData = {
  fase1: {
    eyebrow: "Fase 01",
    title: "Identificacion",
    description: "Encontrar el objeto-simbolo que condensa la historia y abre una entrada narrativa clara.",
    blocks: [["Acciones", ["Observacion de campo", "Registro visual", "Seleccion del objeto", "Pregunta editorial"]]]
  },
  fase2: {
    eyebrow: "Fase 02",
    title: "Contexto",
    description: "Documentar donde vive ese objeto, que tensiones lo rodean y por que importa.",
    blocks: [["Acciones", ["Mapa de actores", "Conversaciones breves", "Archivo de imagenes", "Lectura territorial"]]]
  },
  fase3: {
    eyebrow: "Fase 03",
    title: "Relato",
    description: "Convertir la observacion en una pieza editorial con ritmo, tono y punto de vista.",
    blocks: [["Acciones", ["Estructura narrativa", "Edicion textual", "Jerarquia visual", "Cierre editorial"]]]
  },
  fase4: {
    eyebrow: "Fase 04",
    title: "Circulacion",
    description: "Diseñar formatos para que la historia llegue a lectores, aliados e instituciones.",
    blocks: [["Acciones", ["Publicacion", "Activacion cultural", "Redes", "Material pedagogico"]]]
  },
  fase5: {
    eyebrow: "Fase 05",
    title: "Sostenibilidad",
    description: "Transformar el metodo en servicios y productos que cuidan el oficio editorial.",
    blocks: [["Acciones", ["Portafolio", "Paquetes comerciales", "Costeo", "Seguimiento de impacto"]]]
  },
  estudio: {
    eyebrow: "Servicio",
    title: "Estudio UC",
    description: "Periodismo narrativo por encargo con la firma editorial de Universo Centro.",
    price: "USD $2,000 - $8,750",
    blocks: [["Incluye", ["Ediciones especiales", "Cronicas largas", "Ensayos fotograficos", "Curaduria de archivos"]]]
  },
  academia: {
    eyebrow: "Servicio",
    title: "Academia UC",
    description: "Talleres y modulos de formacion construidos desde diecisiete años de oficio editorial.",
    price: "USD $75 - $2,500",
    blocks: [["Incluye", ["Taller Metodo UC", "Cronica urbana", "Fotografia narrativa", "Modulos universitarios"]]]
  },
  archivo: {
    eyebrow: "Servicio",
    title: "Archivo UC",
    description: "Las ediciones historicas convertidas en exposiciones, instalaciones y programacion publica.",
    price: "USD $1,250 - $10,000",
    blocks: [["Incluye", ["Exposiciones itinerantes", "Asesoria curatorial", "Programacion publica", "Catalogos impresos"]]]
  },
  editorial: {
    eyebrow: "Servicio",
    title: "Editorial UC",
    description: "Libros y objetos editoriales que extienden la memoria impresa del proyecto.",
    price: "USD $10 - $20 por ejemplar",
    blocks: [["Incluye", ["Libros tematicos", "Cronicas ilustradas", "Objetos coleccionables", "Ediciones especiales"]]]
  }
};

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const header = qs(".site-header");
const menuToggle = qs(".menu-toggle");
const navLinks = qs(".nav-links");
const modalOverlay = qs("#modalOverlay");
const modalBody = qs("#modalBody");
const modalClose = qs("#modalClose");

function organizePageFlow() {
  const main = qs("main");
  const servicios = qs("#servicios");
  const proyecto = qs("#proyecto");
  const plan = qs("#plan");

  if (main && servicios && proyecto && plan && servicios.nextElementSibling !== proyecto) {
    main.insertBefore(proyecto, plan);
  }

  qsa("main > .content-section").forEach((section, index) => {
    const label = qs(".section-label", section);
    if (label) label.textContent = String(index + 1).padStart(2, "0");
  });
}

function setHeaderHeight() {
  if (!header) return;
  document.documentElement.style.setProperty("--header-height", `${Math.ceil(header.offsetHeight)}px`);
}

function toggleMenu(force) {
  if (!menuToggle || !navLinks) return;
  const isOpen = typeof force === "boolean" ? force : !navLinks.classList.contains("active");
  navLinks.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function blockMarkup([heading, content]) {
  const body = Array.isArray(content)
    ? `<ul>${content.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : `<p>${content}</p>`;

  return `<div class="modal-block"><h3>${heading}</h3>${body}</div>`;
}

function openModal(key) {
  const data = modalData[key];
  if (!data || !modalOverlay || !modalBody) return;

  modalBody.innerHTML = `
    <p class="modal-eyebrow">${data.eyebrow}</p>
    <h2>${data.title}</h2>
    <p class="modal-description">${data.description}</p>
    ${data.blocks.map(blockMarkup).join("")}
    ${data.price ? `<div class="modal-price-box"><p class="modal-eyebrow">Rango de inversion</p><p><strong>${data.price}</strong></p></div>` : ""}
  `;

  modalOverlay.classList.add("active");
  document.body.classList.add("modal-open");
  modalClose?.focus();
}

function closeModal() {
  modalOverlay?.classList.remove("active");
  document.body.classList.remove("modal-open");
}

function initInteractions() {
  menuToggle?.setAttribute("aria-label", "Abrir menu");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.addEventListener("click", () => toggleMenu());

  qsa(".nav-links a, .top-nav a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  qsa("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.modal));
  });

  modalClose?.addEventListener("click", closeModal);
  modalOverlay?.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      toggleMenu(false);
    }
  });

  window.addEventListener("resize", setHeaderHeight);
  window.addEventListener("scroll", () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  }, { passive: true });
}

function initActiveNav() {
  const sections = qsa("section[id], footer[id]");
  const links = qsa(".nav-links a, .top-nav a");
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    links.forEach((link) => {
      link.classList.toggle("active-link", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: [0.05, 0.2, 0.45] });

  sections.forEach((section) => observer.observe(section));
}

function initRevealAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const revealItems = qsa(".service-card, .process-card, .phase-card, .object-item, .tools-box, .site-footer");
  revealItems.forEach((item, index) => {
    item.classList.add("hidden");
    item.style.transitionDelay = `${Math.min(index % 5, 4) * 45}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  organizePageFlow();
  setHeaderHeight();
  initInteractions();
  initActiveNav();
  initRevealAnimations();
});
