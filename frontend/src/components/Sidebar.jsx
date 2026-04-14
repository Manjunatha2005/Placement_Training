import React from 'react';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/courses">My Courses</a></li>
          <li><a href="/test">My Tests</a></li>
          <li><a href="/coding">Coding Challenges</a></li>
          <li><a href="/resume">Resume Builder</a></li>
          <li><a href="/chat">Chat Support</a></li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
