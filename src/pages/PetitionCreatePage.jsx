import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petitionsService } from '../services/petitionsService.js';
import './PetitionCreatePage.css';
import { PETITION_CATEGORIES } from '../constants/categories.js';
import { petitionSchema } from '../schemas/petitionSchema.js';

function PetitionCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    goal: 10000,
    category: '',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'goal') {
      const numericValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        goal: Number.isNaN(numericValue) ? value : numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const result = petitionSchema.safeParse({
      ...formData,
      goal: Number(formData.goal),
    });

    if (!result.success) {
      throw result.error;
    }

    const parsedDeadline = Date.parse(formData.deadline);
    if (parsedDeadline + 86400000 <= Date.now()) {
      throw new Error('Termin zakończenia musi być w przyszłości');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Dane formularza przed walidacją:', formData);
      // 1. Walidacja danych przez Zod (zdefiniowana w petitionSchema)
      validateForm();

      const petitionData = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        longDescription: formData.longDescription.trim(),
        goal: Number(formData.goal),
        category: formData.category.trim(),
        deadline: new Date(formData.deadline).toISOString(),
      };

      console.log('Wysyłanie danych do API:', petitionData);

      // 2. Próba wysłania danych do API
      await petitionsService.createPetition(petitionData);
      navigate('/');
    } catch (err) {
      console.error('Szczegóły błędu:', err);

      const getErrorMessage = (obj) => {
        if (!obj) return null;

        // Jeśli to tekst, spróbuj sparsować jako JSON
        if (typeof obj === 'string') {
          const trimmed = obj.trim();
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
              return getErrorMessage(JSON.parse(trimmed));
            } catch {
              return trimmed;
            }
          }
          return obj;
        }

        // Jeśli to tablica, połącz błędy
        if (Array.isArray(obj)) {
          return obj
            .map((item) => getErrorMessage(item))
            .filter(Boolean)
            .join(', ');
        }

        // Jeśli to obiekt, szukaj pola z wiadomością
        if (typeof obj === 'object') {
          // Kolejność szukania pól z błędem
          const foundMsg =
            obj.message ||
            obj.msg ||
            obj.error ||
            (obj.errors ? getErrorMessage(obj.errors) : null);
          if (foundMsg && typeof foundMsg === 'string') return foundMsg;
          if (foundMsg && typeof foundMsg === 'object') return getErrorMessage(foundMsg);

          // Jeśli nic nie znaleziono, a to obiekt błędu Zod
          if (obj.issues) return getErrorMessage(obj.issues);

          return JSON.stringify(obj);
        }

        return String(obj);
      };

      // Próbujemy wyciągnąć wiadomość z różnych źródeł (najpierw dane z serwera, potem błędy walidacji, na końcu ogólny message)
      const errorData = err.response?.data || err.errors || err.issues || err;
      const finalMsg = getErrorMessage(errorData);

      setError(finalMsg || 'Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="petition-create-container">
      <div className="petition-create-card">
        <h1>Utwórz nową petycję</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="petition-form">
          <div className="form-group">
            <label htmlFor="title">Temat petycji</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Wprowadź temat petycji"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="shortDescription">Krótki opis</label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Krótki opis widoczny na liście petycji"
              rows="2"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="longDescription">Pełny opis petycji</label>
            <textarea
              id="longDescription"
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              placeholder="Opisz szczegółowo swoją petycję, argumentację i cele"
              rows="8"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategoria</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Wybierz kategorię</option>
              {PETITION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="goal">Cel zdobytych głosów</label>
            <input
              type="number"
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Np. 1500"
              min={100}
              max={100000}
              step={100}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-btn"
              disabled={loading}
            >
              Anuluj
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Tworzenie...' : 'Utwórz petycję'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PetitionCreatePage;
