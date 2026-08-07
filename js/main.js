(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const admissionForm = document.getElementById("admission-form");
  const successModal = document.getElementById("success-modal");
  const modalClose = document.getElementById("modal-close");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const galleryItems = document.querySelectorAll(".gallery__item");
  const logo3d = document.getElementById("logo-3d");
  const hero3d = document.getElementById("hero-3d");
  const tiltCards = document.querySelectorAll("[data-tilt]");

  // Sticky header shadow
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });

  // Mobile navigation
  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("open");
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("open");
      navLinks.forEach(function (l) { l.classList.remove("active"); });
      link.classList.add("active");
    });
  });

  // Highlight active nav on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", function () {
    const scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  });

  // 3D logo mouse parallax
  if (logo3d) {
    const logoInner = logo3d.querySelector(".logo-3d__inner");

    logo3d.addEventListener("mousemove", function (e) {
      const rect = logo3d.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      logoInner.style.animationPlayState = "paused";
      logoInner.style.transform =
        "rotateY(" + (x * 30) + "deg) rotateX(" + (-y * 20) + "deg) translateZ(20px)";
    });

    logo3d.addEventListener("mouseleave", function () {
      logoInner.style.animationPlayState = "running";
      logoInner.style.transform = "";
    });
  }

  // Hero 3D stage — subtle mouse parallax
  if (hero3d) {
    document.addEventListener("mousemove", function (e) {
      if (window.scrollY > window.innerHeight) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      hero3d.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    });
  }

  // 3D tilt on course cards
  tiltCards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        "perspective(800px) rotateY(" + (x * 12) + "deg) rotateX(" + (-y * 12) + "deg) translateY(-6px)";
      card.style.boxShadow =
        "0 20px 40px rgba(0,0,0," + (0.12 + Math.abs(x) * 0.08) + ")";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });

  // Scroll reveal for 3D cards
  const revealCards = document.querySelectorAll(".card-3d:not([data-tilt])");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) rotateX(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealCards.forEach(function (el, i) {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px) rotateX(5deg)";
      el.style.transitionDelay = (i % 4) * 0.08 + "s";
      observer.observe(el);
    });
  }

  // Admission form sends the inquiry directly to WhatsApp
  admissionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const studentName = document.getElementById("student-name").value.trim();
    const age = document.getElementById("age").value.trim();
    const courseSelect = document.getElementById("course");
    const course = courseSelect.options[courseSelect.selectedIndex]?.text || "";
    const parentName = document.getElementById("parent-name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const whatsappMessage = [
      "Enrollment Inquiry",
      "",
      "Student Name: " + (studentName || "Not provided"),
      "Age: " + (age || "Not provided"),
      "Preferred Course: " + (course || "Not provided"),
      "Parent / Guardian Name: " + (parentName || "Not provided"),
      "Phone: " + (phone || "Not provided"),
      "Email: " + (email || "Not provided"),
      "Message: " + (message || "No additional message")
    ].join("\n");

    const whatsappLink = "https://wa.me/919884448277?text=" + encodeURIComponent(whatsappMessage);
    window.open(whatsappLink, "_blank", "noopener,noreferrer");

    successModal.hidden = false;
    admissionForm.reset();
  });

  modalClose.addEventListener("click", function () {
    successModal.hidden = true;
  });

  successModal.addEventListener("click", function (e) {
    if (e.target === successModal) {
      successModal.hidden = true;
    }
  });

  // Gallery lightbox
  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const imgEl = item.querySelector("img");
      if (imgEl && imgEl.src) {
        lightboxImg.src = imgEl.src;
        lightboxCaption.textContent = item.getAttribute("data-caption") || imgEl.alt || "";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        return;
      }

      const bgEl = item.querySelector(".gallery__img");
      if (!bgEl) return;
      const styles = window.getComputedStyle(bgEl);
      const bg = styles.backgroundImage;
      const urlMatch = bg.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch) {
        lightboxImg.src = urlMatch[1];
        lightboxCaption.textContent = item.getAttribute("data-caption") || "";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
      successModal.hidden = true;
    }
  });
})();
