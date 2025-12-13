import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Save, 
  RotateCcw,
  CheckCheck,
  BookOpen
} from 'lucide-react';
import './RoadmapDetail.css';

const RoadmapDetail = () => {
  const { id } = useParams();
  const { API_URL } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({ completedTopics: [], notes: {} });
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [roadmapRes, progressRes] = await Promise.all([
        axios.get(`${API_URL}/roadmaps/${id}`),
        axios.get(`${API_URL}/progress/${id}`)
      ]);
      setRoadmap(roadmapRes.data);
      setProgress(progressRes.data);
      
      const notesObj = {};
      if (progressRes.data.notes) {
        Object.entries(progressRes.data.notes).forEach(([key, value]) => {
          notesObj[key] = value;
        });
      }
      setNotes(notesObj);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = async (topicId) => {
    try {
      const response = await axios.post(`${API_URL}/progress/${id}/toggle`, { topicId });
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to toggle topic:', error);
    }
  };

  const saveNote = async (topicId, note) => {
    setSaving(true);
    try {
      const response = await axios.post(`${API_URL}/progress/${id}/note`, { 
        topicId, 
        note 
      });
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNoteChange = (topicId, value) => {
    setNotes(prev => ({ ...prev, [topicId]: value }));
  };

  const handleNoteSave = (topicId) => {
    saveNote(topicId, notes[topicId] || '');
  };

  const markAllComplete = async () => {
    if (!window.confirm('Mark all topics as completed?')) return;
    
    try {
      const allTopicIds = roadmap.topics.flatMap(topic => 
        topic.subtopics.map((_, idx) => `${topic.id}-sub-${idx}`)
      );
      const response = await axios.post(`${API_URL}/progress/${id}/complete-all`, { 
        allTopicIds 
      });
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to mark all complete:', error);
    }
  };

  const resetProgress = async () => {
    if (!window.confirm('Reset all progress? This cannot be undone.')) return;
    
    try {
      await axios.delete(`${API_URL}/progress/${id}`);
      setProgress({ completedTopics: [], notes: {} });
      setNotes({});
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  };

  const calculateProgress = () => {
    if (!roadmap) return 0;
    const totalTopics = roadmap.topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
    const completedCount = progress.completedTopics.length;
    return totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return 'var(--text-secondary)';
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

  if (!roadmap) {
    return (
      <>
        <Navbar />
        <div className="loading-container">Roadmap not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="roadmap-detail-container">
        <div className="roadmap-detail-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="header-content fade-in">
            <h1>{roadmap.title}</h1>
            <p>{roadmap.description}</p>
            
            <div className="progress-section">
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large" 
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <span className="progress-percentage">{calculateProgress()}% Complete</span>
            </div>

            <div className="action-buttons">
              {roadmap.category === 'non-academic' && roadmap.resources && (
                <button className="btn-resources" onClick={() => navigate(`/resources/${id}`)}>
                  <BookOpen size={18} />
                  View Resources
                </button>
              )}
              <button className="btn-secondary" onClick={markAllComplete}>
                <CheckCheck size={18} />
                Mark All Complete
              </button>
              <button className="btn-danger" onClick={resetProgress}>
                <RotateCcw size={18} />
                Reset Progress
              </button>
            </div>
          </div>

          <div className="roadmap-meta fade-in">
            {roadmap.prerequisites && (
              <div className="meta-section">
                <h3>Prerequisites</h3>
                <ul>
                  {roadmap.prerequisites.map((prereq, idx) => (
                    <li key={idx}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {roadmap.tools && (
              <div className="meta-section">
                <h3>Tools & Technologies</h3>
                <div className="tags">
                  {roadmap.tools.map((tool, idx) => (
                    <span key={idx} className="tag">{tool}</span>
                  ))}
                </div>
              </div>
            )}
            
            {roadmap.books && (
              <div className="meta-section">
                <h3>Recommended Books</h3>
                <ul>
                  {roadmap.books.map((book, idx) => (
                    <li key={idx}>{book}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="topics-container">
          {roadmap.topics.map((topic, topicIdx) => (
            <div key={topic.id} className="topic-section fade-in" style={{ animationDelay: `${topicIdx * 0.1}s` }}>
              <div className="topic-header">
                <h2>{topic.title}</h2>
                <span 
                  className="level-badge" 
                  style={{ backgroundColor: getLevelColor(topic.level) }}
                >
                  {topic.level}
                </span>
              </div>

              <div className="subtopics-list">
                {topic.subtopics.map((subtopic, subIdx) => {
                  const subtopicId = `${topic.id}-sub-${subIdx}`;
                  const isCompleted = progress.completedTopics.includes(subtopicId);
                  
                  return (
                    <div key={subtopicId} className="subtopic-item">
                      <div className="subtopic-header">
                        <button
                          className={`checkbox-btn ${isCompleted ? 'checked' : ''}`}
                          onClick={() => toggleTopic(subtopicId)}
                        >
                          {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>
                        <span className={isCompleted ? 'completed-text' : ''}>{subtopic}</span>
                      </div>
                      
                      <div className="note-section">
                        <textarea
                          placeholder="Add your notes here..."
                          value={notes[subtopicId] || ''}
                          onChange={(e) => handleNoteChange(subtopicId, e.target.value)}
                          rows={2}
                        />
                        <button 
                          className="save-note-btn"
                          onClick={() => handleNoteSave(subtopicId)}
                          disabled={saving}
                        >
                          <Save size={16} />
                          {saving ? 'Saving...' : 'Save Note'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoadmapDetail;
