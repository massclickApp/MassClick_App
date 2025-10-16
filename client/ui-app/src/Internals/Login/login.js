import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authAction.js';


import { useNavigate } from 'react-router-dom';
import companyLogo from "../../assets/mclogo.png";

import './login.css'


export default function Login({ setIsAuthenticated }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [mode, setMode] = useState('light');
  const [showPassword, setShowPassword] = useState(false);



  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userName, password));
  };

 useEffect(() => {
    if (auth.user && auth.accessToken) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [auth, navigate, setIsAuthenticated]);

  return (
    <div className={`login-page ${mode}`}>
      <div className="login-left">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-area">
              <img src={companyLogo} alt="Company Logo" className="logo" />
            </div>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            >
              {mode === 'light' ? '🌙' : '☀️'}
            </button>
          </div>

          <h1>Sign in</h1>
          <p className="signup-text">
            New to company? <a href="#">Sign up!</a>
          </p>

          {auth.error && (
            <p className="error-msg">
              {auth.error.message || auth.error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Username
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </label>

            <label>
              Password
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </label>

            <div className="options-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={auth.loading}
            >
              {auth.loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <p className="footer-text">
            © MassClick {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Right side - Info Section */}
      <div className="login-right">
        <div className="info-text">
          <h2>Discover & Connect with Local Businesses Instantly</h2>
          <p>
            Your trusted search engine for restaurants, shops, and services worldwide.
          </p>
          <p>
            Explore reviews, ratings, contact details, and directions — all in one place.
          </p>
          <p>
            Bringing local businesses closer to you with a world-class experience.
          </p>
        </div>
      </div>
    </div>
  );
}
