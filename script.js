(function () {
  "use strict";

  var ageModal = document.getElementById("ageModal");
  var confirmAge = document.getElementById("confirmAge");
  var leaveSite = document.getElementById("leaveSite");
  var focusableSelector = "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])";
  var previousFocus = null;

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      return false;
    }
    return true;
  }

  function openAgeModal() {
    if (!ageModal) return;
    previousFocus = document.activeElement;
    ageModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (confirmAge) confirmAge.focus();
  }

  function closeAgeModal() {
    if (!ageModal) return;
    ageModal.hidden = true;
    document.body.style.overflow = "";
    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
    updateMobileCta();
  }

  function trapModalFocus(event) {
    if (!ageModal || ageModal.hidden || event.key !== "Tab") return;
    var focusable = Array.prototype.slice.call(ageModal.querySelectorAll(focusableSelector));
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (ageModal && storageGet("vapesolo_age_confirmed") !== "true") {
    openAgeModal();
  }

  if (confirmAge) {
    confirmAge.addEventListener("click", function () {
      storageSet("vapesolo_age_confirmed", "true");
      closeAgeModal();
    });
  }

  if (leaveSite) {
    leaveSite.addEventListener("click", function () {
      window.location.href = "https://www.google.com";
    });
  }

  document.addEventListener("keydown", trapModalFocus);

  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  function closeNav() {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove("is-open");
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    navMenu.addEventListener("click", function (event) {
      if (event.target.matches("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute("data-delay");
          if (delay) entry.target.style.setProperty("--delay", delay + "ms");
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  var mobileCta = document.querySelector(".mobile-sticky-cta");

  function updateMobileCta() {
    if (!mobileCta) return;
    if (ageModal && !ageModal.hidden) {
      mobileCta.hidden = true;
      return;
    }

    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop || 0;
    var scrollHeight = Math.max(1, doc.scrollHeight - doc.clientHeight);
    mobileCta.hidden = (scrollTop / scrollHeight) < 0.4;
  }

  window.addEventListener("scroll", updateMobileCta, { passive: true });
  window.addEventListener("resize", updateMobileCta);
  updateMobileCta();
})();
