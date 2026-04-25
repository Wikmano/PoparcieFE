import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petitionsService } from '../services/petitionsService.js';
import './PetitionCreatePage.css';
import { PETITION_CATEGORIES } from '../../src/infrastructure/categories.js';
import { petitionSchema } from '../schemas/petitionSchema.js';
import { z } from 'zod';

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
      // 3. Rozpoznawanie typu błędu
      if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        // Błędy walidacji Zod (z przodu)
        setError(`Błąd walidacji: ${err.errors[0].message}`);
      } else if (err.response) {
        // Błędy zwrócone przez serwer (API)
        console.log('Dane błędu z serwera:', err.response.data);
        const serverMsg =
          err.response.data?.message ||
          err.response.data?.error ||
          (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data));
        setError(`Błąd serwera: ${serverMsg || 'Nieznany błąd serwera'}`);
      } else if (err.message) {
        // Błędy sieciowe lub rzucone ręcznie (np. deadline)
        setError(err.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Sprawdź konsolę.');
      }
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
