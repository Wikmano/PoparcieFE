import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './schemas/authenticationSchema';
import { authService } from './api/authService';
import { useNavigate } from 'react-router-dom';

function OrganizationLogin() {
  const [serverResponse, setServerResponse] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerResponse(null);
    try {
      const response = await authService.login(data);
      setServerResponse({ status: response.status, message: response.message });

      if (response.status === 'success') {
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setServerResponse({
        status: 'error',
        message: error.response?.data?.message || 'Wystąpił błąd podczas logowania',
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>Zaloguj się do organizacji</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input {...register('username')} placeholder="Nazwa organizacji" />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>
        <div className="form-group">
          <input type="password" {...register('password')} placeholder="Hasło" />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>

      {serverResponse && (
        <div className={`message ${serverResponse.status}`}>{serverResponse.message}</div>
      )}
    </div>
  );
}

export default OrganizationLogin;
