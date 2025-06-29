import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MainSelection() {
  const [systemStats, setSystemStats] = useState({
    totalVillagers: 0,
    completedQuizzes: 0,
    selectedVLEs: 0,
    readyForSelection: 0,
    aiRecommendations: 0
  });

  useEffect(() => {
    const villagers = JSON.parse(localStorage.getItem('villagers')) || [];
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    const selectedVLEs = JSON.parse(localStorage.getItem('selectedVLEs')) || [];
    const recommendations = JSON.parse(localStorage.getItem('agriRecommendations')) || [];
    
    const eligibleCandidates = villagers.filter(villager => {
      const quizResult = quizResults.find(result => result.villagerId === villager.id);
      return quizResult && quizResult.score >= 50;
    }).length;

    setSystemStats({
      totalVillagers: villagers.length,
      completedQuizzes: quizResults.length,
      selectedVLEs: selectedVLEs.length,
      readyForSelection: eligibleCandidates,
      aiRecommendations: recommendations.length
    });
  }, []);

  return (
    <div className="page-container" style={{ width: '100%', maxWidth: 'none' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="page-title">Village Empowerment Platform</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
          Complete VLE lifecycle management and AI-powered agricultural machine recommendations
        </p>
      </div>

      {/* System Status Overview */}
      <div className="card" style={{ marginBottom: '3rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '2px solid #10b981', width: '100%' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '1.5rem', textAlign: 'center' }}>System Overview</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{systemStats.totalVillagers}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Registered Villagers</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{systemStats.completedQuizzes}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Completed Assessments</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{systemStats.readyForSelection}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Eligible for VLE</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{systemStats.selectedVLEs}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Selected VLEs</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{systemStats.aiRecommendations}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>AI Recommendations</div>
          </div>
        </div>
      </div>

      {/* Main Action Selection - Only 2 Cards */}
      <div className="grid grid-2" style={{ gap: '3rem', width: '100%' }}>
        {/* VLE Management System */}
        <Link to="/vle-management" style={{ textDecoration: 'none', width: '100%' }}>
          <div className="card workflow-card" style={{ width: '100%', minHeight: '500px' }}>
            <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem 2rem' }}>
              <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>👥</div>
              <h3 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '2rem' }}>
                VLE Management System
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Complete end-to-end VLE management - register villagers, conduct assessments, 
                and select qualified entrepreneurs all in one integrated system.
              </p>
              <div style={{ 
                background: '#10b981', 
                color: 'white', 
                padding: '1.25rem 2.5rem', 
                borderRadius: '8px', 
                fontWeight: '600',
                display: 'inline-block',
                fontSize: '1.2rem'
              }}>
                Start VLE Process →
              </div>
            </div>
            
            <div style={{ 
              background: '#f0fdf4', 
              padding: '2rem', 
              borderRadius: '8px', 
              marginTop: '1rem',
              border: '1px solid #d1fae5'
            }}>
              <h4 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.2rem', textAlign: 'center' }}>Complete Workflow Includes:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '1rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1.2rem' }}>📝</span>
                  <span>Villager Registration</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1.2rem' }}>🎯</span>
                  <span>Assessment Quizzes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1.2rem' }}>⭐</span>
                  <span>VLE Selection</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1.2rem' }}>📊</span>
                  <span>Dashboard Analytics</span>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '1rem', textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Current Status: </span>
                <span style={{ color: '#64748b' }}>
                  {systemStats.selectedVLEs} VLEs selected from {systemStats.readyForSelection} eligible candidates
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* AI Agricultural Recommendations */}
        <Link to="/agri-recommendation" style={{ textDecoration: 'none', width: '100%' }}>
          <div className="card workflow-card" style={{ width: '100%', minHeight: '500px' }}>
            <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem 2rem' }}>
              <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>🤖</div>
              <h3 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '2rem' }}>
                AI Agricultural Recommendations
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Advanced AI-powered analysis to recommend the most suitable agricultural machines 
                for selected VLEs based on their specific farming requirements.
              </p>
              <div style={{ 
                background: '#f59e0b', 
                color: 'white', 
                padding: '1.25rem 2.5rem', 
                borderRadius: '8px', 
                fontWeight: '600',
                display: 'inline-block',
                fontSize: '1.2rem'
              }}>
                Get AI Recommendations →
              </div>
            </div>
            
            <div style={{ 
              background: '#fffbeb', 
              padding: '2rem', 
              borderRadius: '8px', 
              marginTop: '1rem',
              border: '1px solid #fed7aa'
            }}>
              <h4 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.2rem', textAlign: 'center' }}>AI-Powered Features:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '1rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>🧠</span>
                  <span>Gemini AI-powered analysis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>📁</span>
                  <span>Multi-format file support</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>🎯</span>
                  <span>Personalized recommendations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>⚡</span>
                  <span>Instant machine suggestions</span>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '1rem', textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '6px' }}>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Prerequisites: </span>
                <span style={{ color: '#64748b' }}>
                  {systemStats.selectedVLEs > 0 ? `${systemStats.selectedVLEs} VLEs ready for analysis` : 'Complete VLE selection first'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Process Flow */}
      <div className="card" style={{ marginTop: '4rem', background: '#f0f9ff', border: '2px solid #3b82f6', width: '100%' }}>
        <h4 style={{ color: '#1e293b', marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>📋 Recommended Workflow</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ textAlign: 'center', flex: 1, minWidth: '300px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
            <h5 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '1.2rem' }}>Step 1: VLE Management</h5>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>
              Register villagers → Conduct assessments → Select qualified VLEs → Monitor progress
            </p>
          </div>
          <div style={{ fontSize: '3rem', color: '#10b981' }}>→</div>
          <div style={{ textAlign: 'center', flex: 1, minWidth: '300px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
            <h5 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '1.2rem' }}>Step 2: AI Recommendations</h5>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>
              Upload agricultural data → AI analysis → Get machine recommendations → Deploy solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainSelection;
