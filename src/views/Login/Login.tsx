import './Login.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      console.log(response.data);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 5000);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', { username, password });
      console.log(response.data);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="login">
      <h2>Welcome to Login page</h2>
      <div>
        <div>Username:</div>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <div>Password:</div>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </div>

      {showSuccessPopup && (
        <div className="popup">
          <p>Registration successful!</p>
        </div>
      )}

      {showErrorPopup && (
        <div className="popup">
          <p color='red'>Login failed. Please check your username and password and try again.</p>
        </div>
      )}
    </div>
  );
};

export default Login;
