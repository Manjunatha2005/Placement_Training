import React, { useState } from 'react';

function CodeEditor({ problem }) {
  const [code, setCode] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    // Submit code for evaluation
    console.log('Code submitted:', code);
  };

  return (
    <div className="code-editor">
      <h3>{problem?.title}</h3>
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Write your code here..."
        rows="15"
        cols="50"
      />
      <button onClick={handleSubmit}>Submit Code</button>
    </div>
  );
}

export default CodeEditor;
