/* =========================================================
   Avik Saha Roy — Portfolio scripts (no jQuery needed)
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    var raf = function (time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: -80 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  // In-page links
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = $(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (id === "#home" && lenis) {
        lenis.scrollTo(0);
      } else {
        scrollToTarget(target);
      }
      history.replaceState(null, "", id);
    });
  });

  /* ---------- Mobile menu ---------- */
  var burger = $("#burger");
  var menu = $("#mobileMenu");

  function openMenu() {
    document.body.classList.add("menu-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    menu.setAttribute("aria-hidden", "false");
    if (lenis) lenis.stop();
  }

  function closeMenu() {
    if (!document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    menu.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
  }

  burger.addEventListener("click", function () {
    document.body.classList.contains("menu-open") ? closeMenu() : openMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Nav: background, hide on scroll down, progress ---------- */
  var nav = $("#nav");
  var progress = $(".scroll-progress");
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);

    nav.classList.toggle("nav--scrolled", y > 30);
    if (y > 400 && y > lastY + 4 && !document.body.classList.contains("menu-open")) {
      nav.classList.add("nav--hidden");
    } else if (y < lastY - 4 || y < 400) {
      nav.classList.remove("nav--hidden");
    }
    lastY = y;

    stackCards();
    scrollFx();
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- Active nav link ---------- */
  var navLinks = $$("#navLinks a");
  var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);

  if ("IntersectionObserver" in window) {
    var activeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { activeObs.observe(s); });
  }

  /* ---------- Split headings into words ---------- */
  $$("[data-split]").forEach(function (el) {
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
            } else {
              var w = document.createElement("span");
              w.className = "w";
              var inner = document.createElement("span");
              inner.style.setProperty("--wi", i++);
              inner.textContent = part;
              w.appendChild(inner);
              frag.appendChild(w);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    }
    walk(el);
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$("[data-reveal], [data-split]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add("in");
          revealObs.unobserve(el);
          var d = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
          setTimeout(function () { el.classList.add("done"); }, 1100 + d * 1000);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- Typing roles ---------- */
  var typedEl = $("#typed");
  var roles = ["Full Stack Developer", "React & Next.js Developer", "React Native Developer"];
  if (typedEl && !reduceMotion) {
    var r = 0, c = roles[0].length, deleting = true;
    var tick = function () {
      var word = roles[r];
      typedEl.textContent = word.slice(0, c);
      var delay = deleting ? 40 : 85;
      if (deleting) {
        c--;
        if (c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; delay = 300; }
      } else {
        c++;
        if (c > roles[r].length) { deleting = true; c = roles[r].length; delay = 2000; }
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- Count up numbers ---------- */
  var counters = $$("[data-count]");
  function runCount(el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    if (reduceMotion) { el.textContent = end; return; }
    var start = null, dur = 1600;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  setTimeout(function () { counters.forEach(runCount); }, 1000);

  /* ---------- Marquee: duplicate list for seamless loop ---------- */
  var track = $(".marquee__track");
  if (track) {
    var list = $(".marquee__list", track);
    var copy = list.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  }

  /* ---------- Stacked project cards ---------- */
  var features = $$(".feature");
  features.forEach(function (f, i) { f.style.setProperty("--k", i); });

  function stackCards() {
    if (reduceMotion || window.innerWidth <= 860 || window.innerHeight <= 760) return;
    features.forEach(function (card, i) {
      var next = features[i + 1];
      if (!next) { card.style.setProperty("--s", 1); return; }
      var cardTop = card.getBoundingClientRect().top;
      var nextTop = next.getBoundingClientRect().top;
      var dist = nextTop - cardTop;
      var h = card.offsetHeight;
      var p = Math.min(Math.max(1 - dist / h, 0), 1);
      card.style.setProperty("--s", (1 - p * 0.06).toFixed(4));
    });
  }

  /* ---------- Custom cursor (mouse devices only) ---------- */
  if (finePointer) {
    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    dot.innerHTML = "<span></span>";
    ring.innerHTML = "<span></span>";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add("has-cursor");

    var mx = -100, my = -100, rx = -100, ry = -100;
    var ease = reduceMotion ? 1 : 0.42;
    var hoverSel = "a, button, .chips li, .skill-list li, .socials a, .facts li, label, [role='button'], [role='option'], .nav__cmd";

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      // Dot follows the mouse instantly (no lag)
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      document.documentElement.classList.add("cursor-visible");
      var t = e.target.closest ? e.target.closest(hoverSel) : null;
      document.documentElement.classList.toggle("cursor-hover", !!t);
    }, { passive: true });

    document.addEventListener("mouseleave", function () {
      document.documentElement.classList.remove("cursor-visible");
    });
    window.addEventListener("pointerdown", function () {
      document.documentElement.classList.add("cursor-down");
    });
    window.addEventListener("pointerup", function () {
      document.documentElement.classList.remove("cursor-down");
    });

    var moveCursor = function () {
      var dx = mx - rx, dy = my - ry;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        rx += dx * ease;
        ry += dy * ease;
        ring.style.transform = "translate3d(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px,0)";
      }
      requestAnimationFrame(moveCursor);
    };
    requestAnimationFrame(moveCursor);
  }

  /* ---------- Pointer effects (desktop only) ---------- */
  if (finePointer && !reduceMotion) {
    var glow = $(".cursor-glow");
    var gx = 0, gy = 0, tx = 0, ty = 0;
    document.body.classList.add("has-pointer");

    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    var follow = function () {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);

    // Spotlight cards
    $$(".spotlight").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });

    // Magnetic buttons
    $$(".magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.setProperty("--tx", x.toFixed(1) + "px");
        btn.style.setProperty("--ty", y.toFixed(1) + "px");
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.setProperty("--tx", "0px");
        btn.style.setProperty("--ty", "0px");
      });
    });

    // Portrait tilt
    var tilt = $(".tilt");
    if (tilt) {
      tilt.addEventListener("pointermove", function (e) {
        var r = tilt.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = "perspective(900px) rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 10).toFixed(2) + "deg)";
      });
      tilt.addEventListener("pointerleave", function () {
        tilt.style.transform = "";
      });
    }
  }


  /* =========================================================
     EXTRA MOTION
     ========================================================= */

  /* ---------- Hero: split name into letters ---------- */
  function splitChars(root, baseDelay) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          Array.prototype.forEach.call(child.textContent, function (ch) {
            if (ch === " ") { frag.appendChild(document.createTextNode(" ")); return; }
            var outer = document.createElement("span");
            outer.className = "ch";
            var inner = document.createElement("span");
            inner.textContent = ch;
            inner.style.animationDelay = (baseDelay + n * 0.035).toFixed(3) + "s";
            n++;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(root);
  }

  if (!reduceMotion) {
    var heroLines = $$(".hero__title .load-up");
    var lineDelay = 0.2;
    heroLines.forEach(function (line) {
      line.classList.add("chars");
      splitChars(line, lineDelay);
      lineDelay += 0.25;
    });
  }

  /* ---------- Section numbers: text scramble ---------- */
  var glyphs = "!<>-_/[]{}=+*^?#01";
  function scramble(el) {
    var final = el.textContent;
    var frame = 0, total = 22;
    var run = function () {
      var out = "";
      for (var i = 0; i < final.length; i++) {
        var at = (i / final.length) * total;
        if (frame >= at + 6 || final[i] === " ") out += final[i];
        else out += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      el.textContent = out;
      frame++;
      if (frame <= total + 6) requestAnimationFrame(run);
      else el.textContent = final;
    };
    run();
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    var numObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          setTimeout(function () { scramble(target); }, 150);
          numObs.unobserve(target);
        }
      });
    }, { threshold: 0.6 });
    $$(".section__num").forEach(function (el) { numObs.observe(el); });
  }

  /* ---------- Chips + timeline: index for stagger ---------- */
  $$(".skill-list, .chips, .edu__list").forEach(function (list) {
    $$("li", list).forEach(function (li, i) { li.style.setProperty("--ci", i); });
  });

  /* ---------- Nav links: rolling text ---------- */
  $$("#navLinks a").forEach(function (a) {
    var t = a.textContent.trim();
    a.innerHTML = '<span class="roll"><span class="roll__in" data-text="' + t + '">' + t + "</span></span>";
  });

  /* ---------- Scroll-linked effects ---------- */
  var heroText = $(".hero__text");
  var heroVisual = $(".hero__visual");
  var jobMain = $(".job__main");
  var arts = $$(".feature__art svg");
  var bgWords = $$(".bg-word");

  function scrollFx() {
    if (reduceMotion) return;
    var y = window.scrollY;
    var vh = window.innerHeight;

    // Hero parallax + fade
    if (y < vh * 1.3) {
      // Stay fully visible for the first half of the hero, then fade slowly
      var fadeStart = vh * 0.5;
      var fade = y > fadeStart ? 1 - (y - fadeStart) / (vh * 0.6) : 1;
      heroText.style.translate = "0 " + (y * 0.1).toFixed(1) + "px";
      heroText.style.opacity = Math.max(fade, 0).toFixed(3);
      heroVisual.style.translate = "0 " + (y * 0.05).toFixed(1) + "px";
      document.body.classList.toggle("scrolled-a-bit", y > 40);
    }

    // Experience progress rail
    if (jobMain) {
      var r = jobMain.getBoundingClientRect();
      var jp = Math.min(Math.max((vh * 0.65 - r.top) / r.height, 0), 1);
      jobMain.style.setProperty("--jp", jp.toFixed(4));
    }

    // Project art parallax
    arts.forEach(function (svg) {
      var ar = svg.parentNode.getBoundingClientRect();
      if (ar.bottom < 0 || ar.top > vh) return;
      var off = ar.top + ar.height / 2 - vh / 2;
      svg.style.translate = "0 " + (off * -0.06).toFixed(1) + "px";
    });

    // Giant background words slide sideways
    bgWords.forEach(function (w) {
      var sr = w.parentNode.getBoundingClientRect();
      if (sr.bottom < 0 || sr.top > vh) return;
      var p = (vh - sr.top) / (vh + sr.height);
      var dir = w.getAttribute("data-dir") === "left" ? -1 : 1;
      w.style.translate = ((p - 0.5) * 30 * dir).toFixed(2) + "vw 0";
    });
  }

  /* ---------- Marquee: speed reacts to scroll ---------- */
  var mTrack = $(".marquee__track");
  if (mTrack && !reduceMotion) {
    mTrack.classList.add("js-marquee");
    var mPos = 0, lastScroll = window.scrollY, vel = 0, mHover = false;
    var marqueeEl = $(".marquee");
    marqueeEl.addEventListener("mouseenter", function () { mHover = true; });
    marqueeEl.addEventListener("mouseleave", function () { mHover = false; });
    var loopM = function () {
      var sy = window.scrollY;
      var d = sy - lastScroll;
      lastScroll = sy;
      vel += (d - vel) * 0.1;
      var speed = (mHover ? 0.25 : 0.9) + Math.min(Math.abs(vel) * 0.35, 14);
      var dir = vel < -0.5 ? -1 : 1;
      mPos -= speed * dir;
      var half = mTrack.scrollWidth / 2;
      if (mPos <= -half) mPos += half;
      if (mPos > 0) mPos -= half;
      var skew = Math.max(Math.min(vel * -0.25, 8), -8);
      mTrack.style.transform = "translate3d(" + mPos.toFixed(2) + "px,0,0) skewX(" + skew.toFixed(2) + "deg)";
      requestAnimationFrame(loopM);
    };
    requestAnimationFrame(loopM);
  }

  /* ---------- 3D tilt on cards (mouse only) ---------- */
  if (finePointer && !reduceMotion) {
    $$(".service, .cert, .mini, .bento__card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        if (!card.classList.contains("in")) return;
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add("is-tilting");
        card.style.transform = "perspective(900px) rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }

  window.addEventListener("resize", scrollFx);

  /* ---------- Copy email ---------- */
  var toast = $("#toast");
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  var copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var label = $("span", copyBtn);
      var done = function () {
        label.textContent = "Copied!";
        showToast("Email copied to clipboard");
        setTimeout(function () { label.textContent = "Copy email"; }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done, function () { showToast(email); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (err) { showToast(email); }
        document.body.removeChild(ta);
      }
    });
  }

  /* =========================================================
     COMMAND MENU (Ctrl + K / ⌘ K)
     ========================================================= */
  (function () {
    var root = $("#cmdk");
    var input = $("#cmdkInput");
    var listEl = $("#cmdkList");
    var openBtn = $("#cmdOpen");
    if (!root || !input || !listEl) return;

    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    var keyLabel = $("#cmdKey");
    if (keyLabel && isMac) keyLabel.textContent = "⌘ K";

    function go(id) {
      return function () {
        var t = $(id);
        if (!t) return;
        if (id === "#home" && lenis) lenis.scrollTo(0);
        else scrollToTarget(t);
        history.replaceState(null, "", id);
      };
    }
    function open(url) {
      return function () { window.open(url, "_blank", "noopener"); };
    }
    function copyEmail() {
      var email = "royavik63@gmail.com";
      var ok = function () { showToast("Email copied to clipboard"); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(ok, function () { showToast(email); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); ok(); } catch (err) { showToast(email); }
        document.body.removeChild(ta);
      }
    }

    var commands = [
      { g: "Navigate", icon: "fa-solid fa-house", label: "Home", kw: "top start hero", run: go("#home") },
      { g: "Navigate", icon: "fa-solid fa-user", label: "About", kw: "bio education me", run: go("#about") },
      { g: "Navigate", icon: "fa-solid fa-briefcase", label: "Experience", kw: "job work algoritmo career", run: go("#experience") },
      { g: "Navigate", icon: "fa-solid fa-wand-magic-sparkles", label: "Services", kw: "hire web mobile apps", run: go("#services") },
      { g: "Navigate", icon: "fa-solid fa-layer-group", label: "Skills", kw: "stack tools tech react next nest", run: go("#skills") },
      { g: "Navigate", icon: "fa-solid fa-folder-open", label: "Projects", kw: "work portfolio curiobite swisspuja storyverse", run: go("#projects") },
      { g: "Navigate", icon: "fa-solid fa-graduation-cap", label: "Learning", kw: "certifications certificates courses oracle anthropic award", run: go("#certifications") },
      { g: "Navigate", icon: "fa-solid fa-paper-plane", label: "Contact", kw: "hire talk email message", run: go("#contact") },
      { g: "Actions", icon: "fa-regular fa-copy", label: "Copy email address", kw: "mail clipboard", run: copyEmail },
      { g: "Actions", icon: "fa-solid fa-envelope", label: "Send an email", kw: "mail write message hire", run: function () { location.href = "mailto:royavik63@gmail.com"; } },
      { g: "Links", icon: "fa-brands fa-github", label: "GitHub", kw: "code repos source", hint: "↗", run: open("https://github.com/AvikSahaRoy") },
      { g: "Links", icon: "fa-brands fa-linkedin-in", label: "LinkedIn", kw: "profile network connect", hint: "↗", run: open("https://www.linkedin.com/in/aviksaharoy/") },
      { g: "Links", icon: "fa-solid fa-code", label: "LeetCode", kw: "dsa problems coding", hint: "↗", run: open("https://leetcode.com/u/AvikSahaRoy/") },
      { g: "Links", icon: "fa-brands fa-instagram", label: "Instagram", kw: "social photos", hint: "↗", run: open("https://www.instagram.com/aviksaharoy___/") }
    ];

    var shown = [];
    var active = 0;
    var lastFocus = null;

    function score(cmd, q) {
      var label = cmd.label.toLowerCase();
      var hay = (label + " " + cmd.kw).toLowerCase();
      if (label.indexOf(q) === 0) return 4;
      if (label.indexOf(q) > -1) return 3;
      if (hay.indexOf(q) > -1) return 2;
      // loose match: letters in order (e.g. "lkd" -> LinkedIn)
      var i = 0;
      for (var c = 0; c < label.length && i < q.length; c++) {
        if (label[c] === q[i]) i++;
      }
      return i === q.length ? 1 : 0;
    }

    function labelNode(text, q) {
      var span = document.createElement("span");
      span.className = "cmdk__label";
      var idx = q ? text.toLowerCase().indexOf(q) : -1;
      if (idx < 0) {
        span.textContent = text;
      } else {
        span.appendChild(document.createTextNode(text.slice(0, idx)));
        var mark = document.createElement("mark");
        mark.textContent = text.slice(idx, idx + q.length);
        span.appendChild(mark);
        span.appendChild(document.createTextNode(text.slice(idx + q.length)));
      }
      return span;
    }

    function render() {
      var q = input.value.trim().toLowerCase();
      listEl.innerHTML = "";

      if (!q) {
        shown = commands.slice();
      } else {
        shown = commands
          .map(function (c, i) { return { c: c, s: score(c, q), i: i }; })
          .filter(function (x) { return x.s > 0; })
          .sort(function (a, b) { return b.s - a.s || a.i - b.i; })
          .map(function (x) { return x.c; });
      }

      if (!shown.length) {
        var empty = document.createElement("li");
        empty.className = "cmdk__empty";
        empty.setAttribute("role", "presentation");
        empty.textContent = "No results for “" + input.value.trim() + "”";
        listEl.appendChild(empty);
        input.removeAttribute("aria-activedescendant");
        return;
      }

      var lastGroup = null;
      shown.forEach(function (cmd, i) {
        var group = q ? "Results" : cmd.g;
        if (group !== lastGroup) {
          var h = document.createElement("li");
          h.className = "cmdk__group";
          h.setAttribute("role", "presentation");
          h.textContent = group;
          listEl.appendChild(h);
          lastGroup = group;
        }
        var li = document.createElement("li");
        li.className = "cmdk__item";
        li.id = "cmdk-opt-" + i;
        li.setAttribute("role", "option");
        li.style.setProperty("--n", i);
        var ic = document.createElement("i");
        ic.className = cmd.icon;
        ic.setAttribute("aria-hidden", "true");
        li.appendChild(ic);
        li.appendChild(labelNode(cmd.label, q));
        if (cmd.hint) {
          var hint = document.createElement("span");
          hint.className = "cmdk__hint";
          hint.textContent = cmd.hint;
          li.appendChild(hint);
        }
        li.addEventListener("mousemove", function () { if (active !== i) setActive(i); });
        li.addEventListener("click", function () { run(i); });
        listEl.appendChild(li);
      });

      setActive(0);
    }

    function setActive(i) {
      if (!shown.length) return;
      active = (i + shown.length) % shown.length;
      $$(".cmdk__item", listEl).forEach(function (el, n) {
        var on = n === active;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-selected", on ? "true" : "false");
        if (on) {
          input.setAttribute("aria-activedescendant", el.id);
          el.scrollIntoView({ block: "nearest" });
        }
      });
    }

    function run(i) {
      var cmd = shown[i];
      if (!cmd) return;
      closeCmd(true);
      setTimeout(cmd.run, 60);
    }

    function openCmd() {
      if (!root.hidden) return;
      if (typeof closeMenu === "function") closeMenu();
      lastFocus = document.activeElement;
      root.hidden = false;
      void root.offsetWidth; // restart transition
      root.classList.add("is-open");
      document.body.classList.add("cmdk-open");
      if (lenis) lenis.stop();
      input.value = "";
      render();
      input.focus();
    }

    function closeCmd(skipFocus) {
      if (root.hidden) return;
      root.classList.remove("is-open");
      document.body.classList.remove("cmdk-open");
      if (lenis) lenis.start();
      setTimeout(function () { root.hidden = true; }, reduceMotion ? 0 : 220);
      if (!skipFocus && lastFocus && lastFocus.focus) lastFocus.focus();
    }

    input.addEventListener("input", render);

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Home") { e.preventDefault(); setActive(0); }
      else if (e.key === "End") { e.preventDefault(); setActive(shown.length - 1); }
      else if (e.key === "Enter") { e.preventDefault(); run(active); }
      else if (e.key === "Escape") { e.preventDefault(); closeCmd(); }
      else if (e.key === "Tab") { e.preventDefault(); } // keep focus inside the dialog
    });

    root.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeCmd();
    });

    if (openBtn) openBtn.addEventListener("click", openCmd);

    document.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "k") {
        e.preventDefault();
        root.hidden ? openCmd() : closeCmd();
        return;
      }
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (document.activeElement && document.activeElement.isContentEditable);
      if (k === "/" && !typing && root.hidden) {
        e.preventDefault();
        openCmd();
      }
    });
  })();

  onScroll();
})();
