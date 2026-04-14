import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function Resume() {
  const [resume, setResume] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value });
  };

  const handleDownload = () => {
    // Generate and download resume
    console.log('Downloading resume...');
  };

  return (
    <div>
      <Navbar />
      <main className="resume-page">
        <h2>Resume Builder</h2>
        <form className="resume-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={resume.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={resume.email}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={resume.phone}
            onChange={handleInputChange}
          />
          <textarea
            name="summary"
            placeholder="Professional Summary"
            value={resume.summary}
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleDownload}>Download Resume</button>
        </form>
      </main>
    </div>
  );
}

export default Resume;
