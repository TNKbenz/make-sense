import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleCreateProjectClick = () => {
    navigate('/');
    // ใส่โค้ดที่คุณต้องการเมื่อคลิกปุ่ม "Create Project" ที่นี่
  };

  const handleOpenProjectClick = () => {
    navigate('/');
    // ใส่โค้ดที่คุณต้องการเมื่อคลิกปุ่ม "Open Project" ที่นี่
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome to Home Page</h2>
      <button onClick={handleCreateProjectClick}>Create Project</button>
      <br />
      <button onClick={handleOpenProjectClick}>Open Project</button>
    </div>
  );
};

export default Home;

