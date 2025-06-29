import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const quizQuestions = [
  {
    id: 1,
    question: "If you have ₹1000 to start a small business, what would be your first priority?",
    options: [
      "Buy as much inventory as possible",
      "Research the market and customer needs first",
      "Start selling immediately to make quick money",
      "Keep the money safe until you're sure"
    ],
    correct: 1,
    category: "problem-solving"
  },
  {
    id: 2,
    question: "A customer complains about your product. What's your best response?",
    options: [
      "Ignore them - they're just being difficult",
      "Listen carefully and try to understand their concern",
      "Give them their money back immediately",
      "Argue that your product is fine"
    ],
    correct: 1,
    category: "problem-solving"
  },
  {
    id: 3,
    question: "You notice your business is losing customers. What would you do first?",
    options: [
      "Lower your prices immediately",
      "Ask customers why they're leaving",
      "Blame it on bad luck",
      "Close the business"
    ],
    correct: 1,
    category: "problem-solving"
  },
  {
    id: 4,
    question: "What motivates you most about starting your own business?",
    options: [
      "Making lots of money quickly",
      "Being my own boss and creating something meaningful",
      "Having an easy job",
      "Impressing others"
    ],
    correct: 1,
    category: "entrepreneurship"
  },
  {
    id: 5,
    question: "How do you view failure in business?",
    options: [
      "Something to avoid at all costs",
      "A learning opportunity to improve",
      "A sign to give up",
      "Someone else's fault"
    ],
    correct: 1,
    category: "entrepreneurship"
  },
  {
    id: 6,
    question: "You have a great business idea but lack some skills. What do you do?",
    options: [
      "Give up on the idea",
      "Learn the skills or find someone who has them",
      "Start anyway and hope for the best",
      "Wait for someone else to help"
    ],
    correct: 1,
    category: "entrepreneurship"
  },
  {
    id: 7,
    question: "Your business is growing but you're overwhelmed with work. What's your solution?",
    options: [
      "Work longer hours until you burn out",
      "Plan and organize better, possibly delegate tasks",
      "Stop taking new customers",
      "Complain about being too busy"
    ],
    correct: 1,
    category: "problem-solving"
  },
  {
    id: 8,
    question: "What's most important for long-term business success?",
    options: [
      "Having the cheapest prices",
      "Building trust and relationships with customers",
      "Making quick profits",
      "Having the fanciest office"
    ],
    correct: 1,
    category: "entrepreneurship"
  }
];

function VLEManagementSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalVillagers: 0,
    completedQuizzes: 0,
    selectedVLEs: 0,
    pendingQuizzes: 0
  });

  // Registration form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    education: '',
    occupation: '',
    income: '',
    familySize: '',
    address: '',
    skills: '',
    experience: ''
  });

  // Quiz state
  const [villagers, setVillagers] = useState([]);
  const [selectedVillager, setSelectedVillager] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  // VLE Selection state
  const [candidates, setCandidates] = useState([]);
  const [selectedVLEs, setSelectedVLEs] = useState([]);
  const [filterScore, setFilterScore] = useState(50);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const villagersData = JSON.parse(localStorage.getItem('villagers')) || [];
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    const selectedVLEsData = JSON.parse(localStorage.getItem('selectedVLEs')) || [];

    setVillagers(villagersData);
    setSelectedVLEs(selectedVLEsData);

    // Update stats
    setStats({
      totalVillagers: villagersData.length,
      completedQuizzes: quizResults.length,
      selectedVLEs: selectedVLEsData.length,
      pendingQuizzes: villagersData.length - quizResults.length
    });

    // Update candidates for VLE selection
    const candidatesWithScores = villagersData
      .filter(villager => villager.quizCompleted)
      .map(villager => {
        const quizResult = quizResults.find(result => result.villagerId === villager.id);
        return {
          ...villager,
          quizScore: quizResult ? quizResult.score : 0,
          isAlreadyVLE: selectedVLEsData.some(vle => vle.id === villager.id)
        };
      })
      .sort((a, b) => b.quizScore - a.quizScore);

    setCandidates(candidatesWithScores);
  };

  // Registration functions
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.contact) {
      toast.error('Please fill in all required fields');
      return;
    }

    const existingVillagers = JSON.parse(localStorage.getItem('villagers')) || [];
    const newVillager = {
      ...formData,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString(),
      quizCompleted: false,
      quizScore: null
    };

    existingVillagers.push(newVillager);
    localStorage.setItem('villagers', JSON.stringify(existingVillagers));

    toast.success('Villager registered successfully!');
    
    // Reset form and reload data
    setFormData({
      name: '',
      age: '',
      gender: '',
      contact: '',
      education: '',
      occupation: '',
      income: '',
      familySize: '',
      address: '',
      skills: '',
      experience: ''
    });
    loadData();
  };

  // Quiz functions
  const startQuiz = (villager) => {
    setSelectedVillager(villager);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setActiveTab('quiz-active');
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    let score = 0;
    quizQuestions.forEach(question => {
      if (answers[question.id] === question.correct) {
        score++;
      }
    });

    const percentage = Math.round((score / quizQuestions.length) * 100);

    const quizResult = {
      villagerId: selectedVillager.id,
      villagerName: selectedVillager.name,
      score: percentage,
      answers: answers,
      completedAt: new Date().toISOString()
    };

    const existingResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    existingResults.push(quizResult);
    localStorage.setItem('quizResults', JSON.stringify(existingResults));

    const updatedVillagers = villagers.map(v => 
      v.id === selectedVillager.id 
        ? { ...v, quizCompleted: true, quizScore: percentage }
        : v
    );
    localStorage.setItem('villagers', JSON.stringify(updatedVillagers));

    setQuizCompleted(true);
    toast.success(`Quiz completed! Score: ${percentage}%`);
    loadData();
  };

  const resetQuiz = () => {
    setSelectedVillager(null);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setActiveTab('quiz');
  };

  // VLE Selection functions
  const toggleVLESelection = (candidate) => {
    if (candidate.isAlreadyVLE) {
      toast.info('This person is already selected as VLE');
      return;
    }

    const isCurrentlySelected = selectedVLEs.some(vle => vle.id === candidate.id);
    
    if (isCurrentlySelected) {
      const updated = selectedVLEs.filter(vle => vle.id !== candidate.id);
      setSelectedVLEs(updated);
      toast.info(`${candidate.name} removed from VLE selection`);
    } else {
      const newVLE = {
        ...candidate,
        selectedAt: new Date().toISOString(),
        status: 'pending-approval'
      };
      const updated = [...selectedVLEs, newVLE];
      setSelectedVLEs(updated);
      toast.success(`${candidate.name} selected as potential VLE`);
    }
  };

  const confirmVLESelection = () => {
    if (selectedVLEs.length === 0) {
      toast.error('Please select at least one VLE');
      return;
    }

    localStorage.setItem('selectedVLEs', JSON.stringify(selectedVLEs));
    toast.success(`${selectedVLEs.length} VLE(s) confirmed for machine allocation`);
    loadData();
  };

  const deleteVLE = (vleId) => {
    if (window.confirm('Are you sure you want to remove this VLE?')) {
      const updatedVLEs = selectedVLEs.filter(vle => vle.id !== vleId);
      setSelectedVLEs(updatedVLEs);
      localStorage.setItem('selectedVLEs', JSON.stringify(updatedVLEs));
      toast.success('VLE removed successfully');
      loadData();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#48bb78';
    if (score >= 70) return '#ed8936';
    if (score >= 60) return '#ecc94b';
    return '#e53e3e';
  };

  const filteredCandidates = candidates.filter(candidate => candidate.quizScore >= filterScore);

  // Quiz Active View
  if (activeTab === 'quiz-active' && selectedVillager && !quizCompleted) {
    const question = quizQuestions[currentQuestion];
    const hasAnswered = answers[question.id] !== undefined;

    return (
      <div className="page-container">
        <h1 className="page-title">Quiz - {selectedVillager.name}</h1>
        
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b' }}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
          <div style={{ 
            background: '#e2e8f0', 
            height: '8px', 
            borderRadius: '4px', 
            margin: '1rem 0',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#10b981',
              height: '100%',
              width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div className="quiz-question">
          <h3 style={{ marginBottom: '1rem' }}>{question.question}</h3>
          <div className="quiz-options">
            {question.options.map((option, index) => (
              <div 
                key={index}
                className="quiz-option"
                onClick={() => handleAnswer(question.id, index)}
                style={{
                  background: answers[question.id] === index ? '#10b981' : 'transparent',
                  color: answers[question.id] === index ? 'white' : '#1e293b'
                }}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswer(question.id, index)}
                />
                {option}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button onClick={resetQuiz} className="btn btn-secondary">
            Cancel Quiz
          </button>
          <button 
            onClick={nextQuestion} 
            className="btn btn-primary"
            disabled={!hasAnswered}
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
          </button>
        </div>
      </div>
    );
  }

  // Quiz Completed View
  if (quizCompleted) {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const villagerResult = results.find(r => r.villagerId === selectedVillager.id);

    return (
      <div className="page-container">
        <h1 className="page-title">Quiz Completed!</h1>
        
        <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>
            {selectedVillager.name}
          </h3>
          <div className="stat-number" style={{ marginBottom: '1rem' }}>
            {villagerResult?.score}%
          </div>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            {villagerResult?.score >= 70 ? 
              'Excellent! Strong problem-solving and entrepreneurial mindset.' :
              villagerResult?.score >= 50 ?
              'Good! Shows potential for entrepreneurial development.' :
              'Needs support and training to develop entrepreneurial skills.'
            }
          </p>
          <button onClick={resetQuiz} className="btn btn-primary">
            Back to Quiz Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">VLE Management System</h1>
      
      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        borderBottom: '2px solid #e2e8f0',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'register', label: 'Register Villagers', icon: '📝' },
          { id: 'quiz', label: 'Quiz Management', icon: '🎯' },
          { id: 'vle-selection', label: 'VLE Selection', icon: '👥' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? '#10b981' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              padding: '1rem 1.5rem',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <>
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
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>System Overview</h3>
              <div style={{ color: '#64748b' }}>
                <p style={{ marginBottom: '0.5rem' }}>• {stats.totalVillagers} villagers registered in the system</p>
                <p style={{ marginBottom: '0.5rem' }}>• {stats.completedQuizzes} assessments completed successfully</p>
                <p style={{ marginBottom: '0.5rem' }}>• {stats.selectedVLEs} VLEs selected for machine allocation</p>
                <p style={{ marginBottom: '0.5rem' }}>• {stats.pendingQuizzes} villagers pending assessment</p>
                <p>• System ready for new registrations and assessments</p>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Selected VLEs</h3>
              {selectedVLEs.length === 0 ? (
                <p style={{ color: '#64748b' }}>No VLEs selected yet. Complete the assessment process first.</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedVLEs.map(vle => (
                    <div key={vle.id} style={{
                      background: '#f0fdf4',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>{vle.name}</h4>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                          Score: {vle.quizScore}% | Contact: {vle.contact}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteVLE(vle.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Register Tab */}
      {activeTab === 'register' && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleFormChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Education Level</label>
              <select name="education" value={formData.education} onChange={handleFormChange}>
                <option value="">Select Education</option>
                <option value="no-formal">No Formal Education</option>
                <option value="primary">Primary School</option>
                <option value="secondary">Secondary School</option>
                <option value="higher-secondary">Higher Secondary</option>
                <option value="graduate">Graduate</option>
                <option value="post-graduate">Post Graduate</option>
              </select>
            </div>

            <div className="form-group">
              <label>Current Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Monthly Income (₹)</label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Family Size</label>
              <input
                type="number"
                name="familySize"
                value={formData.familySize}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Skills & Interests</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleFormChange}
              rows="3"
              placeholder="e.g., farming, handicrafts, tailoring, etc."
            />
          </div>

          <div className="form-group">
            <label>Previous Business Experience</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleFormChange}
              rows="3"
              placeholder="Describe any previous business or entrepreneurial experience"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Register Villager
          </button>
        </form>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="villager-list">
          {villagers.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ color: '#64748b' }}>No villagers registered yet.</p>
            </div>
          ) : (
            villagers.map(villager => (
              <div key={villager.id} className="villager-item">
                <div className="villager-info">
                  <h4>{villager.name}</h4>
                  <p>Age: {villager.age} | Contact: {villager.contact}</p>
                  <p>Occupation: {villager.occupation || 'Not specified'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {villager.quizCompleted ? (
                    <div className="score-badge">
                      Score: {villager.quizScore}%
                    </div>
                  ) : (
                    <button 
                      onClick={() => startQuiz(villager)}
                      className="btn btn-primary"
                    >
                      Start Quiz
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VLE Selection Tab */}
      {activeTab === 'vle-selection' && (
        <>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Selection Criteria</h3>
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
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>{filterScore}%</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Showing candidates with {filterScore}% or higher quiz scores.
            </p>
          </div>

          {selectedVLEs.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem', background: '#f0fdf4', border: '2px solid #10b981' }}>
              <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>
                Current Selection ({selectedVLEs.length} VLE{selectedVLEs.length !== 1 ? 's' : ''})
              </h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {selectedVLEs.map(vle => (
                  <div key={vle.id} style={{
                    background: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid #10b981',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {vle.name} ({vle.quizScore}%)
                    <button
                      onClick={() => deleteVLE(vle.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={confirmVLESelection} className="btn btn-success">
                Confirm VLE Selection & Allocate Machines
              </button>
            </div>
          )}

          <div className="card">
            <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>
              Eligible Candidates ({filteredCandidates.length})
            </h3>
            
            {filteredCandidates.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                <p>No candidates meet the current criteria.</p>
                <p>Try lowering the minimum score or ensure villagers have completed their quizzes.</p>
              </div>
            ) : (
              <div className="grid grid-2">
                {filteredCandidates.map(candidate => {
                  const isSelected = selectedVLEs.some(vle => vle.id === candidate.id);
                  const isAlreadyVLE = candidate.isAlreadyVLE;
                  
                  return (
                    <div 
                      key={candidate.id} 
                      className={`card vle-candidate ${isSelected ? 'selected' : ''}`}
                      style={{
                        opacity: isAlreadyVLE ? 0.6 : 1,
                        cursor: isAlreadyVLE ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => toggleVLESelection(candidate)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
                            {candidate.name}
                            {isAlreadyVLE && <span style={{ color: '#10b981', fontSize: '0.8rem', marginLeft: '0.5rem' }}>(Selected VLE)</span>}
                          </h4>
                          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
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
                        <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                          <strong>Occupation:</strong> {candidate.occupation || 'Not specified'}
                        </p>
                        <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                          <strong>Education:</strong> {candidate.education || 'Not specified'}
                        </p>
                        <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                          <strong>Skills:</strong> {candidate.skills || 'Not specified'}
                        </p>
                      </div>

                      {!isAlreadyVLE && (
                        <div style={{
                          textAlign: 'center',
                          color: isSelected ? '#10b981' : '#64748b',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          {isSelected ? '✓ Selected for VLE' : 'Click to select as VLE'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default VLEManagementSystem;
