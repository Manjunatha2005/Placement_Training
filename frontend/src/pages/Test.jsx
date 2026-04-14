import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TestCard from '../components/TestCard';

function Test() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    // Fetch available tests
    // setTests(data);
  }, []);

  return (
    <div>
      <Navbar />
      <main className="tests-page">
        <h2>Available Tests</h2>
        <div className="tests-grid">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Test;
