/* ============================================================
   孝感豪锐足球俱乐部 · 交互脚本
   功能：导航、计数器、滚动动画、轮播、FAQ、表单
   ============================================================ */

(function () {
  'use strict';

  /* ========== 无障碍：检测 reduced-motion ========== */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========== 基础元素 ========== */
  var navbar = document.getElementById('navbar');
  var menuToggle = document.getElementById('menuToggle');
  var navMenu = document.getElementById('navMenu');
  var navLinks = document.querySelectorAll('.nav-link');
  var contactForm = document.getElementById('contact-form');
  var formMsg = document.getElementById('form-message');
  var yearEl = document.getElementById('year');
  var fabMain = document.getElementById('fabMain');
  var fabMenu = document.getElementById('fabMenu');
  var fabTop = document.getElementById('fabTop');
  var mobileCta = document.getElementById('mobileCta');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========== 移动端遮罩 ========== */
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:998;opacity:0;pointer-events:none;transition:opacity 0.35s;';
  document.body.appendChild(overlay);

  /* ========== 移动端菜单 ========== */
  function openMenu() {
    navMenu.classList.add('active');
    menuToggle.classList.add('active');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      navMenu.classList.contains('active') ? closeMenu() : openMenu();
    });
  }
  overlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-menu a, .nav-cta-btn').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ========== 滚动效果：导航高亮 + mobileCta 显隐 ========== */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    requestAnimationFrame(function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      /* 导航高亮 */
      var sections = document.querySelectorAll('section[id]');
      var currentId = '';
      sections.forEach(function (s) {
        if (scrollY >= s.offsetTop - 140 && scrollY < s.offsetTop + s.offsetHeight - 100) {
          currentId = s.getAttribute('id');
        }
      });
      navLinks.forEach(function (a) {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + currentId) a.classList.add('active');
      });
      if (scrollY < 300) {
        navLinks.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#home') a.classList.add('active');
        });
      }

      /* 手机端 CTA 按钮：contact 进入视口时隐藏 */
      if (mobileCta) {
        var contactSection = document.getElementById('contact');
        if (contactSection) {
          var contactTop = contactSection.getBoundingClientRect().top;
          mobileCta.style.opacity = contactTop < 100 ? '0' : '1';
          mobileCta.style.pointerEvents = contactTop < 100 ? 'none' : 'auto';
        }
      }

      if (fabTop) fabTop.style.display = scrollY > 600 ? 'flex' : 'none';
      ticking = false;
    });
    ticking = true;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ========== 悬浮按钮组 ========== */
  var fabOpen = false;
  function closeFab() {
    fabOpen = false;
    fabMain.classList.remove('active');
    fabMenu.classList.remove('active');
  }

  if (fabMain) {
    fabMain.addEventListener('click', function () {
      fabOpen = !fabOpen;
      fabMain.classList.toggle('active', fabOpen);
      fabMenu.classList.toggle('active', fabOpen);
    });
  }

  fabMenu.querySelectorAll('a.fab-item').forEach(function (item) {
    item.addEventListener('click', closeFab);
  });

  document.addEventListener('click', function (e) {
    if (fabOpen && !fabMain.contains(e.target) && !fabMenu.contains(e.target)) closeFab();
  });

  if (fabTop) {
    fabTop.addEventListener('click', function (e) {
      e.preventDefault();
      closeFab();
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (fabOpen) closeFab();
      if (navMenu.classList.contains('active')) closeMenu();
    }
  });

  /* ========== 1. 数据滚动计数器 ========== */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = target % 1 !== 0;
    var duration = prefersReduced ? 0 : 1000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* ease-out quad */
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = isFloat
        ? (target * eased).toFixed(1)
        : Math.floor(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      }
    }

    if (prefersReduced) {
      el.textContent = target + suffix;
    } else {
      requestAnimationFrame(step);
    }
  }

  var countersObserved = false;
  function initCounters() {
    if (countersObserved) return;
    var brandStrip = document.getElementById('brandStrip');
    if (!brandStrip) return;
    var counters = brandStrip.querySelectorAll('.counter');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          counters.forEach(function (c) { animateCounter(c); });
          observer.unobserve(entry.target);
          countersObserved = true;
        }
      });
    }, { threshold: 0.4 });

    observer.observe(brandStrip);
  }

  /* ========== 2. 滚动出现动画 ========== */
  function initScrollReveal() {
    if (prefersReduced) return;
    var revealEls = document.querySelectorAll(
      '.founder-card, .coach-card, .academy-tier-card, .env-photo-card, ' +
      '.honor-card, .timeline-item, .club-logo-display, .qr-card, ' +
      '.advantage-card, .story-card, .result-entry, .gallery-item, ' +
      '.star-card, .star-detail-panel, .faq-item, .carousel, .pricing-card'
    );

    revealEls.forEach(function (el) {
      el.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ========== 3. 赛事成绩逐个出现 ========== */
  function initHonorsStagger() {
    if (prefersReduced) return;

    /* 荣誉卡片 */
    var honorCards = document.querySelectorAll('.honors-grid .honor-card');
    honorCards.forEach(function (card, i) {
      card.classList.add('reveal-stagger');
      card.style.transitionDelay = (i * 0.12) + 's';
    });

    /* 赛事记录条目 */
    var entries = document.querySelectorAll('.results-list .result-entry');
    entries.forEach(function (entry, i) {
      entry.classList.add('reveal-stagger');
      entry.style.transitionDelay = (i * 0.08) + 's';
    });

    var honorsSection = document.getElementById('honors');
    if (!honorsSection) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          honorCards.forEach(function (card) { card.classList.add('visible'); });
          entries.forEach(function (e) { e.classList.add('visible'); });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    observer.observe(honorsSection);
  }

  /* ========== 4. 照片轮播 ========== */
  function initCarousel() {
    var track = document.getElementById('carouselTrack');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var dotsContainer = document.getElementById('carouselDots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    var slides = track.querySelectorAll('.carousel-slide');
    var total = slides.length;
    if (total === 0) return;

    var current = 0;
    var autoInterval;
    var autoDelay = prefersReduced ? 999999 : 3500;
    var isTransitioning = false;

    /* 创建指示点 */
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', '第' + (i + 1) + '张');
      dot.addEventListener('click', (function (idx) {
        return function () { goTo(idx); };
      })(i));
      dotsContainer.appendChild(dot);
    }
    var dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goTo(index) {
      if (isTransitioning || index === current) return;
      isTransitioning = true;
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
      setTimeout(function () { isTransitioning = false; }, 520);
    }

    function goNext() { goTo((current + 1) % total); }
    function goPrev() { goTo((current - 1 + total) % total); }

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    /* 触摸滑动 */
    var touchStartX = 0;
    var touchEndX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goNext() : goPrev();
      }
    }, { passive: true });

    /* 自动轮播 */
    function startAuto() {
      stopAuto();
      autoInterval = setInterval(goNext, autoDelay);
    }
    function stopAuto() {
      if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
    }

    var carouselEl = document.getElementById('photoCarousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopAuto);
      carouselEl.addEventListener('mouseleave', startAuto);
      carouselEl.addEventListener('touchstart', stopAuto, { passive: true });
    }

    /* 可见时才自动播放 */
    var carouselObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startAuto();
        } else {
          stopAuto();
        }
      });
    }, { threshold: 0.3 });
    carouselObserver.observe(carouselEl);

    /* 初始状态 */
    if (!prefersReduced) startAuto();
  }

  /* ========== 5. FAQ 折叠 ========== */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.parentElement;
        var isOpen = item.classList.contains('open');

        /* 关闭其他 */
        document.querySelectorAll('.faq-item.open').forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          this.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ========== 6. 明星教练详情折叠 ========== */
  document.querySelectorAll('.star-card-detail-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = this.getAttribute('data-target');
      var panel = document.getElementById(targetId);
      if (!panel) return;

      var isOpen = panel.classList.contains('show');

      /* 关闭其他面板 */
      document.querySelectorAll('.star-detail-panel.show').forEach(function (other) {
        if (other !== panel) {
          other.classList.remove('show');
          var otherBtn = document.querySelector('[data-target="' + other.id + '"]');
          if (otherBtn) {
            otherBtn.classList.remove('active');
            otherBtn.querySelector('.toggle-text').textContent = '查看教练详情';
          }
        }
      });

      if (isOpen) {
        panel.classList.remove('show');
        this.classList.remove('active');
        this.querySelector('.toggle-text').textContent = '查看教练详情';
      } else {
        panel.classList.add('show');
        this.classList.add('active');
        this.querySelector('.toggle-text').textContent = '收起详情';
      }
    });
  });

  /* ========== 7. 教练详情展开 / 收起 ========== */
  document.querySelectorAll('.coach-detail-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = this.getAttribute('data-target');
      var body = document.getElementById(targetId);
      if (!body) return;

      var isOpen = body.classList.contains('show');
      if (isOpen) {
        body.classList.remove('show');
        this.classList.remove('active');
        this.querySelector('.toggle-text').textContent = '查看详情';
      } else {
        body.classList.add('show');
        this.classList.add('active');
        this.querySelector('.toggle-text').textContent = '收起详情';
      }
    });
  });

  /* ========== 7. 联系表单 ========== */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var inputs = contactForm.querySelectorAll('input, select, textarea');
      var allFilled = true;
      inputs.forEach(function (el) {
        if (!el.value || el.value.trim() === '') allFilled = false;
      });

      if (!allFilled) {
        formMsg.textContent = '请填写所有必填字段。';
        formMsg.className = 'form-message error';
        return;
      }

      var phoneEl = contactForm.querySelector('input[type="tel"]');
      if (phoneEl && !/^[\d\-+\s]{7,15}$/.test(phoneEl.value.trim())) {
        formMsg.textContent = '请输入有效的联系电话。';
        formMsg.className = 'form-message error';
        return;
      }

      var nameEl = contactForm.querySelectorAll('input[type="text"]')[0];
      var parentName = nameEl ? nameEl.value.trim() : '家长';
      formMsg.textContent = '感谢 ' + parentName + '！您的信息已提交成功，我们将尽快与您联系安排体验课。⚽';
      formMsg.className = 'form-message success';
      contactForm.reset();

      setTimeout(function () {
        formMsg.textContent = '';
        formMsg.className = 'form-message';
      }, 6000);
    });
  }

  /* ========== 手机端 CTA 按钮平滑滚动 ========== */
  if (mobileCta) {
    mobileCta.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById('contact');
      if (target) {
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
      if (navMenu.classList.contains('active')) closeMenu();
    });
  }

  /* ========== 初始化所有模块 ========== */
  initCounters();
  initScrollReveal();
  initHonorsStagger();
  initCarousel();
  initFAQ();
  onScroll();

  if (fabTop) fabTop.style.display = 'none';
  if (mobileCta) mobileCta.style.opacity = '1';

  /* ========== 监听 reduced-motion 变化 ========== */
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
    if (e.matches) {
      prefersReduced = true;
      /* 移除所有动画类 */
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
        el.classList.add('visible');
        el.style.transitionDelay = '0s';
      });
    }
  });

  console.log(
    '%c⚽ 孝感豪锐足球俱乐部 %c官方网站',
    'font-size:1.2em;font-weight:bold;color:#0EA5E9;',
    'font-size:0.9em;color:#64748B;'
  );
  console.log('%c扎根孝感 · 陪伴孩子在足球中成长', 'font-size:0.85em;color:#94A3B8;');
})();
