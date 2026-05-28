import React from 'react';

export default function Service() {
  const services = [
    { title: 'Web Development', desc: 'Building responsive and modern websites.' },
    { title: 'Frontend Development', desc: 'React, HTML, CSS, JS, and more.' },
    { title: 'Backend Development', desc: 'Node.js, Express, Databases.' },
    { title: 'UI/UX Design', desc: 'Designing clean and interactive interfaces.' },
    { title: 'E-Commerce Websites', desc: 'Develop fully functional online stores with payment integration.' },
    { title: 'Mobile App Development', desc: 'Cross-platform apps using React Native or Flutter.' },
    { title: 'SEO & Digital Marketing', desc: 'Improve website ranking and visibility online.' },
    { title: 'Website Maintenance', desc: 'Bug fixes, updates, and performance optimization.' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My Services</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {services.map((service, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '20px',
              width: '220px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s',
            }}
          >
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
