import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';

function Coding() {
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);

  useEffect(() => {
    // Fetch coding problems
    // setProblems(data);
  }, []);

  return (
    <div>
      <Navbar />
      <main className="coding-page">
        <h2>Coding Challenges</h2>
        <div className="coding-container">
          <div className="problems-list">
            {problems.map((problem) => (
              <div key={problem.id} onClick={() => setCurrentProblem(problem)}>
                {problem.title}
              </div>
            ))}
          </div>
          {currentProblem && <CodeEditor problem={currentProblem} />}
        </div>
      </main>
    </div>
  );
}

export default Coding;
