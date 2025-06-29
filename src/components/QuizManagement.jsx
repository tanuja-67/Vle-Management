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

function QuizManagement() {
  const [villagers, setVillagers] = useState([]);
  const [selectedVillager, setSelectedVillager] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const storedVillagers = JSON.parse(localStorage.getItem('villagers')) || [];
    setVillagers(storedVillagers);
  }, []);

  const startQuiz = (villager) => {
    setSelectedVillager(villager);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setShowResults(false);
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

    // Save quiz result
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

    // Update villager record
    const updatedVillagers = villagers.map(v => 
      v.id === selectedVillager.id 
        ? { ...v, quizCompleted: true, quizScore: percentage }
        : v
    );
    localStorage.setItem('villagers', JSON.stringify(updatedVillagers));
    setVillagers(updatedVillagers);

    setQuizCompleted(true);
    toast.success(`Quiz completed! Score: ${percentage}%`);
  };

  const resetQuiz = () => {
    setSelectedVillager(null);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setShowResults(false);
  };

  if (selectedVillager && !quizCompleted) {
    const question = quizQuestions[currentQuestion];
    const hasAnswered = answers[question.id] !== undefined;

    return (
      <div className="page-container">
        <h1 className="page-title">Quiz - {selectedVillager.name}</h1>
        
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#718096' }}>
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
              background: '#667eea',
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
                  background: answers[question.id] === index ? '#667eea' : 'transparent',
                  color: answers[question.id] === index ? 'white' : '#2d3748'
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

  if (quizCompleted) {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const villagerResult = results.find(r => r.villagerId === selectedVillager.id);

    return (
      <div className="page-container">
        <h1 className="page-title">Quiz Completed!</h1>
        
        <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
            {selectedVillager.name}
          </h3>
          <div className="stat-number" style={{ marginBottom: '1rem' }}>
            {villagerResult?.score}%
          </div>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            {villagerResult?.score >= 70 ? 
              'Excellent! Strong problem-solving and entrepreneurial mindset.' :
              villagerResult?.score >= 50 ?
              'Good! Shows potential for entrepreneurial development.' :
              'Needs support and training to develop entrepreneurial skills.'
            }
          </p>
          <button onClick={resetQuiz} className="btn btn-primary">
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Quiz Management</h1>
      
      <div className="villager-list">
        {villagers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#718096' }}>No villagers registered yet.</p>
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
    </div>
  );
}

export default QuizManagement;
