import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch all courses
    // setCourses(data);
  }, []);

  return (
    <div>
      <Navbar />
      <main className="courses-page">
        <h2>All Courses</h2>
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Courses;
