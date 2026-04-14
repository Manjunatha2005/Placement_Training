import React from 'react';

function TestCard({ test }) {
  return (
    <div className="test-card">
      <h3>{test.title}</h3>
      <p>Duration: {test.duration} minutes</p>
      <p>Questions: {test.questions}</p>
      <p>Status: {test.status}</p>
      <button>Take Test</button>
    </div>
  );
}

export default TestCard;
