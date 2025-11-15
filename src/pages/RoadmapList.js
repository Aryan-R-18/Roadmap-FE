import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import './RoadmapList.css';

const RoadmapList = () => {
  const { category } = useParams();
  const { API_URL } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmaps();
  }, [category]);

  const fetchRoadmaps = async () => {
    try {
      const response = await axios.get(`${API_URL}/roadmaps`);
      const categoryRoadmaps = category === 'academic' 
        ? response.data.academic 
        : response.data.nonAcademic;
      setRoadmaps(categoryRoadmaps);
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="roadmap-list-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="roadmap-list-header fade-in">
          <h1>{category === 'academic' ? 'Academic' : 'Non-Academic'} Roadmaps</h1>
          <p>Choose a roadmap to start your learning journey</p>
        </div>

        <div className="roadmap-list-grid">
          {roadmaps.map(roadmap => (
            <div
              key={roadmap.id}
              className="roadmap-list-card fade-in"
              onClick={() => navigate(`/roadmap/${roadmap.id}`)}
            >
              <h2>{roadmap.title}</h2>
              <p>{roadmap.description}</p>
              
              {roadmap.prerequisites && (
                <div className="card-section">
                  <strong>Prerequisites:</strong>
                  <ul>
                    {roadmap.prerequisites.map((prereq, idx) => (
                      <li key={idx}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {roadmap.tools && (
                <div className="card-section">
                  <strong>Tools:</strong>
                  <div className="tags">
                    {roadmap.tools.slice(0, 5).map((tool, idx) => (
                      <span key={idx} className="tag">{tool}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoadmapList;
