import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    totalVillagers: 0,
    completedQuizzes: 0,
    selectedVLEs: 0,
    pendingQuizzes: 0,
    aiRecommendations: 0
  });

  useEffect(() => {
    const villagers = JSON.parse(localStorage.getItem('villagers')) || [];
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    const selectedVLEs = JSON.parse(localStorage.getItem('selectedVLEs')) || [];
    const recommendations = JSON.parse(localStorage.getItem('agriRecommendations')) || [];

    setStats({
      totalVillagers: villagers.length,
      completedQuizzes: quizResults.length,
      selectedVLEs: selectedVLEs.length,
      pendingQuizzes: villagers.length - quizResults.length,
      aiRecommendations: recommendations.length
    });
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Volunteer Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalVillagers}</div>
          <div className="stat-label">Total Villagers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completedQuizzes}</div>
          <div className="stat-label">Completed Quizzes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingQuizzes}</div>
          <div className="stat-label">Pending Quizzes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.selectedVLEs}</div>
          <div className="stat-label">Selected VLEs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.aiRecommendations}</div>
          <div className="stat-label">AI Recommendations</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/register" className="btn btn-primary">
              Register New Villager
            </Link>
            <Link to="/quiz" className="btn btn-secondary">
              Manage Quizzes
            </Link>
            <Link to="/vle-selection" className="btn btn-success">
              Select VLEs
            </Link>
            <Link to="/agri-recommendation" className="btn" style={{ background: '#f59e0b', color: 'white' }}>
              AI Recommendations
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Recent Activity</h3>
          <div style={{ color: '#64748b' }}>
            <p style={{ marginBottom: '0.5rem' }}>• {stats.totalVillagers} villagers registered</p>
            <p style={{ marginBottom: '0.5rem' }}>• {stats.completedQuizzes} quizzes completed</p>
            <p style={{ marginBottom: '0.5rem' }}>• {stats.selectedVLEs} VLEs selected for machines</p>
            <p style={{ marginBottom: '0.5rem' }}>• {stats.aiRecommendations} AI recommendations generated</p>
            <p>• System ready for new registrations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
