import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { z } from 'zod';
import AuthForm from '../../../../src/components/Auth/AuthForm.jsx';

const schema = z.object({
  username: z.string().min(1, 'Nazwa jest wymagana'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

const fields = [
  { name: 'username', placeholder: 'Nazwa użytkownika', autoComplete: 'username' },
  { name: 'password', type: 'password', placeholder: 'Hasło', autoComplete: 'current-password' },
];

describe('AuthForm', () => {
  it('should render the form title', () => {
    render(
      <AuthForm
        title="Zaloguj się"
        schema={schema}
        fields={fields}
        submitLabel="Zaloguj"
        submittingLabel="Logowanie..."
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText('Zaloguj się')).toBeInTheDocument();
  });

  it('should render all input fields', () => {
    render(
      <AuthForm
        title="Zaloguj się"
        schema={schema}
        fields={fields}
        submitLabel="Zaloguj"
        submittingLabel="Logowanie..."
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText('Nazwa użytkownika')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument();
  });

  it('should render the submit button with the correct label', () => {
    render(
      <AuthForm
        title="Test"
        schema={schema}
        fields={fields}
        submitLabel="Wyślij"
        submittingLabel="Wysyłanie..."
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Wyślij' })).toBeInTheDocument();
  });

  it('should show validation error for empty required field on submit', async () => {
    render(
      <AuthForm
        title="Test"
        schema={schema}
        fields={fields}
        submitLabel="Wyślij"
        submittingLabel="Wysyłanie..."
        onSubmit={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Wyślij' }));
    await waitFor(() => {
      expect(screen.getByText('Nazwa jest wymagana')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with form data when valid', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ status: 'success', message: 'OK' });
    render(
      <AuthForm
        title="Test"
        schema={schema}
        fields={fields}
        submitLabel="Wyślij"
        submittingLabel="Wysyłanie..."
        onSubmit={mockSubmit}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('Nazwa użytkownika'), {
      target: { value: 'jan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), {
      target: { value: 'haslo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Wyślij' }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ username: 'jan', password: 'haslo' });
    });
  });

  it('should show server error message when onSubmit throws', async () => {
    const mockSubmit = vi.fn().mockRejectedValue({
      response: { data: { message: 'Błąd serwera' } },
    });
    render(
      <AuthForm
        title="Test"
        schema={schema}
        fields={fields}
        submitLabel="Wyślij"
        submittingLabel="Wysyłanie..."
        onSubmit={mockSubmit}
        errorMessage="Błąd domyślny"
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('Nazwa użytkownika'), {
      target: { value: 'jan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), {
      target: { value: 'haslo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Wyślij' }));
    await waitFor(() => {
      expect(screen.getByText('Błąd serwera')).toBeInTheDocument();
    });
  });

  it('should show default error message when no server message is provided', async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    render(
      <AuthForm
        title="Test"
        schema={schema}
        fields={fields}
        submitLabel="Wyślij"
        submittingLabel="Wysyłanie..."
        onSubmit={mockSubmit}
        errorMessage="Błąd domyślny"
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('Nazwa użytkownika'), {
      target: { value: 'jan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), {
      target: { value: 'haslo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Wyślij' }));
    await waitFor(() => {
      expect(screen.getByText('Błąd domyślny')).toBeInTheDocument();
    });
  });
});
