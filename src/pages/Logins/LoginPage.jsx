import React from 'react';
import UserLoginPage from './UserLoginPage.jsx';
import OrganizationLoginPage from './OrganizationLoginPage.jsx';
import AuthSelectionTabs from '../../components/Auth/AuthSelectionTabs.jsx';
import '../AuthSelection.css';

function LoginPage() {
  const tabs = [
    {
      id: 'user',
      label: 'Użytkownik',
      content: <UserLoginPage />,
    },
    {
      id: 'organization',
      label: 'Organizacja',
      content: <OrganizationLoginPage />,
    },
  ];

  return <AuthSelectionTabs tabs={tabs} defaultTabId="user" />;
}

export default LoginPage;
