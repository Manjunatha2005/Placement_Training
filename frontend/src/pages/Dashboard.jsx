import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CourseCard from '../components/CourseCard';

function Dashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch user's courses
    // setCourses(data);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <h2>Your Dashboard</h2>
          <section className="courses-section">
            <h3>Recent Courses</h3>
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
