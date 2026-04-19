import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function AuthForm({
  title,
  schema,
  fields,
  submitLabel,
  submittingLabel,
  onSubmit,
  onSuccess,
  errorMessage = 'Wystąpił błąd podczas wysyłania formularza',
}) {
  const [serverResponse, setServerResponse] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data) => {
    setServerResponse(null);

    try {
      const response = await onSubmit(data);
      const nextResponse = {
        status: response?.status ?? 'success',
        message: response?.message ?? '',
      };

      setServerResponse(nextResponse);

      if (nextResponse.status === 'success' && onSuccess) {
        await onSuccess(response, data);
      }
    } catch (error) {
      setServerResponse({
        status: 'error',
        message: error.response?.data?.message || errorMessage,
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <input
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              {...register(field.name)}
            />
            {errors[field.name] && <p className="error">{errors[field.name].message}</p>}
          </div>
        ))}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </form>

      {serverResponse && (
        <div className={`message ${serverResponse.status}`}>{serverResponse.message}</div>
      )}
    </div>
  );
}

export default AuthForm;
