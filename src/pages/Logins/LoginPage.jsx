import React from 'react';
import OrganizationLoginPage from './OrganizationLoginPage.jsx';
import AuthSelectionTabs from '../../components/Auth/AuthSelectionTabs.jsx';
import '../AuthSelection.css';

function LoginPage() {
  const tabs = [
    {
      id: 'organization',
      label: 'Organizacja',
      content: <OrganizationLoginPage />,
    },
  ];

  return <AuthSelectionTabs tabs={tabs} defaultTabId="organization" />;
}

export default LoginPage;
