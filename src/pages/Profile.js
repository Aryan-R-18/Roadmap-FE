import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  User, 
  Mail, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Settings, 
  Moon, 
  Sun,
  Edit3,
  Save,
  X,
  Target,
  Clock,
  Trophy,
  Activity
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, API_URL } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [roadmaps, setRoadmaps] = useState({ academic: [], nonAcademic: [] });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalRoadmaps: 0,
    completedRoadmaps: 0,
    totalTopics: 0,
    completedTopics: 0,
    averageProgress: 0,
    learningStreak: 0,
    joinedDate: null
  });

  useEffect(() => {
    fetchData();
    if (user) {
      setEditedName(user.name);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [roadmapsRes, progressRes] = await Promise.all([
        axios.get(`${API_URL}/roadmaps`),
        axios.get(`${API_URL}/progress`)
      ]);
      setRoadmaps(roadmapsRes.data);
      setProgress(progressRes.data);
      calculateStats(roadmapsRes.data, progressRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (roadmapsData, progressData) => {
    const allRoadmaps = [...roadmapsData.academic, ...roadmapsData.nonAcademic];
    const totalRoadmaps = allRoadmaps.length;
    
    let totalTopics = 0;
    let completedTopics = 0;
    let completedRoadmaps = 0;
    
    allRoadmaps.forEach(roadmap => {
      const roadmapTopics = roadmap.topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
      totalTopics += roadmapTopics;
      
      const roadmapProgress = progressData.find(p => p.roadmapId === roadmap.id);
      if (roadmapProgress) {
        completedTopics += roadmapProgress.completedTopics.length;
        
        // Consider roadmap completed if 90% or more topics are done
        const progressPercentage = (roadmapProgress.completedTopics.length / roadmapTopics) * 100;
        if (progressPercentage >= 90) {
          completedRoadmaps++;
        }
      }
    });

    const averageProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    setStats({
      totalRoadmaps,
      completedRoadmaps,
      totalTopics,
      completedTopics,
      averageProgress,
      learningStreak: calculateStreak(progressData),
      joinedDate: user?.createdAt || new Date()
    });
  };

  const calculateStreak = (progressData) => {
    // Simple streak calculation based on recent activity
    // In a real app, you'd track daily activity
    const recentActivity = progressData.filter(p => {
      const lastUpdate = new Date(p.lastUpdated);
      const daysDiff = (new Date() - lastUpdate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // Active in last 7 days
    });
    return recentActivity.length;
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        { name: editedName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update the user context or local state if needed
      console.log('Profile updated successfully:', response.data);
      setIsEditing(false);
      
      // Optionally refresh the page or update context
      window.location.reload();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setIsEditing(false);
  };

  const getProgressByCategory = (category) => {
    const categoryRoadmaps = category === 'academic' ? roadmaps.academic : roadmaps.nonAcademic;
    let totalTopics = 0;
    let completedTopics = 0;

    categoryRoadmaps.forEach(roadmap => {
      const roadmapTopics = roadmap.topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
      totalTopics += roadmapTopics;
      
      const roadmapProgress = progress.find(p => p.roadmapId === roadmap.id);
      if (roadmapProgress) {
        completedTopics += roadmapProgress.completedTopics.length;
      }
    });

    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };

  const getTopRoadmaps = () => {
    const allRoadmaps = [...roadmaps.academic, ...roadmaps.nonAcademic];
    return allRoadmaps
      .map(roadmap => {
        const roadmapProgress = progress.find(p => p.roadmapId === roadmap.id);
        const totalTopics = roadmap.topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
        const completedCount = roadmapProgress ? roadmapProgress.completedTopics.length : 0;
        const progressPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
        
        return {
          ...roadmap,
          progress: progressPercentage,
          completedCount,
          totalTopics
        };
      })
      .filter(roadmap => roadmap.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
  };

  const exportUserData = () => {
    const userData = {
      user: {
        name: user?.name,
        email: user?.email,
        joinedDate: stats.joinedDate
      },
      progress: progress,
      stats: stats,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
      // This would need a backend endpoint to reset progress
      console.log('Reset progress requested');
      alert('Progress reset functionality would be implemented here');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header fade-in">
          <div className="profile-card">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <div className="profile-info">
              {isEditing ? (
                <div className="edit-profile">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="edit-name-input"
                    placeholder="Enter your name"
                  />
                  <div className="edit-actions">
                    <button 
                      className="save-btn" 
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-display">
                  <h1 className="profile-name">{user?.name}</h1>
                  <button className="edit-btn" onClick={handleEditProfile}>
                    <Edit3 size={16} />
                    Edit
                  </button>
                </div>
              )}
              <div className="profile-details">
                <span className="profile-email">
                  <Mail size={16} />
                  {user?.email}
                </span>
                <span className="profile-joined">
                  <Calendar size={16} />
                  Joined {new Date(stats.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="theme-settings">
            <h3>Preferences</h3>
            <div className="theme-toggle">
              <span>Theme</span>
              <button className="theme-btn" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>
          </div>
        </div>

        <div className="stats-overview fade-in">
          <h2 className="section-title">Learning Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.averageProgress}%</div>
                <div className="stat-label">Overall Progress</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.completedRoadmaps}/{stats.totalRoadmaps}</div>
                <div className="stat-label">Roadmaps Completed</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Target size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.completedTopics}/{stats.totalTopics}</div>
                <div className="stat-label">Topics Completed</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Activity size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.learningStreak}</div>
                <div className="stat-label">Active Roadmaps</div>
              </div>
            </div>
          </div>
        </div>

        <div className="progress-breakdown fade-in">
          <h2 className="section-title">Progress by Category</h2>
          <div className="category-progress">
            <div className="category-card">
              <div className="category-header">
                <BookOpen size={24} />
                <h3>Academic Roadmaps</h3>
              </div>
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large academic" 
                  style={{ width: `${getProgressByCategory('academic')}%` }}
                />
              </div>
              <span className="progress-percentage">{getProgressByCategory('academic')}% Complete</span>
            </div>
            
            <div className="category-card">
              <div className="category-header">
                <Trophy size={24} />
                <h3>Non-Academic Roadmaps</h3>
              </div>
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large non-academic" 
                  style={{ width: `${getProgressByCategory('non-academic')}%` }}
                />
              </div>
              <span className="progress-percentage">{getProgressByCategory('non-academic')}% Complete</span>
            </div>
          </div>
        </div>

        <div className="top-roadmaps fade-in">
          <h2 className="section-title">Your Top Roadmaps</h2>
          <div className="roadmaps-list">
            {getTopRoadmaps().map((roadmap, index) => (
              <div 
                key={roadmap.id} 
                className="roadmap-progress-card"
                onClick={() => navigate(`/roadmap/${roadmap.id}`)}
              >
                <div className="roadmap-rank">#{index + 1}</div>
                <div className="roadmap-info">
                  <h4 className="roadmap-title">{roadmap.title}</h4>
                  <p className="roadmap-category">{roadmap.category}</p>
                </div>
                <div className="roadmap-progress">
                  <div className="progress-circle">
                    <svg className="progress-ring" width="60" height="60">
                      <circle
                        className="progress-ring-background"
                        stroke="var(--bg-tertiary)"
                        strokeWidth="4"
                        fill="transparent"
                        r="26"
                        cx="30"
                        cy="30"
                      />
                      <circle
                        className="progress-ring-progress"
                        stroke="var(--accent)"
                        strokeWidth="4"
                        fill="transparent"
                        r="26"
                        cx="30"
                        cy="30"
                        strokeDasharray={`${2 * Math.PI * 26}`}
                        strokeDashoffset={`${2 * Math.PI * 26 * (1 - roadmap.progress / 100)}`}
                        transform="rotate(-90 30 30)"
                      />
                    </svg>
                    <span className="progress-text">{roadmap.progress}%</span>
                  </div>
                  <div className="progress-details">
                    <span>{roadmap.completedCount}/{roadmap.totalTopics} topics</span>
                  </div>
                </div>
              </div>
            ))}
            {getTopRoadmaps().length === 0 && (
              <div className="no-progress">
                <p>Start learning to see your progress here!</p>
                <button className="start-learning-btn" onClick={() => navigate('/dashboard')}>
                  <BookOpen size={16} />
                  Start Learning
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="learning-goals fade-in">
          <h2 className="section-title">Learning Goals</h2>
          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-header">
                <Target size={24} />
                <h4>Weekly Goal</h4>
              </div>
              <div className="goal-progress">
                <div className="goal-bar">
                  <div 
                    className="goal-fill" 
                    style={{ width: `${Math.min((stats.completedTopics % 7) / 7 * 100, 100)}%` }}
                  />
                </div>
                <span className="goal-text">
                  {stats.completedTopics % 7}/7 topics this week
                </span>
              </div>
            </div>
            
            <div className="goal-card">
              <div className="goal-header">
                <Trophy size={24} />
                <h4>Monthly Goal</h4>
              </div>
              <div className="goal-progress">
                <div className="goal-bar">
                  <div 
                    className="goal-fill monthly" 
                    style={{ width: `${Math.min((stats.completedTopics % 30) / 30 * 100, 100)}%` }}
                  />
                </div>
                <span className="goal-text">
                  {stats.completedTopics % 30}/30 topics this month
                </span>
              </div>
            </div>
            
            <div className="goal-card">
              <div className="goal-header">
                <Activity size={24} />
                <h4>Streak Goal</h4>
              </div>
              <div className="goal-progress">
                <div className="streak-display">
                  <span className="streak-number">{stats.learningStreak}</span>
                  <span className="streak-label">day streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="achievements fade-in">
          <h2 className="section-title">Achievements</h2>
          <div className="achievements-grid">
            <div className={`achievement-card ${stats.completedTopics >= 10 ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">
                <Target size={32} />
              </div>
              <div className="achievement-info">
                <h4>First Steps</h4>
                <p>Complete 10 topics</p>
                <span className="achievement-progress">{Math.min(stats.completedTopics, 10)}/10</span>
              </div>
            </div>
            
            <div className={`achievement-card ${stats.completedTopics >= 50 ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">
                <Activity size={32} />
              </div>
              <div className="achievement-info">
                <h4>Learning Machine</h4>
                <p>Complete 50 topics</p>
                <span className="achievement-progress">{Math.min(stats.completedTopics, 50)}/50</span>
              </div>
            </div>
            
            <div className={`achievement-card ${stats.completedRoadmaps >= 1 ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">
                <Award size={32} />
              </div>
              <div className="achievement-info">
                <h4>Roadmap Master</h4>
                <p>Complete your first roadmap</p>
                <span className="achievement-progress">{stats.completedRoadmaps}/1</span>
              </div>
            </div>
            
            <div className={`achievement-card ${stats.completedTopics >= 100 ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">
                <Trophy size={32} />
              </div>
              <div className="achievement-info">
                <h4>Knowledge Seeker</h4>
                <p>Complete 100 topics</p>
                <span className="achievement-progress">{Math.min(stats.completedTopics, 100)}/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-activity fade-in">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {progress
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .slice(0, 5)
              .map((item, index) => {
                const roadmap = [...roadmaps.academic, ...roadmaps.nonAcademic]
                  .find(r => r.id === item.roadmapId);
                return (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <Clock size={20} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">
                        Updated progress in <strong>{roadmap?.title || 'Unknown Roadmap'}</strong>
                      </p>
                      <span className="activity-time">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <button 
                      className="activity-btn"
                      onClick={() => navigate(`/roadmap/${item.roadmapId}`)}
                    >
                      Continue
                    </button>
                  </div>
                );
              })}
            {progress.length === 0 && (
              <div className="no-activity">
                <p>No recent activity. Start learning to see your progress!</p>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions fade-in">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate('/dashboard')}>
              <BookOpen size={24} />
              <span>Browse Roadmaps</span>
            </button>
            <button className="action-card" onClick={() => navigate('/roadmaps/academic')}>
              <Award size={24} />
              <span>Academic Subjects</span>
            </button>
            <button className="action-card" onClick={() => navigate('/roadmaps/non-academic')}>
              <Trophy size={24} />
              <span>Practical Skills</span>
            </button>
            <button className="action-card" onClick={() => navigate('/resources')}>
              <BookOpen size={24} />
              <span>Learning Resources</span>
            </button>
            <button className="action-card" onClick={() => window.location.reload()}>
              <Settings size={24} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        <div className="account-settings fade-in">
          <h2 className="section-title">Account Settings</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive updates about your learning progress</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Progress Reminders</h4>
                <p>Get reminded to continue your learning journey</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Weekly Summary</h4>
                <p>Receive weekly progress summaries via email</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Export Data</h4>
                <p>Download your learning progress and statistics</p>
              </div>
              <button className="export-btn" onClick={exportUserData}>
                Export Data
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Reset Progress</h4>
                <p>Clear all your learning progress (cannot be undone)</p>
              </div>
              <button className="warning-btn" onClick={resetProgress}>
                Reset Progress
              </button>
            </div>
            
            <div className="setting-item danger-zone">
              <div className="setting-info">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all data</p>
              </div>
              <button className="danger-btn">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;