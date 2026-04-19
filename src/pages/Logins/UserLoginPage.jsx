import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm.jsx';
import { authService } from '../../services/authService.js';
import { loginSchema } from '../../schemas/loginSchema.js';

function UserLoginPage() {
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Zaloguj się"
      schema={loginSchema}
      fields={[
        {
          name: 'username',
          placeholder: 'Nazwa użytkownika',
          autoComplete: 'username',
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
      onSubmit={(data) => authService.login(data)}
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

export default UserLoginPage;
