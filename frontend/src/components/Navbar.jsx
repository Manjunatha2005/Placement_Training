import React from 'react';

function Navbar() {
  return (
    <nav>
      <div className="navbar">
        <h1>Placement Training</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/courses">Courses</a></li>
          <li><a href="/test">Tests</a></li>
          <li><a href="/coding">Coding</a></li>
          <li><a href="/chat">Chat</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
