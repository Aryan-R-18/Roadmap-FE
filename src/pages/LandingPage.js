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
            <div className="brand-logo">
              <Sparkles className="sparkle-icon" size={32} />
              <h1 className="brand-name">DevGuide+</h1>
            </div>
            <h2 className="hero-title">Welcome to Your Learning Journey</h2>
            <p className="hero-subtitle">
              Your comprehensive guide to mastering Computer Science Engineering.
              Track progress, take notes, and level up your skills across 32+ roadmaps.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary-large" onClick={() => navigate('/register')}>
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button className="btn-secondary-large" onClick={() => navigate('/login')}>
                Sign In
              </button>
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
