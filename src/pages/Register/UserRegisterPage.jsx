import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm.jsx';
import { authService } from '../../services/authService.js';
import { registerSchema } from '../../schemas/registerSchema.js';

function UserRegisterPage() {
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Zarejestruj się"
      schema={registerSchema}
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
          autoComplete: 'new-password',
        },
        {
          name: 'name',
          placeholder: 'Imię',
          autoComplete: 'given-name',
        },
        {
          name: 'surname',
          placeholder: 'Nazwisko',
          autoComplete: 'family-name',
        },
      ]}
      submitLabel="Zarejestruj się"
      submittingLabel="Rejestrowanie..."
      onSubmit={(data) => authService.register(data)}
      onSuccess={() => {
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }}
      errorMessage="Wystąpił błąd podczas rejestracji"
    />
  );
}

export default UserRegisterPage;
