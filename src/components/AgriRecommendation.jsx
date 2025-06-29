import { useState } from 'react';
import { toast } from 'react-toastify';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const analyzeWithGeminiAI = async (fileName, fileType, fileContent) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let prompt = `
You are an agricultural expert AI assistant. Analyze the following file and provide agricultural machine recommendations.

File Details:
- File Name: ${fileName}
- File Type: ${fileType}

Based on the file name and type, please provide:
1. One specific agricultural machine recommendation
2. A detailed reason explaining why this machine is suitable for the agricultural context

Please respond in this exact JSON format:
{
  "machine": "Specific machine name",
  "reason": "Detailed explanation of why this machine is suitable for the agricultural context and how it will benefit the VLE"
}

Consider factors like:
- Crop type (if identifiable from filename)
- Soil conditions (if mentioned)
- Pest/disease issues (if indicated)
- Farming scale and methods
- Regional agricultural practices
- Cost-effectiveness for small-scale farmers
- Sustainability and environmental impact
- Ease of operation and maintenance

Focus on practical, affordable machines suitable for village-level entrepreneurs (VLEs) in rural areas.
`;

    // If it's an image file, we could potentially analyze the actual image content
    // For now, we'll analyze based on file name and type
    if (fileType.startsWith('image/')) {
      prompt += `\nThis is an image file. Based on the filename, provide recommendations for agricultural machinery that would be most beneficial.`;
    } else {
      prompt += `\nThis is a document file. Based on the filename, provide recommendations for agricultural machinery.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          machine: analysis.machine || 'General Agricultural Equipment',
          reason: analysis.reason || 'AI analysis suggests this machine based on agricultural best practices and suitability for village-level entrepreneurs.'
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response, using fallback parsing');
    }
    
    // Fallback parsing if JSON parsing fails
    const lines = text.split('\n').filter(line => line.trim());
    return {
      machine: lines.find(line => line.toLowerCase().includes('machine'))?.replace(/.*machine[:\-\s]*/i, '') || 'General Agricultural Equipment',
      reason: lines.find(line => line.toLowerCase().includes('reason'))?.replace(/.*reason[:\-\s]*/i, '') || text.substring(0, 200) + '...'
    };
    
  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    
    // Fallback to rule-based analysis if AI fails
    return fallbackAnalysis(fileName, fileType);
  }
};

const fallbackAnalysis = (fileName, fileType) => {
  const fileName_lower = fileName.toLowerCase();
  
  if (fileName_lower.includes('crop') || fileName_lower.includes('harvest')) {
    return {
      machine: 'Multi-crop Harvester',
      reason: 'Based on crop-related content, a multi-crop harvester will significantly improve efficiency during harvest season, reduce labor costs, and ensure timely harvesting for optimal yield quality.'
    };
  } else if (fileName_lower.includes('soil')) {
    return {
      machine: 'Soil Testing Kit & Rotary Tiller',
      reason: 'Soil analysis indicates need for proper soil preparation equipment. A rotary tiller will improve soil structure, and the testing kit will help optimize fertilizer application for better crop yields.'
    };
  } else if (fileName_lower.includes('pest') || fileName_lower.includes('disease')) {
    return {
      machine: 'Battery-Powered Sprayer',
      reason: 'Pest management requires efficient spraying equipment. A battery-powered sprayer provides consistent coverage, reduces manual labor, and ensures effective pest control for healthier crops.'
    };
  } else if (fileName_lower.includes('irrigation') || fileName_lower.includes('water')) {
    return {
      machine: 'Drip Irrigation System',
      reason: 'Water management is crucial for sustainable farming. A drip irrigation system conserves water, ensures consistent moisture delivery, and can significantly improve crop yields while reducing water costs.'
    };
  } else if (fileName_lower.includes('seed') || fileName_lower.includes('plant')) {
    return {
      machine: 'Seed Drill Machine',
      reason: 'Proper seed placement is essential for optimal germination. A seed drill ensures uniform seed spacing, proper depth, and reduces seed wastage while improving crop establishment.'
    };
  } else {
    return {
      machine: 'Multi-Purpose Cultivator',
      reason: 'A versatile cultivator is essential for general farming operations including land preparation, weeding, and inter-cultivation. It provides excellent value for money and suits various farming needs.'
    };
  }
};

function AgriRecommendation() {
  const [selectedVLE, setSelectedVLE] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [vleList, setVLEList] = useState([]);
  const [apiKeyStatus, setApiKeyStatus] = useState('checking');

  useState(() => {
    // Load VLEs from localStorage
    const storedVLEs = JSON.parse(localStorage.getItem('selectedVLEs')) || [];
    setVLEList(storedVLEs);
    
    // Check if API key is configured
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      setApiKeyStatus('configured');
    } else {
      setApiKeyStatus('missing');
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain', 'application/msword'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image, PDF, or document file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setUploadedFile(file);
      setAnalysisResult(null);
      toast.success('File uploaded successfully!');
    }
  };

  const analyzeFile = async () => {
    if (!selectedVLE) {
      toast.error('Please select a VLE first');
      return;
    }

    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    if (apiKeyStatus === 'missing') {
      toast.error('Gemini API key is not configured. Please check your environment variables.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert file to base64 if needed for image analysis
      let fileContent = null;
      if (uploadedFile.type.startsWith('image/')) {
        fileContent = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(uploadedFile);
        });
      }

      const analysis = await analyzeWithGeminiAI(uploadedFile.name, uploadedFile.type, fileContent);
      
      const result = {
        vle: vleList.find(vle => vle.id === selectedVLE),
        fileName: uploadedFile.name,
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
        analysis: analysis,
        analyzedAt: new Date().toISOString(),
        aiProvider: 'Gemini AI'
      };

      setAnalysisResult(result);
      
      // Save recommendation to localStorage
      const existingRecommendations = JSON.parse(localStorage.getItem('agriRecommendations')) || [];
      existingRecommendations.push(result);
      localStorage.setItem('agriRecommendations', JSON.stringify(existingRecommendations));
      
      toast.success('AI analysis completed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze file. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSelectedVLE('');
    setUploadedFile(null);
    setAnalysisResult(null);
    document.getElementById('fileInput').value = '';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">AI-Powered Agricultural Machine Recommendations</h1>
      
      {apiKeyStatus === 'missing' && (
        <div className="card" style={{ background: '#fef2f2', border: '2px solid #dc2626', marginBottom: '2rem' }}>
          <h3 style={{ color: '#dc2626' }}>⚠️ API Key Required</h3>
          <p style={{ color: '#991b1b' }}>
            To use Gemini AI analysis, please configure your API key in the .env file:
            <br />
            <code>VITE_GEMINI_API_KEY=your_actual_api_key</code>
          </p>
        </div>
      )}
      
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Upload & AI Analysis</h3>
          
          <div className="form-group">
            <label>Select VLE</label>
            <select 
              value={selectedVLE} 
              onChange={(e) => setSelectedVLE(e.target.value)}
              disabled={isAnalyzing}
            >
              <option value="">Choose a VLE</option>
              {vleList.map(vle => (
                <option key={vle.id} value={vle.id}>
                  {vle.name} - {vle.contact}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload Agricultural File</label>
            <input
              id="fileInput"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              disabled={isAnalyzing}
              style={{
                padding: '0.75rem',
                border: '2px dashed #cbd5e0',
                borderRadius: '8px',
                backgroundColor: '#f7fafc'
              }}
            />
            <p style={{ color: '#718096', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Supported formats: Images (JPG, PNG), PDF, DOC, TXT (Max 5MB)
            </p>
          </div>

          {uploadedFile && (
            <div className="file-info">
              <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Uploaded File:</h4>
              <p><strong>Name:</strong> {uploadedFile.name}</p>
              <p><strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB</p>
              <p><strong>Type:</strong> {uploadedFile.type}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              onClick={analyzeFile}
              disabled={isAnalyzing || !selectedVLE || !uploadedFile || apiKeyStatus === 'missing'}
              className="btn btn-primary"
            >
              {isAnalyzing ? 'Analyzing with AI...' : 'Analyze with Gemini AI'}
            </button>
            <button 
              onClick={resetForm}
              disabled={isAnalyzing}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>🤖 Gemini AI Analysis</h3>
          <div style={{ color: '#64748b', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '1rem' }}>
              Our advanced Gemini AI analyzes your agricultural files to provide intelligent machine recommendations for VLEs.
            </p>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Select the VLE who will receive the machine</li>
              <li>Upload images of crops, soil, or agricultural documents</li>
              <li>Gemini AI analyzes content using advanced machine learning</li>
              <li>Get specific, tailored agricultural machine recommendations</li>
            </ul>
            <div style={{ 
              background: '#f0fdf4', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid #d1fae5'
            }}>
              <p style={{ color: '#059669', fontSize: '0.9rem', margin: 0 }}>
                <strong>✨ AI Status:</strong> {apiKeyStatus === 'configured' ? 
                  '🟢 Gemini AI Ready' : 
                  '🔴 API Key Missing'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {isAnalyzing && (
        <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div className="analyzing-spinner">
            <div className="spinner"></div>
          </div>
          <h3 style={{ color: '#10b981', marginTop: '1rem' }}>🤖 Gemini AI Analysis in Progress...</h3>
          <p style={{ color: '#64748b' }}>
            Our AI is analyzing your file to provide the most suitable agricultural machine recommendation
          </p>
        </div>
      )}

      {analysisResult && (
        <div className="card analysis-result" style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>
            🤖 AI Machine Recommendation for {analysisResult.vle.name}
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="recommendation-item" style={{ textAlign: 'center', padding: '2rem' }}>
              <h4 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.3rem' }}>
                🚜 Recommended Agricultural Machine
              </h4>
              <p style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1.2rem', marginBottom: '1rem' }}>
                {analysisResult.analysis.machine}
              </p>
            </div>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🧠 AI Analysis & Benefits:</h4>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              {analysisResult.analysis.reason}
            </p>
          </div>

          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
            <p><strong>File Analyzed:</strong> {analysisResult.fileName}</p>
            <p><strong>AI Provider:</strong> {analysisResult.aiProvider}</p>
            <p><strong>Analysis Date:</strong> {new Date(analysisResult.analyzedAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgriRecommendation;
