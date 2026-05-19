'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Trap3() {
  const [seed, setSeed] = useState(0);
  const [countdown, setCountdown] = useState(47);
  const [fingerprint, setFingerprint] = useState(null);
  const [caseId, setCaseId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 11));
    setSeed(currentSeed);
    setCaseId(`CASE-${currentSeed}-${Math.floor(Math.random() * 9000 + 1000)}`);

    const fingerprintData = {
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width} x ${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      connectionType: navigator.connection?.effectiveType || 'unknown',
      timestamp: Date.now(),
    };

    setFingerprint(fingerprintData);

    console.log(fingerprintData);

    // Send to httpbin
    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: JSON.stringify(fingerprintData),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/trap2');
          return 47;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  const formatCountdown = () => {
    const mins = Math.floor(countdown / 60);
    const secs = countdown % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <html lang="en">
      <head>
        <title>Security Alert - Access Denied</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            width: 100%;
          }
          
          .warning-banner {
            background: #8B0000;
            border: 2px solid #ff0000;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          .report-card {
            background: #0a0a0a;
            border: 2px solid #0f0;
            padding: 30px;
            margin-bottom: 30px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
          }
          
          .report-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            border-bottom: 1px solid #0f0;
            padding-bottom: 10px;
          }
          
          .report-item {
            display: flex;
            margin-bottom: 12px;
            word-break: break-all;
          }
          
          .report-label {
            color: #0f0;
            font-weight: bold;
            min-width: 120px;
            margin-right: 10px;
          }
          
          .report-value {
            color: #00ff00;
            opacity: 0.8;
          }
          
          .countdown-section {
            text-align: center;
            margin: 30px 0;
          }
          
          .countdown {
            font-size: 48px;
            color: #ff0000;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
            letter-spacing: 5px;
          }
          
          .countdown-label {
            font-size: 14px;
            color: #0f0;
            margin-bottom: 10px;
          }
          
          .message-section {
            background: #0a0a0a;
            border: 1px solid #0f0;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
          }
          
          .message-section p {
            margin: 10px 0;
            color: #0f0;
          }
          
          .footer-text {
            text-align: center;
            font-size: 11px;
            color: #666;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #333;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="warning-banner">
            ⚠️ UNAUTHORIZED ACCESS DETECTED
          </div>

          <div className="report-card">
            <div className="report-title">SECURITY INCIDENT REPORT</div>
            {fingerprint && (
              <>
                <div className="report-item">
                  <span className="report-label">User Agent:</span>
                  <span className="report-value">{fingerprint.userAgent}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">Screen:</span>
                  <span className="report-value">{fingerprint.screenResolution}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">Timezone:</span>
                  <span className="report-value">{fingerprint.timezone}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">Language:</span>
                  <span className="report-value">{fingerprint.language}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">Platform:</span>
                  <span className="report-value">{fingerprint.platform}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">Connection:</span>
                  <span className="report-value">{fingerprint.connectionType}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">Case ID:</span>
                  <span className="report-value">{caseId}</span>
                </div>
              </>
            )}
          </div>

          <div className="countdown-section">
            <div className="countdown-label">Submitting report to server in:</div>
            <div className="countdown">{formatCountdown()}</div>
          </div>

          <div className="message-section">
            <p>This incident has been logged.</p>
            <p>If you believe this is a mistake, contact: security@haikalmahardika.dev</p>
          </div>

          <div className="footer-text">
            Protected by Vercel Edge Network & CloudFlare Enterprise
          </div>
        </div>
      </body>
    </html>
  );
}
