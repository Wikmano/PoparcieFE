import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { petitionsService } from '../../services/petitionsService.js';
import { authService } from '../../services/authService.js';
import './PetitionDetailsPage.css';

function PetitionDetailsPage() {
  const { id } = useParams();
  const [petition, setPetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = authService.isAdmin();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');

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
        const p = data?.data ?? data;
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

  const handleDeleteClick = async () => {
    if (!petition) {
      return;
    }

    try {
      setIsSavingChanges(true);
      setAdminMessage('');
      const petitionId = petition._id ?? petition.id ?? id;
      await petitionsService.archivePetition(petitionId);

      setAdminMessage('Akcja została wykonana. Id: ' + petitionId);
    } catch (err) {
      setAdminMessage(err?.response?.data?.message || 'Nie udało się wykonać akcji.');
    } finally {
      setIsSavingChanges(false);
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

  let statusClass = 'active';
  let statusText = 'Aktywna';
  const statusLower = petition.status ? petition.status.toLowerCase() : '';

  if (statusLower === 'archived') {
    statusClass = 'archived';
    statusText = 'Zaarchiwizowana';
  } else if (statusLower === 'closed' || isExpired) {
    statusClass = 'closed';
    statusText = 'Zakończona';
  }

  const isArchived = statusLower === 'archived';
  const adminActionLabel = isArchived ? 'Przywróć' : 'Ukryj';
  const canSign = statusClass === 'active';

  return (
    <div className="petition-details-page">
      <main className="petition-container">
        {error && <div className="error-message">{error}</div>}

        <div className="petition-badges">
          <span className="badge category-badge">{petition.category || 'Ogólne'}</span>
          <span className={`badge status-badge ${statusClass}`}>{statusText}</span>
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

        {isAdmin && (
          <section className="admin-menu">
            <button
              className="admin-menu-toggle"
              type="button"
              onClick={() => setIsAdminMenuOpen((prevState) => !prevState)}
            >
              {isAdminMenuOpen ? 'Ukryj menu admina' : 'Pokaż menu admina'}
            </button>

            {isAdminMenuOpen && (
              <div className="admin-actions">
                <button
                  className="admin-action-button admin-delete-button"
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={isSavingChanges}
                  title={isArchived ? 'Przywróć petycję' : 'Ukryj petycję'}
                >
                  {isSavingChanges ? 'Przetwarzanie...' : adminActionLabel}
                </button>
              </div>
            )}

            {adminMessage && <div className="admin-message">{adminMessage}</div>}
          </section>
        )}

        <button
          className="sign-button"
          type="button"
          onClick={handleSignPetition}
          disabled={isSigning || !canSign}
        >
          {isSigning
            ? 'Podpisywanie...'
            : statusClass === 'archived'
              ? 'Petycja zaarchiwizowana'
              : statusClass === 'closed'
                ? 'Petycja wygasła'
                : 'Podpisz petycję'}
        </button>
      </main>
    </div>
  );
}

export default PetitionDetailsPage;
