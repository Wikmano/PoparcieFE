import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm.jsx';
import { authService } from '../../services/authService.js';
import { registerSchema } from '../../schemas/registerSchema.js';

function OrganizationsRegisterPage() {
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Zarejestruj organizację"
      schema={registerSchema}
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
      submitLabel="Zarejestruj organizację"
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

export default OrganizationsRegisterPage;
