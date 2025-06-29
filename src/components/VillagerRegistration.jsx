import { useState } from 'react';
import { toast } from 'react-toastify';

function VillagerRegistration() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.age || !formData.contact) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Save to localStorage
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
    
    // Reset form
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
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Register Villager</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
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
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Education Level</label>
            <select name="education" value={formData.education} onChange={handleChange}>
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
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Monthly Income (₹)</label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Family Size</label>
            <input
              type="number"
              name="familySize"
              value={formData.familySize}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Skills & Interests</label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows="3"
            placeholder="e.g., farming, handicrafts, tailoring, etc."
          />
        </div>

        <div className="form-group">
          <label>Previous Business Experience</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="3"
            placeholder="Describe any previous business or entrepreneurial experience"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Register Villager
        </button>
      </form>
    </div>
  );
}

export default VillagerRegistration;
