'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import emailjs from '@emailjs/browser';

// useLayoutEffect di server memicu warning, jadi fallback ke useEffect saat SSR
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const TAB_ORDER = ['magang', 'pkl'];
const TAB_EXIT_MS = 300;
const TAB_ENTER_MS = 500;
const LANG_WIPE_IN_MS = 550;
const LANG_WIPE_HOLD_MS = 250;
const LANG_WIPE_OUT_MS = 550;
const THEME_REVEAL_MS = 550;
// Navbar muncul setelah halaman digulir sejauh 30% tinggi layar
const NAV_REVEAL_RATIO = 0.3;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lebar viewport desktop yang dipakai iframe preview, lalu diskalakan agar muat di kartu
const PREVIEW_VIEWPORT = 1280;

function PreviewFrame({ src }) {
  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(([entry]) => {
      box.style.setProperty('--preview-scale', entry.contentRect.width / PREVIEW_VIEWPORT);
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="preview-frame" ref={boxRef}>
      <iframe src={src} scrolling="no" tabIndex="-1" loading="lazy" className="preview-iframe" aria-hidden="true" />
    </div>
  );
}

const NAV_ITEMS = [
  { id: 'home', label: ['Home', 'Home'] },
  { id: 'about', label: ['Tentang', 'About'] },
  { id: 'education', label: ['Pendidikan', 'Education'] },
  { id: 'experience', label: ['Pengalaman', 'Experience'] },
  { id: 'projects', label: ['Proyek', 'Projects'] },
  { id: 'contact', label: ['Kontak', 'Contact'] },
];

const ICON_MAIL = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const ICON_CHAT = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);

const ICON_LINKEDIN = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const CONTACTS = [
  { href: 'mailto:mahardikahaikal@gmail.com', label: 'mahardikahaikal@gmail.com', name: 'Email', icon: ICON_MAIL },
  { href: 'https://wa.me/6287766891821', label: '+62 877-6689-1821', name: 'WhatsApp', icon: ICON_CHAT, external: true },
  { href: 'https://www.linkedin.com/in/muhammad-haikal-mahardika-b1895b411', label: 'muhammad-haikal-mahardika', name: 'LinkedIn', icon: ICON_LINKEDIN, external: true },
];

const SKILL_GROUPS = [
  { title: 'Programming Languages', items: ['Python', 'JavaScript', 'HTML', 'CSS'] },
  { title: 'Specializations', items: ['Web Development', 'Fullstack Dev'] },
];

const GPA = 3.79;
const GPA_MAX = 4;

const externalProps = (contact) => contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState('id');
  const [isLightMode, setIsLightMode] = useState(false);
  const [themeTurns, setThemeTurns] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeExperienceTab, setActiveExperienceTab] = useState('magang');
  const [displayedTab, setDisplayedTab] = useState('magang');
  const [tabPhase, setTabPhase] = useState('idle');
  const [tabDir, setTabDir] = useState('next');
  const [langWipe, setLangWipe] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [activeProject, setActiveProject] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);

  const projectsGridRef = useRef(null);
  const tabsRef = useRef(null);
  const tabIndicatorRef = useRef(null);
  const experienceContentRef = useRef(null);
  const tabTimers = useRef([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Language helper function
  const t = (id, en) => currentLanguage === 'en' ? en : id;

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'id';
    const savedLightMode = localStorage.getItem('lightMode') === 'enabled';
    
    setCurrentLanguage(savedLanguage);
    setIsLightMode(savedLightMode);
    setThemeTurns(savedLightMode ? 1 : 0);

    document.documentElement.lang = savedLanguage;
    if (savedLightMode) {
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const updateLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Lingkaran membesar dari tombol bahasa, ganti bahasa saat layar tertutup, lalu menyusut kembali
  const toggleLanguage = (e) => {
    if (langWipe) return;
    const newLang = currentLanguage === 'id' ? 'en' : 'id';

    if (prefersReducedMotion()) {
      updateLanguage(newLang);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    setLangWipe({ x, y, r, phase: 'in', label: newLang === 'en' ? 'English' : 'Bahasa Indonesia' });
    setTimeout(() => {
      updateLanguage(newLang);
      setLangWipe((wipe) => wipe && { ...wipe, phase: 'out' });
    }, LANG_WIPE_IN_MS + LANG_WIPE_HOLD_MS);
    setTimeout(() => setLangWipe(null), LANG_WIPE_IN_MS + LANG_WIPE_HOLD_MS + LANG_WIPE_OUT_MS);
  };

  // Konten lama keluar dulu, baru konten baru masuk dari arah tab yang dipilih
  const switchExperienceTab = (tab) => {
    if (tab === activeExperienceTab) return;
    tabTimers.current.forEach(clearTimeout);

    setActiveExperienceTab(tab);

    if (prefersReducedMotion()) {
      setDisplayedTab(tab);
      return;
    }

    const wrap = experienceContentRef.current;
    wrap.style.height = `${wrap.offsetHeight}px`;

    setTabDir(TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(activeExperienceTab) ? 'next' : 'prev');
    setTabPhase('exit');
    tabTimers.current = [
      setTimeout(() => {
        setDisplayedTab(tab);
        setTabPhase('enter');
      }, TAB_EXIT_MS),
      setTimeout(() => {
        setTabPhase('idle');
        wrap.style.height = '';
      }, TAB_EXIT_MS + TAB_ENTER_MS),
    ];
  };

  // Animasikan tinggi wrapper ke tinggi konten tab yang baru
  useIsoLayoutEffect(() => {
    const wrap = experienceContentRef.current;
    if (!wrap || !wrap.style.height) return;
    wrap.style.height = `${wrap.firstElementChild.offsetHeight}px`;
  }, [displayedTab]);

  // Garis bawah tab bergeser mengikuti tab aktif
  useIsoLayoutEffect(() => {
    const update = () => {
      const active = tabsRef.current?.querySelector('.tab-btn.active');
      const indicator = tabIndicatorRef.current;
      if (!active || !indicator) return;
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
    };

    update();
    document.fonts?.ready.then(update);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [activeExperienceTab, currentLanguage]);

  useEffect(() => () => tabTimers.current.forEach(clearTimeout), []);

  const applyTheme = (newMode) => {
    setIsLightMode(newMode);
    setThemeTurns(turns => turns + 1);
    document.documentElement.classList.toggle('light-mode', newMode);
    localStorage.setItem('lightMode', newMode ? 'enabled' : 'disabled');
  };

  // Tema baru langsung terbuka sebagai lingkaran yang membesar dari tombol tema
  const toggleTheme = (e) => {
    const newMode = !isLightMode;

    if (!document.startViewTransition || prefersReducedMotion()) {
      applyTheme(newMode);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    // Titik awal juga dipasang di CSS agar lapisan baru sudah terpotong sejak frame pertama (cegah flicker)
    const root = document.documentElement;
    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.classList.add('theme-switching');
    const transition = document.startViewTransition(() => flushSync(() => applyTheme(newMode)));

    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: THEME_REVEAL_MS, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards', pseudoElement: '::view-transition-new(root)' }
      );
    });
    transition.finished.finally(() => root.classList.remove('theme-switching'));
  };

  // Reveal saat scroll: elemen .reveal muncul ketika masuk viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Efek ripple saat tombol ditekan
  useEffect(() => {
    const handlePointerDown = (e) => {
      const button = e.target.closest('.btn, .tab-btn, .language-toggle, .theme-toggle');
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.addEventListener('animationend', () => ripple.remove());
      button.appendChild(ripple);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    const handleSmoothScroll = () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;
          
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    };

    handleSmoothScroll();
  }, []);

  // Sidebar terbuka: kunci scroll halaman, tutup dengan Esc, dan tutup otomatis saat layar melebar ke desktop
  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (e) => e.key === 'Escape' && closeSidebar();
    const desktop = window.matchMedia('(min-width: 769px)');
    const handleDesktop = () => desktop.matches && closeSidebar();

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    desktop.addEventListener('change', handleDesktop);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      desktop.removeEventListener('change', handleDesktop);
    };
  }, [isSidebarOpen]);

  // Navbar disembunyikan di hero, baru turun setelah halaman digulir
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setIsNavVisible(window.scrollY > window.innerHeight * NAV_REVEAL_RATIO);
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Tandai menu sesuai section yang sedang berada di tengah layar
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    NAV_ITEMS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Carousel proyek di HP: kartu yang paling dekat ke tengah jadi titik aktif
  const handleProjectsScroll = () => {
    const grid = projectsGridRef.current;
    const center = grid.scrollLeft + grid.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;

    Array.from(grid.children).forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    });
    setActiveProject(closest);
  };

  const scrollToProject = (i) => {
    const grid = projectsGridRef.current;
    const card = grid.children[i];
    grid.scrollTo({
      left: card.offsetLeft - (grid.clientWidth - card.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const handleProjectPreviewClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      await emailjs.sendForm(
        'service_rabzii1',
        'template_l1xpwnu',
        form,
        '7t5hAL3jXCVvBsCZI'
      );
      alert(t('Terima kasih! Pesan Anda telah dikirim.', 'Thank you! Your message has been sent.'));
      form.reset();
    } catch (error) {
      alert(t('Gagal mengirim pesan. Coba lagi nanti.', 'Failed to send message. Please try again later.'));
    }
  };

  // Tombol bahasa, tema, dan hamburger dipakai di navbar dan di pojok atas hero
  const navbarActions = (
    <div className="navbar-actions">
      <button className="language-toggle" onClick={toggleLanguage} title="Toggle Language">
        <span key={currentLanguage} className="language-text">{currentLanguage === 'id' ? 'ID' : 'EN'}</span>
      </button>
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
        <span className="theme-orbit" style={{ transform: `rotate(${themeTurns * 180}deg)` }}>
          <span className="theme-icon theme-icon-moon">🌙</span>
          <span className="theme-icon theme-icon-sun">☀️</span>
        </span>
      </button>
      {/* Hamburger - mobile only */}
      <button className="hamburger" onClick={toggleSidebar} aria-label="Menu" aria-expanded={isSidebarOpen}>
        <span className={`hamburger-line ${isSidebarOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isSidebarOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isSidebarOpen ? 'open' : ''}`}></span>
      </button>
    </div>
  );

  // Judul section: nomor dan label menu (sama seperti di sidebar), lalu judul besar
  const sectionHead = (id, title) => {
    const index = NAV_ITEMS.findIndex((item) => item.id === id);
    return (
      <div className="section-head reveal">
        <span className="section-eyebrow">
          <span className="section-num">{String(index + 1).padStart(2, '0')}</span>
          {t(...NAV_ITEMS[index].label)}
        </span>
        <h2>{title}</h2>
      </div>
    );
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${isNavVisible ? 'navbar-visible' : ''}`} aria-hidden={!isNavVisible}>
        <div className="container">
          <div className="nav-brand">Haikal</div>

          {/* Desktop menu */}
          <ul className="nav-menu desktop-menu">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className={activeSection === id ? 'active' : ''}>{t(...label)}</a>
              </li>
            ))}
          </ul>

          {navbarActions}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`} aria-label="Menu">
        <div className="sidebar-header">
          <span className="nav-brand">Haikal</span>
          <button className="sidebar-close" onClick={closeSidebar} aria-label={t('Tutup menu', 'Close menu')}>✕</button>
        </div>

        <p className="sidebar-label">Menu</p>
        <ul className="sidebar-menu">
          {NAV_ITEMS.map(({ id, label }, i) => (
            <li key={id} style={{ '--i': i }}>
              <a href={`#${id}`} onClick={closeSidebar} className={activeSection === id ? 'active' : ''}>
                <span className="sidebar-num">{String(i + 1).padStart(2, '0')}</span>
                {t(...label)}
                <span className="sidebar-arrow" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <p className="sidebar-label">{t('Hubungi Saya', 'Get in Touch')}</p>
          <div className="sidebar-socials">
            {CONTACTS.map((contact) => (
              <a key={contact.name} href={contact.href} {...externalProps(contact)} aria-label={contact.name}>
                {contact.icon}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-grid" aria-hidden="true"></div>

        {/* Pengganti navbar selama masih di hero */}
        <div className="hero-topbar container fade-in">
          <span className="nav-brand">Haikal</span>
          {navbarActions}
        </div>

        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-status fade-in">
              <span className="hero-status-dot" aria-hidden="true"></span>
              {t('Terbuka untuk peluang baru', 'Open to new opportunities')}
            </span>

            <h1 className="hero-name fade-in delay-1">
              <span className="hero-greeting">{t('Halo, saya', 'Hi, I\'m')}</span>
              Muhammad <span className="hero-name-accent">Haikal</span> Mahardika
            </h1>

            <p className="hero-role fade-in delay-1">
              Software Engineer<span className="hero-role-sep" aria-hidden="true">/</span>
              Fullstack Developer<span className="hero-role-sep" aria-hidden="true">/</span>
              Problem Solver
            </p>

            <p className="hero-intro fade-in delay-2">
              {t('Saya membangun produk web dari ide hingga siap dipakai — rapi di sisi tampilan, kokoh di sisi server.', 'I build web products from idea to launch — clean on the front end, solid on the back end.')}
            </p>

            <div className="hero-actions fade-in delay-2">
              <button
                className="btn btn-primary"
                onClick={() => document.getElementById('projects').scrollIntoView({behavior: 'smooth'})}
              >
                {t('Lihat Proyek', 'View Projects')} <span aria-hidden="true">→</span>
              </button>
              <a href="#contact" className="btn btn-secondary">{t('Hubungi Saya', 'Get in Touch')}</a>
            </div>

            <ul className="hero-meta fade-in delay-3">
              <li>📍 Samarinda, Indonesia</li>
              <li>🌐 Remote Friendly</li>
            </ul>
          </div>

          <div className="hero-visual fade-in delay-1">
            <div className="hero-photo-frame">
              <img src="/Prop/haikal_no_bg.png" alt="Muhammad Haikal Mahardika" className="hero-photo" />
            </div>
            <span className="hero-chip hero-chip-top" aria-hidden="true">⚡ Fullstack</span>
            <span className="hero-chip hero-chip-bottom" aria-hidden="true">{'</>'} Python · JavaScript</span>
          </div>
        </div>

        <a href="#about" className="scroll-cue" aria-label={t('Gulir ke bawah', 'Scroll down')}>
          <span className="scroll-cue-mouse"><span className="scroll-cue-wheel"></span></span>
          {/* Versi layar sentuh: jari yang menggeser ke atas */}
          <span className="scroll-cue-touch" aria-hidden="true">
            <svg className="scroll-cue-finger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 14a8 8 0 0 1-8 8"/>
              <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
              <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/>
              <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/>
              <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
            </svg>
          </span>
          <span className="scroll-cue-label">{t('Geser', 'Swipe')}</span>
          <span className="scroll-cue-arrow"></span>
        </a>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          {sectionHead('about', t('Mengubah ide menjadi solusi yang berfungsi', 'Turning ideas into working solutions'))}
          <div className="about-content">
            <div className="about-text reveal reveal-left">
              <p className="about-lead">{t('Saya adalah lulusan informatika dari Samarinda yang benar-benar passionate tentang pengembangan software. Ada sesuatu yang istimewa tentang mengubah ide menjadi solusi yang berfungsi—itulah yang mendorong saya.', 'I\'m a computer science graduate from Samarinda who\'s genuinely passionate about software development. There\'s something special about turning ideas into working solutions—that\'s what drives me.')}</p>
              <p>{t('Saya suka bekerja dengan Python, JavaScript, HTML, dan CSS—dan paling semangat saat membangun produk web yang benar-benar bisa dipakai orang. Saya selalu eksplor teknologi baru dan terus mendorong diri untuk berkembang.', 'I love working with Python, JavaScript, HTML, and CSS—and I\'m happiest when building real products that people can actually use. I\'m always exploring new tech and pushing myself to improve.')}</p>
              <ul className="about-stats">
                <li><strong>{GPA}</strong><span>{t('IPK dari 4.00', 'GPA out of 4.00')}</span></li>
                <li><strong>2</strong><span>{t('Pengalaman kerja', 'Work placements')}</span></li>
                <li><strong>3</strong><span>{t('Proyek unggulan', 'Featured projects')}</span></li>
              </ul>
            </div>
            <div className="skills-card reveal reveal-right" style={{ '--reveal-delay': '0.15s' }}>
              <h3>{t('Keahlian Teknis', 'Technical Skills')}</h3>
              {SKILL_GROUPS.map((group) => (
                <div key={group.title} className="skill-group">
                  <h4>{group.title}</h4>
                  <ul className="skill-list">
                    {group.items.map((skill) => <li key={skill} className="skill-pill">{skill}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="education">
        <div className="container">
          {sectionHead('education', t('Fondasi di bidang informatika', 'A foundation in computer science'))}
          <article className="edu-card reveal">
            <div className="edu-main">
              <div className="edu-meta">
                <span className="edu-period">Sep 2021 – Oct 2025</span>
                <span className="edu-tag">{t('Lulus', 'Graduated')}</span>
              </div>
              <h3>{t('S1 Teknik Informatika', 'Bachelor of Engineering in Computer Science')}</h3>
              <p className="edu-institution">Universitas Muhammadiyah Kalimantan Timur, Samarinda</p>
              <ul className="edu-points">
                <li>{t('Merancang dan membangun proyek software lintas bahasa—selalu fokus pada solusi yang nyata dan berfungsi.', 'Designed and built software projects across multiple languages—always focused on real, working solutions.')}</li>
                <li>{t('Fondasi kuat dalam algoritma dan struktur data—diterapkan dalam proyek nyata, bukan sekadar teori.', 'Strong foundation in algorithms and data structures—applied in actual projects, not just theory.')}</li>
              </ul>
            </div>

            {/* Cincin IPK: busur terisi sesuai IPK / 4.00 */}
            <div className="edu-gpa">
              <div className="edu-gpa-ring" style={{ '--gpa': GPA / GPA_MAX }}>
                <span className="edu-gpa-value">
                  <strong>{GPA}</strong>
                  <small>/ {GPA_MAX.toFixed(2)}</small>
                </span>
              </div>
              <p>{t('Indeks Prestasi Kumulatif', 'Cumulative GPA')}</p>
            </div>
          </article>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="experience">
        <div className="container">
          {sectionHead('experience', t('Pengalaman Kerja', 'Work Experience'))}

          <div className="reveal">
          {/* Tab System */}
          <div className="tabs" ref={tabsRef}>
            <button
              className={`tab-btn ${activeExperienceTab === 'magang' ? 'active' : ''}`}
              onClick={() => switchExperienceTab('magang')}
            >
              {t('Magang', 'Internship')}
            </button>
            <button
              className={`tab-btn ${activeExperienceTab === 'pkl' ? 'active' : ''}`}
              onClick={() => switchExperienceTab('pkl')}
            >
              {t('Praktek Kerja Lapangan', 'Field Practice')}
            </button>
            <span className="tab-indicator" ref={tabIndicatorRef} aria-hidden="true"></span>
          </div>

          {/* Tab Content */}
          <div className="experience-content" ref={experienceContentRef}>
            <div className={`tab-panel ${tabPhase !== 'idle' ? `tab-${tabPhase}-${tabDir}` : ''}`}>
            {displayedTab === 'magang' && (
              <article className="edu-card exp-card">
                <div className="edu-main">
                  <div className="edu-meta">
                    <span className="edu-period">{t('Sep 2026 – Okt 2026', 'Sep 2026 – Oct 2026')}</span>
                    <span className="exp-tag">Next.js</span>
                  </div>
                  <h3>{t('Magang', 'Internship')}</h3>
                  <p className="edu-institution">{t('Dinas Komunikasi dan Informatika Kota Samarinda', 'Communication and Informatics Office of Samarinda City')}</p>
                  <ul className="edu-points">
                    <li>{t('Mengembangkan Sistem Klasifikasi Informasi Publik untuk PPID Kota Samarinda bersama Ibrahim Surya Anwarulkarim.', 'Developed a Public Information Classification System for the Samarinda City PPID (Information and Documentation Management Office) together with Ibrahim Surya Anwarulkarim.')}</li>
                    <li>{t('Membangun aplikasi web Next.js yang menentukan status informasi (Terbuka/Dikecualikan) beserta rujukan hukumnya.', 'Built a Next.js web application that determines the status of public information (Open/Exempt) along with its legal basis.')}</li>
                  </ul>
                </div>
                <figure className="exp-visual">
                  <a
                    href="https://sistem-klasifikasi-informasi.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="exp-frame"
                    aria-label={t('Buka Sistem Klasifikasi Informasi Publik di tab baru', 'Open the Public Information Classification System in a new tab')}
                  >
                    <span className="preview-bar" aria-hidden="true">
                      <span></span><span></span><span></span>
                      <em>sistem-klasifikasi-informasi.vercel.app</em>
                    </span>
                    <PreviewFrame src="https://sistem-klasifikasi-informasi.vercel.app/" />
                  </a>
                  <figcaption>{t('Kunjungi situs ↗', 'Visit site ↗')}</figcaption>
                </figure>
              </article>
            )}
            {displayedTab === 'pkl' && (
              <article className="edu-card exp-card">
                <div className="edu-main">
                  <div className="edu-meta">
                    <span className="edu-period">{t('Jul 2023 – Okt 2023', 'Jul 2023 – Oct 2023')}</span>
                    <span className="exp-tag">Auto Scoring</span>
                  </div>
                  <h3>{t('Praktek Kerja Lapangan', 'Field Practice')}</h3>
                  <p className="edu-institution">Universitas Muhammadiyah Kalimantan Timur</p>
                  <ul className="edu-points">
                    <li>{t('Membuat dan mengembangkan konsep algoritma yang dipakai untuk Auto Scoring.', 'Created and developed algorithm concepts used for Auto Scoring.')}</li>
                    <li>{t('Berkolaborasi dengan tim dalam pengembangan sistem Auto Scoring.', 'Collaborated with the team in developing the Auto Scoring system.')}</li>
                  </ul>
                </div>
                <figure className="exp-visual">
                  <button
                    type="button"
                    className="exp-frame"
                    onClick={() => { setLightboxSrc('/Prop/pkl-doc.png'); setLightboxOpen(true); }}
                    aria-label={t('Perbesar dokumentasi PKL', 'Enlarge field practice documentation')}
                  >
                    <span className="preview-bar" aria-hidden="true">
                      <span></span><span></span><span></span>
                      <em>{t('dokumentasi / auto-scoring', 'documentation / auto-scoring')}</em>
                    </span>
                    <img
                      src="/Prop/pkl-doc.png"
                      alt={t('Dokumentasi PKL - Prototype Auto Scoring', 'PKL Documentation - Auto Scoring Prototype')}
                      width="548"
                      height="680"
                      loading="lazy"
                      className="exp-img"
                    />
                  </button>
                  <figcaption>{t('Klik untuk memperbesar', 'Click to enlarge')}</figcaption>
                </figure>
              </article>
            )}
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          {sectionHead('projects', t('Proyek Saya', 'My Projects'))}
          <div className="projects-grid" ref={projectsGridRef} onScroll={handleProjectsScroll}>
            <div className="project-card hover-lift reveal">
              <div className="project-preview">
                <div className="preview-bar" aria-hidden="true">
                  <span></span><span></span><span></span>
                  <em>sistem-klasifikasi-informasi.vercel.app</em>
                </div>
                {/* Situs PPID hanya mengizinkan di-embed dari mhmofficialporto.vercel.app (CSP frame-ancestors) */}
                <PreviewFrame src="https://sistem-klasifikasi-informasi.vercel.app/" />
                <div className="preview-overlay" onClick={() => handleProjectPreviewClick('https://sistem-klasifikasi-informasi.vercel.app/')}>
                  <span className="preview-fallback">{t('Kunjungi Situs →', 'Visit Site →')}</span>
                </div>
              </div>
              <div className="project-content">
                <span className="project-num" aria-hidden="true">01</span>
                <div className="template-tags">
                  <span className="template-tag tag-next">Next.js</span>
                </div>
                <h3>{t('Sistem Klasifikasi Informasi Publik', 'Public Information Classification System')}</h3>
                <p className="project-org">{t('Diskominfo Kota Samarinda · untuk PPID', 'Diskominfo Samarinda City · for PPID')}</p>
                <p>{t('Pemeriksa status informasi publik (Terbuka/Dikecualikan) beserta rujukan hukumnya.', 'A checker for the status of public information (Open/Exempt) along with its legal basis.')}</p>
                <button className="btn btn-secondary" onClick={() => handleProjectPreviewClick('https://sistem-klasifikasi-informasi.vercel.app/')}>
                  <span>{t('Kunjungi Situs →', 'Visit Site →')}</span>
                </button>
              </div>
            </div>
            <div className="project-card hover-lift reveal" style={{ '--reveal-delay': '0.12s' }}>
              <div className="project-preview">
                <div className="preview-bar" aria-hidden="true">
                  <span></span><span></span><span></span>
                  <em>porto / index.html</em>
                </div>
                <PreviewFrame src="/WebTemplate/FirstTemplate/index.html" />
                <div className="preview-overlay" onClick={() => handleProjectPreviewClick('/WebTemplate/FirstTemplate/index.html')}>
                  <span className="preview-fallback">Click to Preview →</span>
                </div>
              </div>
              <div className="project-content">
                <span className="project-num" aria-hidden="true">02</span>
                <div className="template-tags">
                  <span className="template-tag tag-html">HTML</span>
                </div>
                <h3>Porto</h3>
                <p>{t('Template portofolio gelap minimalis dengan aksen violet dan animasi halus.', 'A dark minimal portfolio template with violet accents and smooth animations.')}</p>
                <button className="btn btn-secondary" onClick={() => handleProjectPreviewClick('/WebTemplate/FirstTemplate/index.html')}>
                  <span>{t('Preview →', 'Preview →')}</span>
                </button>
              </div>
            </div>
            <div className="project-card hover-lift reveal" style={{ '--reveal-delay': '0.24s' }}>
              <div className="project-preview">
                <div className="preview-bar" aria-hidden="true">
                  <span></span><span></span><span></span>
                  <em>lumiere / index.html</em>
                </div>
                <PreviewFrame src="/WebTemplate/PhotographyPortfolio/index.html" />
                <div className="preview-overlay" onClick={() => handleProjectPreviewClick('/WebTemplate/PhotographyPortfolio/index.html')}>
                  <span className="preview-fallback">Click to Preview →</span>
                </div>
              </div>
              <div className="project-content">
                <span className="project-num" aria-hidden="true">03</span>
                <div className="template-tags">
                  <span className="template-tag tag-html">HTML</span>
                  <span className="template-tag tag-css">CSS</span>
                  <span className="template-tag tag-js">JS</span>
                </div>
                <h3>Lumière</h3>
                <p>{t('Template portofolio fotografi klasik elegan dengan warna hangat dan tipografi serif.', 'A classic elegant photography portfolio template with warm tones and serif typography.')}</p>
                <button className="btn btn-secondary" onClick={() => handleProjectPreviewClick('/WebTemplate/PhotographyPortfolio/index.html')}>
                  <span>{t('Preview →', 'Preview →')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Titik penanda carousel, hanya tampil di HP */}
          <div className="projects-dots">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className={`projects-dot ${activeProject === i ? 'active' : ''}`}
                onClick={() => scrollToProject(i)}
                aria-label={t(`Proyek ${i + 1}`, `Project ${i + 1}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          {sectionHead('contact', t('Mari bekerja sama', 'Let\'s work together'))}
          <div className="contact-layout">
            <div className="contact-info reveal reveal-left">
              <p className="contact-tagline">{t('Siap untuk diskusi atau kolaborasi? Kirim pesan lewat form, atau hubungi saya langsung lewat salah satu kanal berikut.', 'Ready for a discussion or collaboration? Send a message through the form, or reach me directly on any of these channels.')}</p>
              <div className="contact-links">
                {CONTACTS.map((contact) => (
                  <a key={contact.name} href={contact.href} {...externalProps(contact)} className="contact-link">
                    <span className="contact-link-icon">{contact.icon}</span>
                    <span className="contact-link-text">
                      <span className="contact-link-name">{contact.name}</span>
                      {contact.label}
                    </span>
                    <span className="contact-link-arrow" aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </div>
            <form className="contact-form reveal reveal-right" style={{ '--reveal-delay': '0.15s' }} id="contactForm" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <label className="form-field">
                  <span>{t('Nama', 'Name')}</span>
                  <input type="text" name="name" placeholder={t('Nama Anda', 'Your Name')} required />
                </label>
                <label className="form-field">
                  <span>Email</span>
                  <input type="email" name="email" placeholder={t('Email Anda', 'Your Email')} required />
                </label>
              </div>
              <label className="form-field">
                <span>{t('Pesan', 'Message')}</span>
                <textarea name="message" placeholder={t('Pesan Anda', 'Your Message')} rows="5" required></textarea>
              </label>
              <button type="submit" className="btn btn-primary">{t('Kirim Pesan', 'Send Message')} <span aria-hidden="true">→</span></button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Muhammad Haikal Mahardika. <span>{t('Semua hak dilindungi.', 'All rights reserved.')}</span></p>
        </div>
      </footer>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>✕</button>
            <img src={lightboxSrc} alt="Documentation" className="lightbox-img" />
          </div>
        </div>
      )}

      {/* Language Switch Transition */}
      {langWipe && (
        <div
          className={`lang-wipe lang-wipe-${langWipe.phase}`}
          style={{ '--wipe-x': `${langWipe.x}px`, '--wipe-y': `${langWipe.y}px`, '--wipe-r': `${langWipe.r}px` }}
          aria-hidden="true"
        >
          <span className="lang-wipe-label">{langWipe.label}</span>
        </div>
      )}

      {/* Honeypot traps - hidden from users */}
      <div style={{position:'absolute', left:'-9999px', width:'1px', height:'1px', overflow:'hidden'}} aria-hidden="true">
        <a href="/trap1">resources</a>
        <a href="/trap2">assets</a>
        <a href="/trap3">admin</a>
      </div>
    </>
  );
}
