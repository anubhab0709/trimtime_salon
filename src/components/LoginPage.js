import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function ScissorCut({ cutting }) {
  return (
    <div className={`scissor-anim${cutting ? ' cutting' : ''}`}>
      <div className="scissor">
        <div className="scissor-blade blade1" />
        <div className="scissor-blade blade2" />
        <div className="scissor-handle" />
      </div>
    </div>
  );
}

function Loader({ shrink }) {
  return (
    <div className={`loader-container${shrink ? ' shrink' : ''}`}> 
      <div className="trimmer-loader">
        <div className="trimmer-head" />
        <div className="trimmer-body" />
        <div className="trimmer-brush" />
      </div>
    </div>
  );
}

export default function LoginPage({ onForgotPassword }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [cutting, setCutting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setCutting(true);
    setTimeout(() => {
      setShrink(true);
      setLoading(true);
      setCutting(false);
      setTimeout(() => {
        setLoading(false);
        setShrink(false);
        // Replace the login entry so Back doesn't return to it
        navigate('/home', { replace: true });
      }, 1200);
    }, 900);
  };

  return (
    <div className="auth-bg">
      <div className="auth-brand">TrimTime</div>
      <div className="auth-admin-heading">Salon Admin</div>
      <div className="auth-center">
        <div className="auth-glassbox">
          <h2 className="auth-title">Log In</h2>
          <div className="auth-subheading">Welcome back! Please sign in to manage your salon.</div>
          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="text"
              className="auth-input"
              placeholder="Registered Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`auth-btn${loading ? ' loading' : ''}${cutting ? ' cutting' : ''}`}
              disabled={loading || cutting}
            >
              {cutting ? <ScissorCut cutting={cutting} /> : loading ? <Loader shrink={shrink} /> : 'Log In'}
            </button>
          </form>
          <div className="auth-footer">
            <span
              className="auth-link"
              onClick={onForgotPassword}
            >Forgot Password?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
