import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import MainSelection from './components/MainSelection';
import VLEManagementSystem from './components/VLEManagementSystem';
import AgriRecommendation from './components/AgriRecommendation';
import BlankPage from './components/BlankPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainSelection />} />
            <Route path="/dashboard" element={<BlankPage />} />
            <Route path="/village-identification" element={<BlankPage />} />
            <Route path="/vle-management" element={<VLEManagementSystem />} />
            <Route path="/agri-recommendation" element={<AgriRecommendation />} />
            <Route path="/machine-outsources" element={<BlankPage />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;

