import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './schemas/authenticationSchema';
import { authService } from './api/authService';
import { useNavigate } from 'react-router-dom';

function Organizations() {
  const [serverResponse, setServerResponse] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await authService.register(data);
      setServerResponse({ status: response.status, message: response.message });
      if (response.status === 'success') {
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      setServerResponse({
        status: 'error',
        message: error.response?.data?.message || 'Wystąpił błąd podczas rejestracji',
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>Zarejestruj organizację</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input {...register('username')} placeholder="Nazwa organizacji" />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>
        <div className="form-group">
          <input type="password" {...register('password')} placeholder="Hasło" />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        <div className="form-group">
          <input type="password" {...register('confirmPassword')} placeholder="Potwierdź hasło" />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
        </div>
        <div className="form-group">
          <input {...register('name')} placeholder="Imię" />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <input {...register('surname')} placeholder="Nazwisko" />
          {errors.surname && <p className="error">{errors.surname.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj organizację'}
        </button>
      </form>

      {serverResponse && (
        <div className={`message ${serverResponse.status}`}>{serverResponse.message}</div>
      )}
    </div>
  );
}

export default Organizations;
