'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState('id');
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeExperienceTab, setActiveExperienceTab] = useState('pkl');
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Language helper function
  const t = (id, en) => currentLanguage === 'en' ? en : id;

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'id';
    const savedLightMode = localStorage.getItem('lightMode') === 'enabled';
    
    setCurrentLanguage(savedLanguage);
    setIsLightMode(savedLightMode);
    
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

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'id' ? 'en' : 'id';
    updateLanguage(newLang);
  };

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('lightMode', 'enabled');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('lightMode', 'disabled');
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });

    return () => observer.disconnect();
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

  const handleProjectPreviewClick = (url) => {
    window.open(url, '_blank');
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

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">Haikal</div>
          
          {/* Desktop menu */}
          <ul className="nav-menu desktop-menu">
            <li><a href="#home">{t('Home', 'Home')}</a></li>
            <li><a href="#about">{t('Tentang', 'About')}</a></li>
            <li><a href="#experience">{t('Pengalaman', 'Experience')}</a></li>
            <li><a href="#projects">{t('Proyek', 'Projects')}</a></li>
            <li><a href="#contact">{t('Kontak', 'Contact')}</a></li>
          </ul>

          <div className="navbar-actions">
            <button className="language-toggle" onClick={toggleLanguage} title="Toggle Language">
              <span className="language-text">{currentLanguage === 'id' ? 'ID' : 'EN'}</span>
            </button>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
              <span className="theme-icon">{isLightMode ? '☀️' : '🌙'}</span>
            </button>
            {/* Hamburger - mobile only */}
            <button className="hamburger" onClick={toggleSidebar} aria-label="Menu">
              <span className={`hamburger-line ${isSidebarOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isSidebarOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isSidebarOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="sidebar-close" onClick={closeSidebar}>✕</button>
        <ul className="sidebar-menu">
          <li><a href="#home" onClick={closeSidebar}>{t('Home', 'Home')}</a></li>
          <li><a href="#about" onClick={closeSidebar}>{t('Tentang', 'About')}</a></li>
          <li><a href="#experience" onClick={closeSidebar}>{t('Pengalaman', 'Experience')}</a></li>
          <li><a href="#projects" onClick={closeSidebar}>{t('Proyek', 'Projects')}</a></li>
          <li><a href="#contact" onClick={closeSidebar}>{t('Kontak', 'Contact')}</a></li>
        </ul>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-image fade-in">
            <img src="/Prop/haikal_no_bg.png" alt="Muhammad Haikal Mahardika" className="profile-photo" />
          </div>
          <h1 className="fade-in">Muhammad Haikal Mahardika</h1>
          <div className="location-badges fade-in delay-1">
            <span className="location-badge">📍 Samarinda, Indonesia</span>
            <span className="remote-badge">🌐 Remote Friendly</span>
          </div>
          <p className="fade-in delay-1">Software Engineer | Problem Solver | Fullstack Developer</p>
          
          <button 
            className="btn btn-primary fade-in delay-2" 
            onClick={() => document.getElementById('projects').scrollIntoView({behavior: 'smooth'})}
          >
            {t('Lihat Proyek', 'View Projects')}
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2>{t('Tentang Saya', 'About Me')}</h2>
          <div className="about-content">
            <div className="about-text slide-in-left">
              <p>{t('Saya adalah lulusan informatika dari Samarinda yang benar-benar passionate tentang pengembangan software. Ada sesuatu yang istimewa tentang mengubah ide menjadi solusi yang berfungsi—itulah yang mendorong saya.', 'I\'m a computer science graduate from Samarinda who\'s genuinely passionate about software development. There\'s something special about turning ideas into working solutions—that\'s what drives me.')}</p>
              <p>{t('Saya suka bekerja dengan Python, JavaScript, HTML, dan CSS—dan paling semangat saat membangun produk web yang benar-benar bisa dipakai orang. Saya selalu eksplor teknologi baru dan terus mendorong diri untuk berkembang.', 'I love working with Python, JavaScript, HTML, and CSS—and I\'m happiest when building real products that people can actually use. I\'m always exploring new tech and pushing myself to improve.')}</p>
            </div>
            <div className="skills slide-in-right">
              <h3>{t('Keahlian Teknis', 'Technical Skills')}</h3>
              <div className="skills-grid-compact">
                <div className="skill-category-compact">
                  <h4>Programming Languages</h4>
                  <div className="skill-list-compact">
                    <span className="skill-badge-compact">Python</span>
                    <span className="skill-badge-compact">JavaScript</span>
                    <span className="skill-badge-compact">HTML</span>
                    <span className="skill-badge-compact">CSS</span>
                  </div>
                </div>
                <div className="skill-category-compact">
                  <h4>Specializations</h4>
                  <div className="skill-list-compact">
                    <span className="skill-badge-compact">Web Development</span>
                    <span className="skill-badge-compact">Fullstack Dev</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="education">
        <div className="container">
          <h2>{t('Pendidikan', 'Education')}</h2>
          <div className="education-content">
            <div className="education-item slide-in-left">
              <div className="education-header">
                <h3>{t('S1 Teknik Informatika', 'Bachelor of Engineering in Computer Science')}</h3>
                <span className="period">Sep 2021 – Oct 2025</span>
              </div>
              <p className="institution">Universitas Muhammadiyah Kalimantan Timur, Samarinda</p>
              <div className="education-details">
                <ul>
                  <li>{t('Merancang dan membangun proyek software lintas bahasa—selalu fokus pada solusi yang nyata dan berfungsi.', 'Designed and built software projects across multiple languages—always focused on real, working solutions.')}</li>
                  <li>{t('Fondasi kuat dalam algoritma dan struktur data—diterapkan dalam proyek nyata, bukan sekadar teori.', 'Strong foundation in algorithms and data structures—applied in actual projects, not just theory.')}</li>
                </ul>
              </div>
              <div className="gpa-badge">GPA: 3.79</div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="experience">
        <div className="container">
          <h2>{t('Pengalaman', 'Experience')}</h2>
          
          {/* Tab System */}
          <div className="tabs">
            <button 
              className={`tab-btn ${activeExperienceTab === 'pkl' ? 'active' : ''}`}
              onClick={() => setActiveExperienceTab('pkl')}
            >
              {t('Praktek Kerja Lapangan', 'Field Practice')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="experience-content">
            {activeExperienceTab === 'pkl' && (
              <div className="education-item">
                <div className="education-header">
                  <div>
                    <h3>Praktek Kerja Lapangan</h3>
                    <p className="institution">{t('Universitas Muhammadiyah Kalimantan Timur', 'Universitas Muhammadiyah Kalimantan Timur')}</p>
                  </div>
                  <span className="education-period">Jul 2023 – Okt 2023</span>
                </div>
                <ul className="experience-list">
                  <li>{t('Membuat dan mengembangkan konsep algoritma yang dipakai untuk Auto Scoring.', 'Created and developed algorithm concepts used for Auto Scoring.')}</li>
                  <li>{t('Berkolaborasi dengan tim dalam pengembangan sistem Auto Scoring.', 'Collaborated with the team in developing the Auto Scoring system.')}</li>
                </ul>
                <div className="experience-doc">
                  <p className="doc-label">{t('Dokumentasi', 'Documentation')}</p>
                  <img
                    src="/public/Prop/pkl-doc.png"
                    alt={t('Dokumentasi PKL - Prototype Auto Scoring', 'PKL Documentation - Auto Scoring Prototype')}
                    className="experience-doc-img"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2>{t('Proyek Saya', 'My Projects')}</h2>
          <div className="projects-grid">
            <div className="project-card hover-lift">
              <div className="project-preview">
                <iframe 
                  src="/WebTemplate/FirstTemplate/index.html" 
                  scrolling="no" 
                  tabIndex="-1"
                  className="preview-iframe"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.background = 'var(--card-bg)';
                  }}
                />
                <div className="preview-overlay" onClick={() => handleProjectPreviewClick('/WebTemplate/FirstTemplate/index.html')}>
                  <span className="preview-fallback">Click to Preview →</span>
                </div>
              </div>
              <div className="project-content">
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
            <div className="project-card hover-lift">
              <div className="project-preview">
                <iframe 
                  src="/WebTemplate/PhotographyPortfolio/index.html" 
                  scrolling="no" 
                  tabIndex="-1"
                  className="preview-iframe"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.background = 'var(--card-bg)';
                  }}
                />
                <div className="preview-overlay" onClick={() => handleProjectPreviewClick('/WebTemplate/PhotographyPortfolio/index.html')}>
                  <span className="preview-fallback">Click to Preview →</span>
                </div>
              </div>
              <div className="project-content">
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
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>{t('Hubungi Saya', 'Contact Me')}</h2>
          <div className="contact-info">
            <p>{t('Email:', 'Email:')} <a href="mailto:mahardikahaikal@gmail.com">mahardikahaikal@gmail.com</a></p>
            <p>{t('Siap untuk diskusi atau kolaborasi? Hubungi saya melalui form di bawah ini!', 'Ready for discussion or collaboration? Contact me through the form below!')}</p>
          </div>
          <form className="contact-form" id="contactForm" onSubmit={handleContactSubmit}>
            <input type="text" name="name" placeholder={t('Nama Anda', 'Your Name')} required />
            <input type="email" name="email" placeholder={t('Email Anda', 'Your Email')} required />
            <textarea name="message" placeholder={t('Pesan Anda', 'Your Message')} rows="5" required></textarea>
            <button type="submit" className="btn btn-primary">{t('Kirim Pesan', 'Send Message')}</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Muhammad Haikal Mahardika. <span>{t('Semua hak dilindungi.', 'All rights reserved.')}</span></p>
        </div>
      </footer>

      {/* Honeypot traps - hidden from users */}
      <div style={{position:'absolute', left:'-9999px', width:'1px', height:'1px', overflow:'hidden'}} aria-hidden="true">
        <a href="/trap1">resources</a>
        <a href="/trap2">assets</a>
        <a href="/trap3">admin</a>
      </div>
    </>
  );
}
