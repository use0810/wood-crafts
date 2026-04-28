(function () {
  "use strict";

  const bgLayer = document.querySelector(".bg-layer");
  var parallaxFactorDesktop = 0.42;
  var parallaxFactorMobile = 0.2;

  function parallaxFactor() {
    return window.innerWidth <= 768 ? parallaxFactorMobile : parallaxFactorDesktop;
  }

  function updateBackgroundParallax() {
    if (!bgLayer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bgLayer.style.removeProperty("--bg-parallax-pos");
      return;
    }
    var y = window.scrollY || window.pageYOffset;
    bgLayer.style.setProperty(
      "--bg-parallax-pos",
      "center calc(50% - " + y * parallaxFactor() + "px)"
    );
  }

  updateBackgroundParallax();

  var parallaxTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!parallaxTicking) {
        window.requestAnimationFrame(function () {
          updateBackgroundParallax();
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    updateBackgroundParallax();
  });

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector("#site-nav");
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");

  /* モバイルナビ */
  function setNavOpen(open) {
    if (!header || !navToggle) return;
    header.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!header.classList.contains("is-open"));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          setNavOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        setNavOpen(false);
      }
    });
  }

  /* スムーズスクロール（hash リンク） */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* Intersection Observer: セクションのフェードイン */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* お問い合わせフォーム（デモ用） */
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (form && statusEl) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.textContent = "";
      statusEl.classList.remove("is-success", "is-error");

      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const message = form.querySelector('[name="message"]');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        statusEl.textContent = "必須項目を入力してください。";
        statusEl.classList.add("is-error");
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!emailOk) {
        statusEl.textContent = "メールアドレスの形式をご確認ください。";
        statusEl.classList.add("is-error");
        return;
      }

      statusEl.textContent =
        "ありがとうございます。これはデモサイトのため送信は行われていませんが、入力内容は問題ありませんでした。";
      statusEl.classList.add("is-success");
      form.reset();
    });
  }
})();
