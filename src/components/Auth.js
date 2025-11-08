import React, { useState } from 'react';
import PullPage from './PullPage';
import LoginPage from './LoginPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import './Auth.css';

export default function AuthPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPull, setShowPull] = useState(true);
  
  return (
    <>
      {showPull ? (
        <PullPage onFinish={() => setShowPull(false)} />
      ) : showForgotPassword ? (
        <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />
      ) : (
        <LoginPage onForgotPassword={() => setShowForgotPassword(true)} />
      )}
    </>
  );
}
