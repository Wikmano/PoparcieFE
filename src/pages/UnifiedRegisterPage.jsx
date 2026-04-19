import React, { useState } from 'react';
import RegisterPage from './Register/RegisterPage.jsx';
import OrganizationsPage from './Organizations/OrganizationsPage.jsx';
import './AuthSelection.css';

function UnifiedRegisterPage() {
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
        {activeTab === 'user' ? <RegisterPage /> : <OrganizationsPage />}
      </div>
    </div>
  );
}

export default UnifiedRegisterPage;
