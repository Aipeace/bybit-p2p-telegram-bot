import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setAuthenticated(data.authenticated);
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="app"><div className="spinner"></div></div>;
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>💰 Bybit P2P Bot</h1>
          <p>Manage your P2P trades</p>
        </header>

        {authenticated ? (
          <div className="dashboard">
            <div className="balance-card">
              <h2>Account Balance</h2>
              <p className="balance-amount">$0.00</p>
            </div>

            <div className="menu">
              <button className="btn btn-primary">📢 My Ads</button>
              <button className="btn btn-primary">📦 My Orders</button>
              <button className="btn btn-primary">⏳ Pending Orders</button>
              <button className="btn btn-secondary">⚙️ Settings</button>
            </div>
          </div>
        ) : (
          <div className="login-box">
            <h2>🔐 Please Authenticate</h2>
            <p>Use the Telegram bot to authenticate with your Bybit credentials.</p>
            <p>Send <code>/auth</code> to the bot to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
