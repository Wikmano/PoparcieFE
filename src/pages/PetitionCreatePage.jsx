import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petitionsService } from '../services/petitionsService.js';
import './PetitionCreatePage.css';
import { PETITION_CATEGORIES } from '../../src/infrastructure/categories.js';

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
    if (!formData.title.trim()) {
      throw new Error('Temat petycji jest wymagany');
    }
    if (!formData.shortDescription.trim()) {
      throw new Error('Krótki opis petycji jest wymagany');
    }
    if (!formData.longDescription.trim()) {
      throw new Error('Pełny opis petycji jest wymagany');
    }
    if (!formData.category.trim()) {
      throw new Error('Kategoria petycji jest wymagana');
    }
    if (!formData.deadline) {
      throw new Error('Termin zakończenia petycji jest wymagany');
    }

    const parsedGoal = Number(formData.goal);

    if (!Number.isInteger(parsedGoal)) {
      throw new Error('Cel musi być liczbą całkowitą');
    }
    if (parsedGoal < 100 || parsedGoal > 100000) {
      throw new Error('Cel musi być w zakresie od 100 do 100 000');
    }
    if (parsedGoal % 100 !== 0) {
      throw new Error('Cel musi być podzielny przez 100');
    }

    const parsedDeadline = Date.parse(formData.deadline);
    if (Number.isNaN(parsedDeadline)) {
      throw new Error('Nieprawidłowy format daty terminu');
    }

    if (parsedDeadline + 86400000 <= Date.now()) {
      throw new Error('Termin zakończenia musi być w przyszłości');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      validateForm();

      const petitionData = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        longDescription: formData.longDescription.trim(),
        goal: Number(formData.goal),
        category: formData.category.trim(),
        deadline: new Date(formData.deadline).toISOString(),
      };

      await petitionsService.createPetition(petitionData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Błąd podczas tworzenia petycji');
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
