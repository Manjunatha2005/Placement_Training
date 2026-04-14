import React from 'react';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div>
      <Navbar />
      <main className="home">
        <section className="hero">
          <h1>Welcome to Placement Training Platform</h1>
          <p>Prepare yourself for the best career opportunities</p>
          <button>Get Started</button>
        </section>
      </main>
    </div>
  );
}

export default Home;
