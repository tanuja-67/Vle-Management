import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

function VLESelection() {
  const [candidates, setCandidates] = useState([]);
  const [selectedVLEs, setSelectedVLEs] = useState([]);
  const [filterScore, setFilterScore] = useState(50);
  const [loading, setLoading] = useState(true);
  const [existingVLEs, setExistingVLEs] = useState([]);

  useEffect(() => {
    loadData();
  }, [filterScore]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [candidatesData, vlesData] = await Promise.all([
        ApiService.getVLECandidates(filterScore),
        ApiService.getVLEs()
      ]);
      
      setCandidates(candidatesData);
      setExistingVLEs(vlesData);
      setSelectedVLEs([]); // Reset selection when reloading
    } catch (error) {
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleVLESelection = (candidate) => {
    const isCurrentlySelected = selectedVLEs.some(vle => vle._id === candidate._id);
    
    if (isCurrentlySelected) {
      // Remove from selection
      const updated = selectedVLEs.filter(vle => vle._id !== candidate._id);
      setSelectedVLEs(updated);
      toast.info(`${candidate.name} removed from VLE selection`);
    } else {
      // Add to selection
      const updated = [...selectedVLEs, candidate];
      setSelectedVLEs(updated);
      toast.success(`${candidate.name} selected as potential VLE`);
    }
  };

  const confirmVLESelection = async () => {
    if (selectedVLEs.length === 0) {
      toast.error('Please select at least one VLE');
      return;
    }

    try {
      const villagerIds = selectedVLEs.map(vle => vle._id);
      await ApiService.selectVLEs(villagerIds);
      
      toast.success(`${selectedVLEs.length} VLE(s) confirmed for machine allocation`);
      
      // Reload data to update the UI
      await loadData();
    } catch (error) {
      toast.error('Failed to confirm VLE selection: ' + error.message);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#48bb78'; // Green
    if (score >= 70) return '#ed8936'; // Orange
    if (score >= 60) return '#ecc94b'; // Yellow
    return '#e53e3e'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Development';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading VLE candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">VLE Selection</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Selection Criteria</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <label>Minimum Quiz Score:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={filterScore}
            onChange={(e) => setFilterScore(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontWeight: 'bold', color: '#667eea' }}>{filterScore}%</span>
        </div>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Showing candidates with {filterScore}% or higher quiz scores. 
          These individuals demonstrate strong problem-solving skills and entrepreneurial mindset.
        </p>
      </div>

      {existingVLEs.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem', background: '#f0fff4', border: '2px solid #48bb78' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
            Current VLEs ({existingVLEs.length})
          </h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {existingVLEs.map(vle => (
              <div key={vle._id} style={{
                background: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid #48bb78',
                fontSize: '0.9rem'
              }}>
                {vle.name} ({vle.quizScore}%) - {vle.status}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedVLEs.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem', background: '#f0fff4', border: '2px solid #48bb78' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
            New Selection ({selectedVLEs.length} VLE{selectedVLEs.length !== 1 ? 's' : ''})
          </h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {selectedVLEs.map(vle => (
              <div key={vle._id} style={{
                background: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid #48bb78',
                fontSize: '0.9rem'
              }}>
                {vle.name} ({vle.quizScore}%)
              </div>
            ))}
          </div>
          <button onClick={confirmVLESelection} className="btn btn-success">
            Confirm VLE Selection & Allocate Machines
          </button>
        </div>
      )}

      <div className="card">
        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
          Eligible Candidates ({candidates.length})
        </h3>
        
        {candidates.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
            <p>No candidates meet the current criteria.</p>
            <p>Try lowering the minimum score or ensure villagers have completed their quizzes.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {candidates.map(candidate => {
              const isSelected = selectedVLEs.some(vle => vle._id === candidate._id);
              
              return (
                <div 
                  key={candidate._id} 
                  className={`card vle-candidate ${isSelected ? 'selected' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleVLESelection(candidate)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
                        {candidate.name}
                      </h4>
                      <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                        Age: {candidate.age} | Contact: {candidate.contact}
                      </p>
                    </div>
                    <div style={{ 
                      background: getScoreColor(candidate.quizScore),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {candidate.quizScore}%
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <strong>Occupation:</strong> {candidate.occupation || 'Not specified'}
                    </p>
                    <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <strong>Education:</strong> {candidate.education || 'Not specified'}
                    </p>
                    <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <strong>Skills:</strong> {candidate.skills || 'Not specified'}
                    </p>
                  </div>

                  <div style={{ 
                    background: '#f7fafc', 
                    padding: '0.75rem', 
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ 
                      color: getScoreColor(candidate.quizScore), 
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      Assessment: {getScoreLabel(candidate.quizScore)}
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {candidate.quizScore >= 80 ? 
                        'Highly recommended for VLE role. Shows excellent problem-solving and entrepreneurial skills.' :
                        candidate.quizScore >= 70 ?
                        'Good candidate for VLE role. Demonstrates solid entrepreneurial potential.' :
                        candidate.quizScore >= 60 ?
                        'Suitable candidate with some support. May benefit from additional training.' :
                        'May need significant support and training before taking on VLE responsibilities.'
                      }
                    </p>
                  </div>

                  <div style={{
                    textAlign: 'center',
                    color: isSelected ? '#48bb78' : '#667eea',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {isSelected ? '✓ Selected for VLE' : 'Click to select as VLE'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default VLESelection;
