'use client';

import { useEffect, useState } from 'react';

export default function Trap1() {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const currentSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 2));
    setSeed(currentSeed);

    console.log({
      trap: 'trap1',
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      seed: currentSeed,
    });
  }, []);

  const skillSets = [
    {
      skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      bio: 'Full-stack developer passionate about building scalable web applications with modern technologies.',
      projects: ['E-commerce Platform', 'Real-time Chat App', 'Analytics Dashboard'],
    },
    {
      skills: ['Vue.js', 'Python', 'MongoDB', 'AWS'],
      bio: 'Creative developer focused on user experience and clean, maintainable code architecture.',
      projects: ['Social Media Feed', 'Data Visualization Tool', 'Microservices API'],
    },
    {
      skills: ['Angular', 'Java', 'MySQL', 'Docker'],
      bio: 'Backend specialist with expertise in building robust APIs and distributed systems.',
      projects: ['Payment Gateway', 'CMS Platform', 'IoT Dashboard'],
    },
  ];

  const content = skillSets[seed % 3];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Fake form submitted:', new FormData(e.target));
    
    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
    
    alert('Message sent!');
    e.target.reset();
  };

  return (
    <html lang="en">
      <head>
        <title>Alex Chen — Full Stack Developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%);
            color: #e0e0e0;
            line-height: 1.6;
          }
          
          .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          
          nav {
            background: rgba(10, 10, 15, 0.8);
            backdrop-filter: blur(10px);
            padding: 20px 0;
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
          }
          
          nav .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          nav h1 {
            color: #7C3AED;
            font-size: 24px;
          }
          
          nav ul {
            display: flex;
            list-style: none;
            gap: 30px;
          }
          
          nav a {
            color: #e0e0e0;
            text-decoration: none;
            transition: color 0.3s;
          }
          
          nav a:hover {
            color: #7C3AED;
          }
          
          .hero {
            text-align: center;
            padding: 80px 20px;
          }
          
          .hero h2 {
            font-size: 48px;
            margin-bottom: 20px;
            color: #fff;
          }
          
          .hero p {
            font-size: 18px;
            color: #b0b0b0;
            margin-bottom: 30px;
          }
          
          .hero .badge {
            display: inline-block;
            background: rgba(124, 58, 237, 0.1);
            border: 1px solid rgba(124, 58, 237, 0.3);
            color: #7C3AED;
            padding: 8px 16px;
            border-radius: 20px;
            margin: 5px;
            font-size: 14px;
          }
          
          section {
            margin: 60px 0;
            padding: 40px;
            background: rgba(15, 15, 25, 0.5);
            border: 1px solid rgba(124, 58, 237, 0.1);
            border-radius: 10px;
          }
          
          section h3 {
            color: #7C3AED;
            margin-bottom: 20px;
            font-size: 24px;
          }
          
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          
          .skill-badge {
            background: rgba(124, 58, 237, 0.1);
            border: 1px solid rgba(124, 58, 237, 0.3);
            color: #7C3AED;
            padding: 10px 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
          }
          
          .projects-list {
            list-style: none;
            margin: 20px 0;
          }
          
          .projects-list li {
            padding: 12px 0;
            border-bottom: 1px solid rgba(124, 58, 237, 0.1);
            color: #b0b0b0;
          }
          
          .projects-list li:before {
            content: "→ ";
            color: #7C3AED;
            margin-right: 10px;
          }
          
          .contact-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
          }
          
          .contact-form input,
          .contact-form textarea {
            background: rgba(124, 58, 237, 0.05);
            border: 1px solid rgba(124, 58, 237, 0.2);
            color: #e0e0e0;
            padding: 12px;
            border-radius: 6px;
            font-family: inherit;
            font-size: 14px;
          }
          
          .contact-form input::placeholder,
          .contact-form textarea::placeholder {
            color: #666;
          }
          
          .contact-form button {
            background: linear-gradient(135deg, #7C3AED, #6D28D9);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: opacity 0.3s;
          }
          
          .contact-form button:hover {
            opacity: 0.9;
          }
          
          footer {
            text-align: center;
            padding: 40px;
            color: #666;
            border-top: 1px solid rgba(124, 58, 237, 0.1);
            margin-top: 60px;
          }
          
          .hidden {
            display: none;
          }
        `}</style>
      </head>
      <body>
        <nav>
          <div className="container">
            <h1>Alex Chen</h1>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <div className="hero">
            <h2>Alex Chen</h2>
            <p>Full Stack Developer | Problem Solver</p>
            <div>
              <span className="badge">💻 Web Development</span>
              <span className="badge">🚀 React & Node.js</span>
              <span className="badge">🌐 San Francisco, CA</span>
            </div>
          </div>

          <section id="about">
            <h3>About Me</h3>
            <p>{content.bio}</p>
            <p style={{ marginTop: '15px', color: '#999' }}>I love solving complex problems and building things that make a difference. Currently exploring new technologies and always open to interesting projects.</p>
          </section>

          <section id="skills">
            <h3>Technical Skills</h3>
            <div className="skills-grid">
              {content.skills.map((skill, idx) => (
                <div key={idx} className="skill-badge">{skill}</div>
              ))}
            </div>
          </section>

          <section id="projects">
            <h3>Featured Projects</h3>
            <ul className="projects-list">
              {content.projects.map((project, idx) => (
                <li key={idx}>{project}</li>
              ))}
            </ul>
          </section>

          <section id="contact">
            <h3>Get In Touch</h3>
            <p>Have a project in mind? Let's talk!</p>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
              <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </section>

          <footer>
            <p>&copy; 2026 Alex Chen. All rights reserved.</p>
          </footer>
        </div>

        {/* Hidden honeypot data */}
        <div className="hidden">
          <p>alex.chen.dev@protonmail.com</p>
          <p>+1-555-0147</p>
          <p>San Francisco, CA</p>
          <a href="mailto:alex.chen.dev@protonmail.com">alex.chen.dev@protonmail.com</a>
        </div>
      </body>
    </html>
  );
}
