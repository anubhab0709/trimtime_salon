import React, { useEffect } from 'react';
import './Auth.css';

export default function PullPage({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="pull-bg">
      <div className="pull-center">
        <div className="pull-logo-wrapper">
          <div className="pull-heading">TrimTime</div>
          <div className="pull-subheading">Salon Admin</div>
        </div>
      </div>
    </div>
  );
}
