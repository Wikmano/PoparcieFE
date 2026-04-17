import React, { useState } from 'react';
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './schemas/authenticationSchema';
import { authService } from './api/authService';
import { ca, is } from 'zod/locales';

function Register() {
    const [serverMessage, setServerMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await authService.register(data);
            setServerMessage(response.message);
            if (response.status === 'success') {
            }
        } catch (error) {
            setServerMessage(error.response?.data?.message || 'Wystąpił błąd podczas rejestracji');
        }
    };

    return (
        <div className="auth-container">
            <h2>Zarejestruj się</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <input {...register('username')} placeholder="Nazwa użytkownika" />
                    {errors.username && <p className="error">{errors.username.message}</p>}
                </div>
                <div className="form-group">
                    <input type="password" {...register('password')} placeholder="Hasło" />
                    {errors.password && <p className="error">{errors.password.message}</p>}
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
                    {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
                </button>
            </form>
          
            {serverResponse &&(
                <div className={`message ${serverResponse.status}`}>
                    {serverResponse.message}
                </div>
            )}
        </div>
    );
}