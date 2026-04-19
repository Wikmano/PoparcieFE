import React from 'react';
import UserRegisterPage from './UserRegisterPage.jsx';
import OrganizationsRegisterPage from './OrganizationsRegisterPage.jsx';
import AuthSelectionTabs from '../../components/Auth/AuthSelectionTabs.jsx';
import '../AuthSelection.css';

function UnifiedRegisterPage() {
  const tabs = [
    {
      id: 'user',
      label: 'Użytkownik',
      content: <UserRegisterPage />,
    },
    {
      id: 'organization',
      label: 'Organizacja',
      content: <OrganizationsRegisterPage />,
    },
  ];

  return <AuthSelectionTabs tabs={tabs} defaultTabId="user" />;
}

export default UnifiedRegisterPage;
