import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, BookOpen, Code, TrendingUp, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">DevGuide+</h3>
            <p className="footer-description">
              Your comprehensive guide to mastering Computer Science Engineering. 
              Track your progress through academic and practical learning paths.
            </p>
            <div className="footer-social">
              <a 
                href="https://github.com/Aryan-R-18" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/aryan-rajguru-a1333230a/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@arnr.dev" 
                className="social-link"
                title="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigate('/dashboard')} className="footer-link">
                  <TrendingUp size={16} />
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/roadmaps/academic')} className="footer-link">
                  <BookOpen size={16} />
                  Academic Roadmaps
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/roadmaps/non-academic')} className="footer-link">
                  <Code size={16} />
                  Non-Academic Roadmaps
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="https://www.iitkirba.xyz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Notes and PYQs
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/ArnR/cs-roadmap-hub/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Report Issues
                </a>
              </li>
              <li>
                <a 
                  href="https://www.hackmnc.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Practice
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading">Get in Touch</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="https://github.com/Aryan-R-18" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <Github size={16} />
                  GitHub Profile
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/aryan-rajguru-a1333230a/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <Linkedin size={16} />
                  LinkedIn Profile
                </a>
              </li>
              <li>
                <a 
                  href="mailto:arnvk71@gmail.com" 
                  className="footer-link"
                >
                  <Mail size={16} />
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {new Date().getFullYear()} DevGuide+. All rights reserved.
            </p>
            <p className="footer-author">
              Made with <Heart size={14} className="heart-icon" /> by{' '}
              <a 
                href="https://github.com/ArnR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="author-link"
              >
                ArnR
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
