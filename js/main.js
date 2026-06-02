/* ============================================================
   孝感豪锐足球俱乐部 · 交互脚本
   ============================================================ */

(function () {
  'use strict';

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

  /* 移动端遮罩 */
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:998;opacity:0;pointer-events:none;transition:opacity 0.35s;';
  document.body.appendChild(overlay);

  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  /* ========== 滚动效果 ========== */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    requestAnimationFrame(function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (fabOpen) closeFab();
      if (navMenu.classList.contains('active')) closeMenu();
    }
  });

  /* ========== 联系表单 ========== */
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
      formMsg.textContent = '感谢 ' + parentName + '！您的信息已提交成功，我们将尽快与您联系安排免费体验课。⚽';
      formMsg.className = 'form-message success';
      contactForm.reset();

      setTimeout(function () {
        formMsg.textContent = '';
        formMsg.className = 'form-message';
      }, 6000);
    });
  }

  /* ========== 滚动渐显 ========== */
  (function () {
    if (!('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll(
      '.founder-card, .team-card, .academy-tier-card, .env-photo-card, .honor-card, .timeline-item, .club-logo-display, .qr-card'
    );
    targets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    targets.forEach(function (el) { observer.observe(el); });
  })();

  /* ========== 初始 ========== */
  onScroll();
  if (fabTop) fabTop.style.display = 'none';

  console.log(
    '%c⚽ 孝感豪锐足球俱乐部 %c官方网站',
    'font-size:1.2em;font-weight:bold;color:#0EA5E9;',
    'font-size:0.9em;color:#64748B;'
  );
  console.log('%c专业青训 · 科学培养 · 快乐成长', 'font-size:0.85em;color:#94A3B8;');
})();
