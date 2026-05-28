import React from 'react';

export default function MyStudents() {
  const students = [
    { name: "Rahul Sharma", project: "E-Commerce Website", skills: "React, Node.js" },
    { name: "Priya Verma", project: "Portfolio Website", skills: "HTML, CSS, JavaScript" },
    { name: "Amit Kumar", project: "Online Course Dashboard", skills: "React, Spring Boot" },
    { name: "Neha Singh", project: "Weather App", skills: "JavaScript, API Integration" },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My Students</h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
        }}
      >
        {students.map((student, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '20px',
              width: '230px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ color: '#0077cc' }}>{student.name}</h3>
            <p><b>Project:</b> {student.project}</p>
            <p><b>Skills:</b> {student.skills}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
