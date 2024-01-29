import './Login.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUsername } from '../../store/users/actionCreators';
import { AppState } from 'src/store';


interface IProps {
  updateUserLoginAction: (username: string) => void
}

const Login: React.FC<IProps> = ({ updateUserLoginAction }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(true);
  const [showRegPopup, setShowRegPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showErrorRegPopup, setShowErrorRegPopup] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [mode, setMode] = useState('login');


  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, { username, password });
      // const response = await axios.post('http://localhost:3001/login', { username, password });
      console.log(response.data);
      // updateUserLoginAction(username)
      updateUserLoginAction(response.data.username)
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
      if (password !== confirmPassword || username.trim() === "" || password.trim() === "" || username.includes(" ") || password.includes(" ")) {
        setShowErrorRegPopup(true);
        setTimeout(() => {
          setShowErrorRegPopup(false);
        }, 5000);
        return;
      }     
      // const response = await axios.post('http://localhost:3001/register', { username, password });
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, { username, password });
      console.log(response.data);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        handleToggleMode();
      }, 100);
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response.status == 401) {
        setErrMsg('duplicate username')
      } else {
        setErrMsg('failed to signup')
        handleToggleMode();
      }
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
        <div >
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
            <div >
              <p>Registration successful!</p>
            </div>
          )}

          {showErrorPopup && (
            <div >
              <p style={{ color: 'red' }}>
                Login failed.
              </p>
            </div>
          )}

        </div>
      )}

      {showRegPopup && (
        <div >
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
          {showErrorRegPopup && (
            <div >
              <p style={{ color: 'red' }}>
                Register failed. {errMsg}
              </p>
            </div>
          )}

          <div>
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleToggleMode}>Back</button>
          </div>
        </div>
      )}

    </div>
  );
}

const mapDispatchToProps = {
  updateUserLoginAction: updateUsername
};

const mapStateToProps = (state: AppState) => ({

});

// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Login);
