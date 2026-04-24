import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { petitionsService } from '../../services/petitionsService.js';
import './PetitionDetailsPage.css';

function PetitionDetailsPage() {
  const { id } = useParams();
  const [petition, setPetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPetition = async () => {
      if (!id) {
        setError('Brak id petycji');
        setIsLoading(false);
        return;
      }

      try {
        setError('');
        setIsLoading(true);
        const data = await petitionsService.getPetitionById(id);
        const p = Array.isArray(data) ? data[0] : data;
        setPetition(p);
      } catch {
        setError('Nie udało się pobrać petycji');
        setPetition(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPetition();
  }, [id]);

  const handleSignPetition = async () => {
    if (!id) return;

    try {
      setError('');
      setIsSigning(true);
      const updatedPetition = await petitionsService.signPetition(id);
      setPetition(updatedPetition);
    } catch (err) {
      setError(err?.message || 'Nie udało się podpisać petycji');
    } finally {
      setIsSigning(false);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Ładowanie petycji...</div>;
  }

  if (error && !petition) {
    return (
      <div className="not-found-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!petition) {
    return <div className="not-found-container">Petycja nie została znaleziona.</div>;
  }

  const progressPercentage = Math.min((petition.votes / petition.goal) * 100, 100);
  const formattedDate = petition.createdAt
    ? new Date(petition.createdAt).toLocaleDateString('pl-PL')
    : 'Brak daty';
  const formattedDeadline = petition.deadline
    ? new Date(petition.deadline).toLocaleDateString('pl-PL')
    : 'Brak terminu';

  // Obliczanie czy petycja wygasła
  const isExpired = petition.deadline ? new Date(petition.deadline) < new Date() : false;

  return (
    <div className="petition-details-page">
      <main className="petition-container">
        {error && <div className="error-message">{error}</div>}

        <div className="petition-badges">
          <span className="badge category-badge">{petition.category || 'Ogólne'}</span>
          <span className={`badge status-badge ${isExpired ? 'expired' : 'active'}`}>
            {isExpired ? 'Zakończona' : 'Aktywna'}
          </span>
        </div>

        <header className="petition-header">
          <h1>{petition.title}</h1>
          <div className="author-info">
            <span className="author-name">Autor: {petition.authorDisplayName}</span>
            <span className="petition-separator">|</span>
            <span className="petition-date">Utworzono: {formattedDate}</span>
          </div>
        </header>

        <section className="petition-description">
          <div className="description-label">Opis petycji</div>
          {petition.longDescription}
        </section>

        <section className="petition-stats">
          <div className="stats-header">
            <span className="votes-count">{petition.votes}</span>
            <span className="votes-goal">z celu {petition.goal} głosów</span>
          </div>
          <div className="progress-bar-large">
            <div className="progress-fill-large" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="stats-footer">
            <div className="deadline-info">
              Termin zakończenia: <strong>{formattedDeadline}</strong>
            </div>
          </div>
        </section>

        <button
          className="sign-button"
          type="button"
          onClick={handleSignPetition}
          disabled={isSigning || isExpired}
        >
          {isSigning ? 'Podpisywanie...' : isExpired ? 'Petycja wygasła' : 'Podpisz petycję'}
        </button>
      </main>
    </div>
  );
}

export default PetitionDetailsPage;
