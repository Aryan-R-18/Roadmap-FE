import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  BookOpen, 
  Smartphone, 
  Brain, 
  Shield, 
  Cloud, 
  Palette, 
  Gamepad2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import Footer from '../components/Footer';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const quotes = [
    {
      text: "The best way to predict the future is to invent it.",
      author: "Alan Kay"
    },
    {
      text: "Code is like humor. When you have to explain it, it's bad.",
      author: "Cory House"
    },
    {
      text: "First, solve the problem. Then, write the code.",
      author: "John Johnson"
    }
  ];

  const domains = [
    {
      id: 'web-dev',
      icon: <Code size={40} />,
      title: 'Web Development',
      description: 'Master full-stack web development from HTML to advanced frameworks',
      color: '#4f46e5',
      topics: '8 Topics'
    },
    {
      id: 'app-dev',
      icon: <Smartphone size={40} />,
      title: 'App Development',
      description: 'Build native and cross-platform mobile applications',
      color: '#10b981',
      topics: '8 Topics'
    },
    {
      id: 'ml',
      icon: <Brain size={40} />,
      title: 'Machine Learning',
      description: 'Dive into AI, ML algorithms, and deep learning',
      color: '#f59e0b',
      topics: '8 Topics'
    },
    {
      id: 'cybersecurity',
      icon: <Shield size={40} />,
      title: 'Cybersecurity',
      description: 'Learn ethical hacking and security operations',
      color: '#ef4444',
      topics: '8 Topics'
    },
    {
      id: 'cloud',
      icon: <Cloud size={40} />,
      title: 'Cloud Computing',
      description: 'Master AWS, Azure, DevOps, and cloud architecture',
      color: '#06b6d4',
      topics: '8 Topics'
    },
    {
      id: 'uiux',
      icon: <Palette size={40} />,
      title: 'UI/UX Design',
      description: 'Create beautiful and user-friendly interfaces',
      color: '#ec4899',
      topics: '8 Topics'
    },
    {
      id: 'game-dev',
      icon: <Gamepad2 size={40} />,
      title: 'Game Development',
      description: 'Build 2D/3D games with Unity, Unreal, and more',
      color: '#8b5cf6',
      topics: '15 Topics'
    },
    {
      id: 'academic',
      icon: <BookOpen size={40} />,
      title: 'Academic CS',
      description: 'Core computer science subjects and fundamentals',
      color: '#14b8a6',
      topics: '22+ Subjects'
    }
  ];

  const stats = [
    { icon: <BookOpen size={24} />, value: '32+', label: 'Roadmaps' },
    { icon: <TrendingUp size={24} />, value: '200+', label: 'Topics' },
    { icon: <Users size={24} />, value: '1000+', label: 'Subtopics' },
    { icon: <Award size={24} />, value: '100%', label: 'Free' }
  ];

  const handleDomainClick = () => {
    setShowAuthPrompt(true);
    setTimeout(() => setShowAuthPrompt(false), 3000);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            {/* Badge */}
            <div className="hero-badge">
              <span className="badge-text">Welcome to your learning journey !</span>
              <button className="badge-link" onClick={() => navigate('/register')}>
                Get started
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Main Title */}
            <h1 className="hero-main-title">
              DevGuide
              <span className="title-gradient">+</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-description">
              Your comprehensive guide to mastering Computer Science Engineering.
              Track progress, take notes, and level up your skills across 32+ roadmaps.
            </p>

            {/* Buttons */}
            <div className="hero-buttons">
              <button className="btn-primary-hero" onClick={() => navigate('/register')}>
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button className="btn-secondary-hero" onClick={() => navigate('/login')}>
                <Sparkles size={16} />
                Sign In
              </button>
            </div>

            {/* Mockup/Visual Element */}
            <div className="hero-mockup">
              <div className="mockup-frame">
                <div className="mockup-content">
                  <div className="mockup-header">
                    <div className="mockup-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="mockup-title">DevGuide+ Dashboard</div>
                  </div>
                  <div className="mockup-body">
                    <div className="mockup-sidebar">
                      <div className="sidebar-item active">
                        <BookOpen size={16} />
                        <span>Dashboard</span>
                      </div>
                      <div className="sidebar-item">
                        <Code size={16} />
                        <span>Roadmaps</span>
                      </div>
                      <div className="sidebar-item">
                        <TrendingUp size={16} />
                        <span>Progress</span>
                      </div>
                    </div>
                    <div className="mockup-main">
                      <div className="progress-card">
                        <div className="progress-header">Overall Progress</div>
                        <div className="progress-bar">
                          <div className="progress-fill"></div>
                        </div>
                        <div className="progress-text">67% Complete</div>
                      </div>
                      <div className="roadmap-cards">
                        <div className="roadmap-card-mini">
                          <div className="card-icon" style={{ backgroundColor: '#3b82f6' }}>
                            <Code size={14} />
                          </div>
                          <div className="card-title">Web Development</div>
                        </div>
                        <div className="roadmap-card-mini">
                          <div className="card-icon" style={{ backgroundColor: '#10b981' }}>
                            <Brain size={14} />
                          </div>
                          <div className="card-title">Machine Learning</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quotes Section */}
      <section className="quotes-section">
        <div className="quotes-container">
          <h2 className="section-title">Words of Wisdom</h2>
          <div className="quotes-grid">
            {quotes.map((quote, index) => (
              <div key={index} className="quote-card">
                <div className="quote-mark">"</div>
                <p className="quote-text">{quote.text}</p>
                <p className="quote-author">— {quote.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="domains-section">
        <div className="domains-container">
          <h2 className="section-title">Explore Domains</h2>
          <p className="section-subtitle">
            Choose from a wide range of learning paths tailored for your career goals
          </p>
          
          {showAuthPrompt && (
            <div className="auth-prompt">
              <p>Please sign in to access roadmaps</p>
              <button onClick={() => navigate('/login')}>Sign In Now</button>
            </div>
          )}

          <div className="domains-grid">
            {domains.map((domain, index) => (
              <div 
                key={index} 
                className="domain-card"
                onClick={handleDomainClick}
                style={{ '--domain-color': domain.color }}
              >
                <div className="domain-icon" style={{ color: domain.color }}>
                  {domain.icon}
                </div>
                <h3 className="domain-title">{domain.title}</h3>
                <p className="domain-description">{domain.description}</p>
                <div className="domain-footer">
                  <span className="domain-topics">{domain.topics}</span>
                  <ArrowRight size={18} className="domain-arrow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">
            Join thousands of learners mastering Computer Science Engineering
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate('/register')}>
              Create Free Account
              <ArrowRight size={20} />
            </button>
            <button className="btn-cta-secondary" onClick={() => navigate('/login')}>
              I Already Have an Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
