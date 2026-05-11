import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import {
  hashPassword,
  createPasskeySecret,
  createIdentity,
} from '../../services/identityService.js';
import './UserRegisterPage.css';

function UserRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);

  const handleMObywatelClick = async () => {
    try {
      setLoading(true);
      setError('');
      await authService.zkpRegister1();
      setStep(2);
    } catch {
      setError('Błąd podczas łączenia z serwerem (/register/1)');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdentity = async (secretString) => {
    try {
      setLoading(true);
      setError('');

      const identity = createIdentity(secretString);
      const commitment = identity.commitment.toString();

      await authService.zkpRegister2(commitment);

      // Clear memory
      setPassword('');

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Błąd podczas tworzenia tożsamości lub generowania klucza',
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyClick = async (attachment) => {
    try {
      setError('');
      const secret = await createPasskeySecret(attachment);
      await handleCreateIdentity(secret);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Błąd podczas tworzenia Passkey');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Hasło nie może być puste');
      return;
    }
    if (password.length < 12) {
      setError('Hasło musi mieć co najmniej 12 znaków');
      return;
    }
    try {
      const hashed = await hashPassword(password);
      await handleCreateIdentity(hashed);
    } catch {
      setError('Błąd podczas hashowania hasła');
    }
  };

  if (step === 1) {
    return (
      <div className="user-register-container">
        <h2>Rejestracja użytkownika</h2>
        <p>Rozpocznij proces rejestracji używając aplikacji mObywatel.</p>
        <button className="mobywatel-btn" onClick={handleMObywatelClick} disabled={loading}>
          {loading ? 'Przetwarzanie...' : 'Zarejestruj z mObywatel'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="user-register-container">
      <h2>Zabezpiecz swoją tożsamość</h2>
      <p>Utwórz tożsamość, aby móc bezpiecznie i anonimowo podpisywać petycje.</p>

      {!usePassword ? (
        <div
          className="passkey-options"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <button
            className="passkey-btn"
            onClick={() => handlePasskeyClick('platform')}
            disabled={loading}
            style={{ backgroundColor: '#0f766e' }}
          >
            {loading ? 'Przetwarzanie...' : 'Windows Hello / Biometria'}
          </button>
          <button
            className="passkey-btn"
            onClick={() => handlePasskeyClick('security-key')}
            disabled={loading}
            style={{ backgroundColor: '#1e40af' }}
          >
            {loading ? 'Przetwarzanie...' : 'Klucz sprzętowy (U2F/Yubikey)'}
          </button>
          <button
            className="passkey-btn"
            onClick={() => handlePasskeyClick('hybrid')}
            disabled={loading}
            style={{ backgroundColor: '#6d28d9' }}
          >
            {loading ? 'Przetwarzanie...' : 'Kod QR / Telefon (Wymagany Bluetooth)'}
          </button>
          <button
            className="passkey-btn"
            onClick={() => setUsePassword(true)}
            disabled={loading}
            style={{ backgroundColor: '#64748b', marginTop: '10px' }}
          >
            Chcę użyć tradycyjnego hasła
          </button>
        </div>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <input
            type="password"
            placeholder="Wprowadź silne hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Przetwarzanie...' : 'Utwórz tożsamość'}
          </button>
          <button
            type="button"
            className="passkey-btn"
            onClick={() => setUsePassword(false)}
            disabled={loading}
            style={{ backgroundColor: '#6366f1', marginTop: '10px' }}
          >
            Wróć do opcji Passkeys
          </button>
        </form>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default UserRegisterPage;
