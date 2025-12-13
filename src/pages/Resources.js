import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Play, 
  Clock, 
  User,
  ExternalLink,
  BookOpen,
  Video
} from 'lucide-react';
import './Resources.css';

const Resources = () => {
  const { id } = useParams();
  const { API_URL } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    try {
      const response = await axios.get(`${API_URL}/roadmaps/${id}`);
      setRoadmap(response.data);
    } catch (error) {
      console.error('Failed to fetch roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfView = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  const handleDownload = (pdfUrl, title) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getYouTubeEmbedUrl = (video) => {
    // Use embedUrl if available (for playlists), otherwise fall back to individual video
    return video.embedUrl || `https://www.youtube.com/embed/${video.youtubeId}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">Loading...</div>
      </>
    );
  }

  if (!roadmap || !roadmap.resources) {
    return (
      <>
        <Navbar />
        <div className="resources-container">
          <button className="back-btn" onClick={() => navigate(`/roadmap/${id}`)}>
            <ArrowLeft size={20} />
            Back to Roadmap
          </button>
          <div className="no-resources">
            <h2>No Resources Available</h2>
            <p>Resources for this roadmap are coming soon!</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="resources-container">
        <div className="resources-header">
          <button className="back-btn" onClick={() => navigate(`/roadmap/${id}`)}>
            <ArrowLeft size={20} />
            Back to Roadmap
          </button>

          <div className="header-content fade-in">
            <h1>{roadmap.title} - Resources</h1>
            <p>Comprehensive learning materials to master {roadmap.title}</p>
          </div>

          <div className="tabs-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <BookOpen size={20} />
                Notes & PDFs
                <span className="tab-count">({roadmap.resources.notes?.length || 0})</span>
              </button>
              <button 
                className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveTab('videos')}
              >
                <Video size={20} />
                Video Tutorials
                <span className="tab-count">({roadmap.resources.videos?.length || 0})</span>
              </button>
            </div>
          </div>
        </div>

        <div className="resources-content">
          {activeTab === 'notes' && (
            <div className="notes-section">
              {selectedPdf ? (
                <div className="pdf-viewer">
                  <div className="pdf-viewer-header">
                    <button 
                      className="close-pdf-btn"
                      onClick={() => setSelectedPdf(null)}
                    >
                      <ArrowLeft size={20} />
                      Back to Notes
                    </button>
                    <button 
                      className="download-btn"
                      onClick={() => {
                        const note = roadmap.resources.notes.find(n => n.url === selectedPdf);
                        handleDownload(selectedPdf, note?.title || 'document');
                      }}
                    >
                      <Download size={20} />
                      Download PDF
                    </button>
                  </div>
                  <iframe
                    src={selectedPdf}
                    title="PDF Viewer"
                    className="pdf-iframe"
                  />
                </div>
              ) : (
                <div className="notes-grid">
                  {roadmap.resources.notes?.map((note, index) => (
                    <div key={note.id} className="note-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="note-icon">
                        <FileText size={32} />
                      </div>
                      <div className="note-content">
                        <h3 className="note-title">{note.title}</h3>
                        <p className="note-description">{note.description}</p>
                        <div className="note-meta">
                          <span className="note-author">
                            <User size={16} />
                            {note.author}
                          </span>
                          <span className="note-type">{note.type.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="note-actions">
                        <button 
                          className="view-btn"
                          onClick={() => handlePdfView(note.url)}
                        >
                          <ExternalLink size={16} />
                          View PDF
                        </button>
                        {note.downloadable && (
                          <button 
                            className="download-btn"
                            onClick={() => handleDownload(note.url, note.title)}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="videos-section">
              <div className="videos-grid">
                {roadmap.resources.videos?.map((video, index) => (
                  <div key={video.id} className="video-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="video-thumbnail">
                      <iframe
                        src={getYouTubeEmbedUrl(video)}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="video-iframe"
                      />
                    </div>
                    <div className="video-content">
                      <h3 className="video-title">{video.title}</h3>
                      <p className="video-description">{video.description}</p>
                      <div className="video-meta">
                        <span className="video-author">
                          <User size={16} />
                          {video.author}
                        </span>
                        {video.duration && (
                          <span className="video-duration">
                            <Clock size={16} />
                            {video.duration}
                          </span>
                        )}
                        {video.playlistId && (
                          <span className="video-type">
                            <Play size={16} />
                            Playlist
                          </span>
                        )}
                      </div>
                      <div className="video-actions">
                        <a 
                          href={video.playlistId 
                            ? `https://www.youtube.com/playlist?list=${video.playlistId}`
                            : `https://www.youtube.com/watch?v=${video.youtubeId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="watch-btn"
                        >
                          <Play size={16} />
                          {video.playlistId ? 'View Playlist' : 'Watch on YouTube'}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Resources;