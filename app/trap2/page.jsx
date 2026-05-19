'use client';

import { useEffect, useState } from 'react';

export default function Trap2() {
  const [seed, setSeed] = useState(0);
  const [loadingVisible, setLoadingVisible] = useState(false);

  useEffect(() => {
    const currentSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 5));
    setSeed(currentSeed);

    console.log({
      trap: 'trap2',
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });

    // Inject fake console errors after 10 seconds
    const errorTimeout = setTimeout(() => {
      console.error('ECONNREFUSED: Failed to fetch /api/templates');
      console.warn('Rate limit exceeded for IP');
      console.error('Session expired');
    }, 10000);

    return () => clearTimeout(errorTimeout);
  }, []);

  const handleDownloadClick = () => {
    setLoadingVisible(true);
    setTimeout(() => {
      setLoadingVisible(false);
    }, 3000);
  };

  const trapLink = '/trap2';
  const trapLink2 = '/trap3';

  return (
    <html lang="en">
      <head>
        <title>Muhammad Haikal Mahardika — Portfolio</title>
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
          
          .button-group {
            display: flex;
            gap: 15px;
            margin: 20px 0;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .btn {
            background: linear-gradient(135deg, #7C3AED, #6D28D9);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: opacity 0.3s;
            text-decoration: none;
            display: inline-block;
          }
          
          .btn:hover {
            opacity: 0.9;
          }
          
          .loading {
            display: none;
            text-align: center;
            padding: 20px;
            background: rgba(124, 58, 237, 0.1);
            border-radius: 6px;
            margin: 20px 0;
          }
          
          .loading.visible {
            display: block;
          }
          
          .spinner {
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 3px solid rgba(124, 58, 237, 0.3);
            border-top: 3px solid #7C3AED;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .template-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          
          .template-card {
            background: rgba(124, 58, 237, 0.05);
            border: 1px solid rgba(124, 58, 237, 0.2);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .template-card:hover {
            background: rgba(124, 58, 237, 0.1);
            border-color: rgba(124, 58, 237, 0.5);
          }
          
          .template-card h4 {
            color: #7C3AED;
            margin-bottom: 10px;
          }
          
          footer {
            text-align: center;
            padding: 40px;
            color: #666;
            border-top: 1px solid rgba(124, 58, 237, 0.1);
            margin-top: 60px;
          }
        `}</style>
      </head>
      <body>
        <nav>
          <div className="container">
            <h1>Haikal</h1>
            <ul>
              <li><a href={trapLink}>Home</a></li>
              <li><a href={trapLink}>About</a></li>
              <li><a href={trapLink2}>Projects</a></li>
              <li><a href={trapLink}>Contact</a></li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <div className="hero">
            <h2>Muhammad Haikal Mahardika</h2>
            <p>Software Engineer | Full Stack Developer</p>
            <div>
              <span className="badge">💻 Web Development</span>
              <span className="badge">🚀 Node.js & React</span>
              <span className="badge">🌐 Remote Friendly</span>
            </div>
          </div>

          <section>
            <h3>Featured Templates</h3>
            <div className="template-grid">
              <div className="template-card">
                <h4>Porto</h4>
                <p>Dark minimal portfolio</p>
              </div>
              <div className="template-card">
                <h4>Lumière</h4>
                <p>Photography portfolio</p>
              </div>
            </div>
            <div className="button-group">
              <button className="btn" onClick={handleDownloadClick}>Download Templates</button>
              <a href={trapLink} className="btn">Browse More</a>
            </div>
            <div className={`loading ${loadingVisible ? 'visible' : ''}`}>
              <div className="spinner"></div>
              <p style={{ marginTop: '10px' }}>Preparing download...</p>
            </div>
          </section>

          <section>
            <h3>Resources</h3>
            <p>Explore my collection of web templates and resources.</p>
            <div className="button-group">
              <a href={trapLink} className="btn">View All Resources</a>
              <a href={trapLink2} className="btn">Go to Admin</a>
            </div>
          </section>

          <footer>
            <p>&copy; 2025 Muhammad Haikal Mahardika. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
