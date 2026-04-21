import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petitionsService } from '../services/petitionsService.js';
import './PetitionCreatePage.css';

function PetitionCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetSignatures: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Temat petycji jest wymagany');
      }
      if (!formData.description.trim()) {
        throw new Error('Opis petycji jest wymagany');
      }
      if (!formData.targetSignatures || formData.targetSignatures <= 0) {
        throw new Error('Liczba docelowych podpisów musi być większa niż 0');
      }

      const petitionData = {
        title: formData.title,
        description: formData.description,
        targetSignatures: parseInt(formData.targetSignatures, 10),
      };

      const response = await petitionsService.createPetition(petitionData);
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
            <label htmlFor="description">Opis petycji</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Opisz szczegółowo swoją petycję"
              rows="6"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetSignatures">Liczba docelowych podpisów</label>
            <input
              type="number"
              id="targetSignatures"
              name="targetSignatures"
              value={formData.targetSignatures}
              onChange={handleChange}
              placeholder="Wprowadź liczbę docelowych podpisów"
              min="1"
              disabled={loading}
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
