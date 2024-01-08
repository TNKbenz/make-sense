import './Login.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(true);
  const [showRegPopup, setShowRegPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showErrorRegPopup, setShowErrorRegPopup] = useState(false);
  const [mode, setMode] = useState('login');


  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, { username, password });
      console.log(response.data);
      navigate('/');
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
      if (password !== confirmPassword) {
        handleToggleMode();
        setShowErrorRegPopup(true);
        setTimeout(() => {
          setShowErrorRegPopup(false);
        }, 5000);
        return;
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, { username, password });
      console.log(response.data);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        handleToggleMode();
      }, 5000);
    } catch (error) {
      console.error('Registration failed:', error);
      handleToggleMode();
      setShowErrorRegPopup(true)
      setTimeout(() => {
        setShowErrorRegPopup(false);
      }, 5000);
    }
  };

  const handleToggleMode = () => {
    setShowLoginPopup((prevLoginMode) => (prevLoginMode === true ? false : true))
    setShowRegPopup((prevRegMode) => (prevRegMode === false ? true : false))
    setMode((prevMode) => (prevMode === 'login' ? 'register' : 'login'));
  };


  return (
    <div className="login">
      <h2>Welcome to {mode} page</h2>
      {showLoginPopup && (
        <div className="popup">
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
            <button onClick={handleToggleMode}>Sign up</button>
          </div>

          {showSuccessPopup && (
            <div className="popup">
              <p>Registration successful!</p>
            </div>
          )}

          {showErrorRegPopup && (
            <div className="popup">
              <p style={{ color: 'red' }}>
                Register failed.
              </p>
            </div>
          )}

          {showErrorPopup && (
            <div className="popup">
              <p style={{ color: 'red' }}>
                Login failed.
              </p>
            </div>
          )}

        </div>
      )}

      {showRegPopup && (
        <div className="popup">
          <div>
            <div>Username:</div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <div>Password:</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <div>Confirm Password:</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <button onClick={handleRegister}>Register</button>
          </div>
        </div>
      )}

    </div>
  );
}
export default Login;
