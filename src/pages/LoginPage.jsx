import React, { useState } from 'react';
import UserLoginPage from './UserLogin/UserLoginPage.jsx';
import OrganizationLoginPage from './OrganizationLogin/OrganizationLoginPage.jsx';
import './AuthSelection.css';

function LoginPage() {
  const [activeTab, setActiveTab] = useState('user');

  return (
    <div className="auth-selection-page">
      <div className="auth-tabs">
        <button 
          className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          Użytkownik
        </button>
        <button 
          className={`tab-btn ${activeTab === 'organization' ? 'active' : ''}`}
          onClick={() => setActiveTab('organization')}
        >
          Organizacja
        </button>
      </div>
      
      <div className="auth-content">
        {activeTab === 'user' ? <UserLoginPage /> : <OrganizationLoginPage />}
      </div>
    </div>
  );
}

export default LoginPage;
