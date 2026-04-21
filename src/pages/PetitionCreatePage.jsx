import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petitionsService } from '../services/petitionsService.js';
import './PetitionCreatePage.css';

function PetitionCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    goal: 10000,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoalSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      goal: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Temat petycji jest wymagany');
      }
      if (!formData.shortDescription.trim()) {
        throw new Error('Krótki opis petycji jest wymagany');
      }
      if (!formData.longDescription.trim()) {
        throw new Error('Pełny opis petycji jest wymagany');
      }

      const petitionData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        goal: formData.goal,
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
            <label>Cel zdobytych głosów</label>
            <div className="goal-selection">
              <button
                type="button"
                className={`goal-btn ${formData.goal === 10000 ? 'active' : ''}`}
                onClick={() => handleGoalSelect(10000)}
                disabled={loading}
              >
                10 000 głosów
              </button>
              <button
                type="button"
                className={`goal-btn ${formData.goal === 100000 ? 'active' : ''}`}
                onClick={() => handleGoalSelect(100000)}
                disabled={loading}
              >
                100 000 głosów
              </button>
            </div>
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
