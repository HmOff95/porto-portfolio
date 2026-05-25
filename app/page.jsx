'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState('id');
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

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
    
    document.querySelectorAll('[data-en][data-id]').forEach(element => {
      const text = lang === 'id' ? element.getAttribute('data-id') : element.getAttribute('data-en');
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = text;
      } else if (element.tagName !== 'BUTTON') {
        element.textContent = text;
      }
    });
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const message = currentLanguage === 'en' 
      ? 'Thank you! Your message has been sent.' 
      : 'Terima kasih! Pesan Anda telah dikirim.';
    alert(message);
    e.target.reset();
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">Haikal</div>
          
          {/* Desktop menu */}
          <ul className="nav-menu desktop-menu">
            <li><a href="#home" data-en="Home" data-id="Home">Home</a></li>
            <li><a href="#about" data-en="About" data-id="Tentang">Tentang</a></li>
            <li><a href="#projects" data-en="Projects" data-id="Proyek">Proyek</a></li>
            <li><a href="#contact" data-en="Contact" data-id="Kontak">Kontak</a></li>
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
          <li><a href="#home" onClick={closeSidebar} data-en="Home" data-id="Home">Home</a></li>
          <li><a href="#about" onClick={closeSidebar} data-en="About" data-id="Tentang">Tentang</a></li>
          <li><a href="#projects" onClick={closeSidebar} data-id="Proyek" data-en="Projects">Proyek</a></li>
          <li><a href="#contact" onClick={closeSidebar} data-en="Contact" data-id="Kontak">Kontak</a></li>
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
          <p className="fade-in delay-1" data-en="Software Engineer | Problem Solver | Fullstack Developer" data-id="Software Engineer | Problem Solver | Fullstack Developer">Software Engineer | Problem Solver | Fullstack Developer</p>
          
          <button 
            className="btn btn-primary fade-in delay-2" 
            onClick={() => document.getElementById('projects').scrollIntoView({behavior: 'smooth'})}
            data-en="View Projects" 
            data-id="Lihat Proyek"
          >
            Lihat Proyek
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 data-en="About Me" data-id="Tentang Saya">Tentang Saya</h2>
          <div className="about-content">
            <div className="about-text slide-in-left">
              <p data-en="I'm a computer science graduate from Samarinda who's genuinely passionate about software development. There's something special about turning ideas into working solutions—that's what drives me." data-id="Saya adalah lulusan informatika dari Samarinda yang benar-benar passionate tentang pengembangan software. Ada sesuatu yang istimewa tentang mengubah ide menjadi solusi yang berfungsi—itulah yang mendorong saya.">Saya adalah lulusan informatika dari Samarinda yang benar-benar passionate tentang pengembangan software. Ada sesuatu yang istimewa tentang mengubah ide menjadi solusi yang berfungsi—itulah yang mendorong saya.</p>
              <p data-en="I love working with Python, JavaScript, HTML, and CSS—and I'm happiest when building real products that people can actually use. I'm always exploring new tech and pushing myself to improve." data-id="Saya suka bekerja dengan Python, JavaScript, HTML, dan CSS—dan paling semangat saat membangun produk web yang benar-benar bisa dipakai orang. Saya selalu eksplor teknologi baru dan terus mendorong diri untuk berkembang.">Saya suka bekerja dengan Python, JavaScript, HTML, dan CSS—dan paling semangat saat membangun produk web yang benar-benar bisa dipakai orang. Saya selalu eksplor teknologi baru dan terus mendorong diri untuk berkembang.</p>
            </div>
            <div className="skills slide-in-right">
              <h3 data-en="Technical Skills" data-id="Keahlian Teknis">Keahlian Teknis</h3>
              <div className="skills-grid-compact">
                <div className="skill-category-compact">
                  <h4 data-en="Programming Languages" data-id="Programming Languages">Programming Languages</h4>
                  <div className="skill-list-compact">
                    <span className="skill-badge-compact">Python</span>
                    <span className="skill-badge-compact">JavaScript</span>
                    <span className="skill-badge-compact">HTML</span>
                    <span className="skill-badge-compact">CSS</span>
                  </div>
                </div>
                <div className="skill-category-compact">
                  <h4 data-en="Specializations" data-id="Specializations">Specializations</h4>
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
          <h2 data-en="Education" data-id="Pendidikan">Pendidikan</h2>
          <div className="education-content">
            <div className="education-item slide-in-left">
              <div className="education-header">
                <h3 data-en="Bachelor of Engineering in Computer Science" data-id="S1 Teknik Informatika">S1 Teknik Informatika</h3>
                <span className="period">Sep 2021 – Oct 2025</span>
              </div>
              <p className="institution" data-en="Universitas Muhammadiyah Kalimantan Timur, Samarinda" data-id="Universitas Muhammadiyah Kalimantan Timur, Samarinda">Universitas Muhammadiyah Kalimantan Timur, Samarinda</p>
              <div className="education-details">
                <ul>
                  <li data-en="Designed and built software projects across multiple languages—always focused on real, working solutions." data-id="Merancang dan membangun proyek software lintas bahasa—selalu fokus pada solusi yang nyata dan berfungsi.">Merancang dan membangun proyek software lintas bahasa—selalu fokus pada solusi yang nyata dan berfungsi.</li>
                  <li data-en="Strong foundation in algorithms and data structures—applied in actual projects, not just theory." data-id="Fondasi kuat dalam algoritma dan struktur data—diterapkan dalam proyek nyata, bukan sekadar teori.">Fondasi kuat dalam algoritma dan struktur data—diterapkan dalam proyek nyata, bukan sekadar teori.</li>
                </ul>
              </div>
              <div className="gpa-badge">GPA: 3.79</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2 data-en="My Projects" data-id="Proyek Saya">Proyek Saya</h2>
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
                <h3>Porto</h3>
                <p data-en="A dark minimal portfolio template with violet accents and smooth animations." data-id="Template portofolio gelap minimalis dengan aksen violet dan animasi halus.">Template portofolio gelap minimalis dengan aksen violet dan animasi halus.</p>
                <button className="btn btn-secondary" onClick={() => handleProjectPreviewClick('/WebTemplate/FirstTemplate/index.html')}>
                  <span data-en="Preview →" data-id="Preview →">Preview →</span>
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
                <h3>Lumière</h3>
                <p data-en="A classic elegant photography portfolio template with warm tones and serif typography." data-id="Template portofolio fotografi klasik elegan dengan warna hangat dan tipografi serif.">Template portofolio fotografi klasik elegan dengan warna hangat dan tipografi serif.</p>
                <button className="btn btn-secondary" onClick={() => handleProjectPreviewClick('/WebTemplate/PhotographyPortfolio/index.html')}>
                  <span data-en="Preview →" data-id="Preview →">Preview →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 data-en="Contact Me" data-id="Hubungi Saya">Hubungi Saya</h2>
          <div className="contact-info">
            <p data-en="Email:" data-id="Email:">Email: <a href="mailto:mahardikahaikal@gmail.com">mahardikahaikal@gmail.com</a></p>
            <p data-en="Ready for discussion or collaboration? Contact me through the form below!" data-id="Siap untuk diskusi atau kolaborasi? Hubungi saya melalui form di bawah ini!">Siap untuk diskusi atau kolaborasi? Hubungi saya melalui form di bawah ini!</p>
          </div>
          <form className="contact-form" id="contactForm" onSubmit={handleContactSubmit}>
            <input type="text" placeholder="Nama Anda" data-en="Your Name" data-id="Nama Anda" required />
            <input type="email" placeholder="Email Anda" data-en="Your Email" data-id="Email Anda" required />
            <textarea placeholder="Pesan Anda" data-en="Your Message" data-id="Pesan Anda" rows="5" required></textarea>
            <button type="submit" className="btn btn-primary" data-en="Send Message" data-id="Kirim Pesan">Kirim Pesan</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Muhammad Haikal Mahardika. <span data-en="All rights reserved." data-id="Semua hak dilindungi.">Semua hak dilindungi.</span></p>
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
