document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Active Nav State Detection
  // This handles local server pathing and nested subpaths in GitHub Pages
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1);
  const navLinks = document.querySelectorAll('nav a');
  
  let matched = false;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (pageName === href) {
      link.classList.add('active');
      matched = true;
    } else {
      link.classList.remove('active');
    }
  });

  // Fallback to home page if path represents index folder root
  if (!matched && (pageName === '' || pageName === 'index.html')) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === 'index.html') {
        link.classList.add('active');
      }
    });
  }

  // 2. Bilingual Translation Engine
  let currentLang = 'en';

  const updateLanguage = (lang) => {
    if (lang !== 'en' && lang !== 'ja') lang = 'en';
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Update all elements with [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations && translations[lang] && translations[lang][key]) {
        const translation = translations[lang][key];
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          // If the element contains specific tag structures we want to preserve,
          // like navigation numbers <span>01</span>, we ensure translations.js includes them.
          element.innerHTML = translation;
        }
      }
    });

    // Update document metadata
    document.documentElement.setAttribute('lang', lang);
    const titleKey = document.title.includes('Philosophy') ? 'nav_about' :
                     document.title.includes('Archive') ? 'projects_heading' :
                     document.title.includes('Contact') ? 'contact_heading' : 'home_title';
    
    if (titleKey === 'home_title') {
      document.title = lang === 'ja' ? 'Infinite Reset Studios — メディア出版 & トラベル Zine' : 'Infinite Reset Studios — Media Publishing & Travel Zines';
    } else {
      const pageTitle = translations[lang][titleKey].replace(/<\/?[^>]+(>|$)/g, "").replace(/\d+/g, "").trim(); // Strip HTML tags & numbers
      document.title = `${pageTitle} — Infinite Reset Studios`;
    }

    // Set URL parameter without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());

    // Update switcher state in header
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  const initLanguage = () => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const savedLang = localStorage.getItem('lang');
    
    // Fallback: Browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const preferredLang = (browserLang && browserLang.startsWith('ja')) ? 'ja' : 'en';
    
    const targetLang = urlLang || savedLang || preferredLang;
    updateLanguage(targetLang);
  };

  // Wire up language switchers
  document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      updateLanguage(selectedLang);
    });
  });

  // Run initial translation
  initLanguage();

  // 3. Interactive Contact Form Handler
  const contactForm = document.querySelector('.contact-form');
  const formStatus = document.querySelector('.form-status');
  
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = contactForm.querySelector('input[type="email"]');
      const messageInput = contactForm.querySelector('textarea');
      
      if (!emailInput.value || !messageInput.value) {
        formStatus.style.color = 'var(--color-accent)';
        formStatus.textContent = currentLang === 'ja' ? 'エラー：必須項目が空です。' : 'ERROR: REQUIRED FIELDS EMPTY.';
        return;
      }

      formStatus.style.color = 'var(--color-text-secondary)';
      formStatus.textContent = currentLang === 'ja' ? '接続中...' : 'CONNECTING...';
      
      setTimeout(() => {
        formStatus.textContent = currentLang === 'ja' ? 'メッセージ送信中...' : 'TRANSMITTING MESSAGE...';
      }, 500);

      setTimeout(() => {
        formStatus.style.color = 'var(--color-text-primary)';
        formStatus.textContent = currentLang === 'ja' ? '送信に成功しました。追ってご連絡いたします。' : 'TRANSMISSION SUCCESSFUL. WE WILL RESPOND SHORTLY.';
        contactForm.reset();
      }, 1800);
    });
  }
});
