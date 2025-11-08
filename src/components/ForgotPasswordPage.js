import React, { useState, useRef } from 'react';
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

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [cutting, setCutting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleSendOtp = (e) => {
    e.preventDefault();
    setSendingOtp(true);
    setTimeout(() => {
      setSendingOtp(false);
      setOtpSent(true);
      otpRefs[0].current && otpRefs[0].current.focus();
    }, 1500);
  };

  const handleOtpChange = (i, val) => {
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[i] = val;
      setOtp(newOtp);
      if (val && i < 3) otpRefs[i + 1].current.focus();
      if (!val && i > 0) otpRefs[i - 1].current.focus();
    }
  };

  const handleRecover = (e) => {
    e.preventDefault();
    setCutting(true);
    setTimeout(() => {
      setShrink(true);
      setLoading(true);
      setCutting(false);
      setTimeout(() => {
        setLoading(false);
        setShrink(false);
        onBackToLogin();
      }, 1200);
    }, 900);
  };

  return (
    <div className="auth-bg">
      <div className="auth-brand">TrimTime</div>
      <div className="auth-admin-heading">Salon Admin</div>
      <div className="auth-center">
        <div className="auth-glassbox">
          <h2 className="auth-title">Recover Account</h2>
          <div className="auth-subheading">Enter your details to reset your password.</div>
          <form className="auth-form" onSubmit={otpSent ? handleRecover : handleSendOtp}>
            <input
              type="text"
              className="auth-input"
              placeholder="Registered Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              disabled={otpSent}
            />
            {!otpSent && (
              <button
                type="submit"
                className={`auth-btn${sendingOtp ? ' loading' : ''}`}
                disabled={sendingOtp || !phone}
                style={{marginBottom: '0.5rem'}}
              >
                {sendingOtp ? <Loader shrink={sendingOtp} /> : 'Send OTP'}
              </button>
            )}
            {otpSent && (
              <>
                <div className="otp-section">
                  {otp.map((v, i) => (
                    <input
                      key={i}
                      type="text"
                      className="otp-input"
                      maxLength={1}
                      value={v}
                      ref={otpRefs[i]}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      required
                    />
                  ))}
                </div>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="New Password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Confirm Password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className={`auth-btn${loading ? ' loading' : ''}${cutting ? ' cutting' : ''}`}
                  disabled={loading || cutting}
                >
                  {cutting ? <ScissorCut cutting={cutting} /> : loading ? <Loader shrink={shrink} /> : 'Recover Account'}
                </button>
              </>
            )}
          </form>
          <div className="auth-footer">
            <span className="auth-link" onClick={onBackToLogin}>Back to Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}
