import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { petitionsService } from '../../services/petitionsService';
import './PetitionCard.css';

function PetitionCard({ petition, hideAuthor, variant = 'default' }) {
  const [localStatus, setLocalStatus] = useState(petition.status);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);

  const progress = (petition.votes / petition.goal) * 100;
  const isDashboard = variant === 'dashboard';

  const translateStatus = (status) => {
    switch (status) {
      case 'active':
        return 'Aktywna';
      case 'closed':
        return 'Zamknięta';
      case 'archived':
        return 'Zarchiwizowana';
      default:
        return status || 'Nieznany';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const initiateArchive = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmingArchive(true);
  };

  const cancelArchive = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmingArchive(false);
  };

  const confirmArchive = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isArchiving) return;

    try {
      setIsArchiving(true);
      await petitionsService.archivePetition(petition._id);
      setLocalStatus('archived');
      setIsConfirmingArchive(false);
    } catch (err) {
      console.error('Błąd podczas archiwizacji:', err);
      alert('Nie udało się zarchiwizować petycji.');
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <Link
      to={`/petition/${petition._id}`}
      className={`petition-card ${isDashboard ? 'dashboard-variant' : ''}`}
    >
      <div className="petition-content">
        {isDashboard && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span
                className={`petition-status-badge status-${localStatus || 'active'}`}
                style={{ marginBottom: '4px' }}
              >
                {translateStatus(localStatus)}
              </span>
              {petition.deadline && (
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
                  Termin: {formatDate(petition.deadline)}
                </span>
              )}
            </div>
            {localStatus === 'active' && !isConfirmingArchive && (
              <button
                onClick={initiateArchive}
                className="archive-button-card"
                title="Zaarchiwizuj"
              >
                Zaarchiwizuj
              </button>
            )}
            {localStatus === 'active' && isConfirmingArchive && (
              <div className="archive-confirm-box">
                <span className="archive-confirm-text">Czy na pewno?</span>
                <button onClick={confirmArchive} disabled={isArchiving} className="archive-btn-yes">
                  {isArchiving ? '...' : 'Tak'}
                </button>
                <button onClick={cancelArchive} disabled={isArchiving} className="archive-btn-no">
                  Nie
                </button>
              </div>
            )}
          </div>
        )}
        <h3>{petition.title}</h3>
        {!hideAuthor && petition.authorDisplayName && !isDashboard && (
          <p className="petition-author">
            Autor: <strong>{petition.authorDisplayName}</strong>
          </p>
        )}
        {!isDashboard && <p className="petition-description">{petition.shortDescription}</p>}
      </div>

      <div className="petition-footer">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
        <div className="petition-stats">
          <span>
            <strong>{petition.votes}</strong> / {petition.goal} {isDashboard ? '' : 'głosów'}
          </span>
          {isDashboard && (
            <span className="views-stat">
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                style={{ marginRight: '4px' }}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {petition.views || 0}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PetitionCard;
