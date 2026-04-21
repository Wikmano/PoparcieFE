import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm.jsx';
import { authService } from '../../services/authService.js';
import { loginSchema } from '../../schemas/loginSchema.js';

function OrganizationLoginPage() {
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Zaloguj się do organizacji"
      schema={loginSchema}
      fields={[
        {
          name: 'username',
          placeholder: 'Nazwa organizacji',
          autoComplete: 'organization',
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Hasło',
          autoComplete: 'current-password',
        },
      ]}
      submitLabel="Zaloguj się"
      submittingLabel="Logowanie..."
      onSubmit={async (data) => await authService.login(data)}
      onSuccess={() => {
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      }}
      errorMessage="Wystąpił błąd podczas logowania"
    />
  );
}

export default OrganizationLoginPage;
