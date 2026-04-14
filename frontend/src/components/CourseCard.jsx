import React from 'react';

function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p className="progress">Progress: {course.progress}%</p>
      <button>View Course</button>
    </div>
  );
}

export default CourseCard;
