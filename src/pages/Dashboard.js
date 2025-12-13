import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, Code, TrendingUp, Search, User } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { API_URL } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState({ academic: [], nonAcademic: [] });
  const [progress, setProgress] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roadmapsRes, progressRes] = await Promise.all([
        axios.get(`${API_URL}/roadmaps`),
        axios.get(`${API_URL}/progress`)
      ]);
      setRoadmaps(roadmapsRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (roadmapId) => {
    const roadmapProgress = progress.find(p => p.roadmapId === roadmapId);
    if (!roadmapProgress) return 0;

    const roadmap = [...roadmaps.academic, ...roadmaps.nonAcademic].find(r => r.id === roadmapId);
    if (!roadmap) return 0;

    const totalTopics = roadmap.topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
    const completedCount = roadmapProgress.completedTopics.length;
    
    return totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  };

  const getOverallProgress = () => {
    const allRoadmaps = [...roadmaps.academic, ...roadmaps.nonAcademic];
    if (allRoadmaps.length === 0) return 0;
    
    const totalProgress = allRoadmaps.reduce((sum, roadmap) => sum + calculateProgress(roadmap.id), 0);
    return Math.round(totalProgress / allRoadmaps.length);
  };

  const filterRoadmaps = (roadmapList) => {
    if (!searchTerm) return roadmapList;
    return roadmapList.filter(roadmap => 
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header fade-in">
          <div className="header-content">
            <div className="header-text">
              <h1>Your Learning Dashboard</h1>
              <p>Track your progress and continue your journey</p>
            </div>
            
          </div>
          
          <div className="stats-card">
            <TrendingUp size={32} />
            <div>
              <h2>{getOverallProgress()}%</h2>
              <p>Overall Progress</p>
            </div>
          </div>
        </div>

        <div className="search-bar fade-in">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search roadmaps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="roadmap-categories">
          <div className="category-section fade-in">
            <div className="category-header">
              <BookOpen size={28} />
              <h2>Academic Roadmaps</h2>
            </div>
            <p className="category-description">
              Master core computer science subjects from your curriculum
            </p>
            <div className="roadmap-grid">
              {filterRoadmaps(roadmaps.academic).map(roadmap => (
                <div
                  key={roadmap.id}
                  className="roadmap-card"
                  onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                  title=""
                >
                  <h3>{roadmap.title}</h3>
                  <p>{roadmap.description}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${calculateProgress(roadmap.id)}%` }}
                    />
                  </div>
                  <span className="progress-text">{calculateProgress(roadmap.id)}% Complete</span>
                </div>
              ))}
            </div>
            {filterRoadmaps(roadmaps.academic).length === 0 && (
              <p className="no-results">No roadmaps found</p>
            )}
          </div>

          <div className="category-section fade-in">
            <div className="category-header">
              <Code size={28} />
              <h2>Non-Academic Roadmaps</h2>
            </div>
            <p className="category-description">
              Build practical skills for real-world development
            </p>
            <div className="roadmap-grid">
              {filterRoadmaps(roadmaps.nonAcademic).map(roadmap => (
                <div
                  key={roadmap.id}
                  className="roadmap-card"
                  onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                  title=""
                >
                  <h3>{roadmap.title}</h3>
                  <p>{roadmap.description}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${calculateProgress(roadmap.id)}%` }}
                    />
                  </div>
                  <span className="progress-text">{calculateProgress(roadmap.id)}% Complete</span>
                </div>
              ))}
            </div>
            {filterRoadmaps(roadmaps.nonAcademic).length === 0 && (
              <p className="no-results">No roadmaps found</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
