import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { petitionsService } from '../../services/petitionsService.js';
import './PetitionCreatePage.css';

function PetitionCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('100');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOrganization = authService.isOrganization();

  useEffect(() => {
    if (!isOrganization) {
      navigate('/');
    }
  }, [isOrganization, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await petitionsService.createPetition({
        title,
        description,
        target: Number(target),
        category,
        author: localStorage.getItem('username') || 'Organizacja',
      });
      navigate('/');
    } catch (submitError) {
      console.error(submitError);
      setError('Nie udało się utworzyć petycji. Sprawdź dane i spróbuj ponownie.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="petition-create-page">
      <h1>Tworzenie nowej petycji</h1>
      <form className="petition-create-form" onSubmit={handleSubmit}>
        <label>
          Tytuł petycji
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Wpisz tytuł petycji"
          />
        </label>

        <label>
          Opis
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Opisz cel i przebieg petycji"
          />
        </label>

        <label>
          Cel głosów
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
            min="1"
            placeholder="Liczba głosów potrzebna do realizacji"
          />
        </label>

        <label>
          Kategoria
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Np. Ekologia, Edukacja, Zdrowie"
          />
        </label>

        {error && <p className="petition-create-error">{error}</p>}

        <button type="submit" className="nav-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Tworzę petycję...' : 'Utwórz petycję'}
        </button>
      </form>
    </div>
  );
}

export default PetitionCreatePage;
