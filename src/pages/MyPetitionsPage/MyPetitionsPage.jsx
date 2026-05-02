import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petitionsService } from '../../services/petitionsService';
import PetitionCard from '../../components/PetitionCard/PetitionCard';
import './MyPetitionsPage.css';

const MyPetitionsPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPetitions = async () => {
      try {
        const response = await petitionsService.getMyPetitions();
        const data = response.data || response.petitions || [];
        setPetitions(data);
      } catch (err) {
        console.error('Error fetching my petitions:', err);
        setError('Nie udało się pobrać Twoich petycji.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPetitions();
  }, []);

  if (loading) return <div className="loading">Ładowanie panelu...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const totalViews = petitions.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalPetitions = petitions.length;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header-wrapper">
          <div className="dashboard-title-section">
            <h1>Panel Organizacji</h1>
          </div>
          <Link to="/petition/create" className="dashboard-create-btn">
            + Nowa petycja
          </Link>
        </div>

        <div className="dashboard-summary">
          <div className="summary-card">
            <div className="summary-icon icon-primary">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div className="summary-content">
              <h3>{totalViews.toLocaleString()}</h3>
              <p>Wszystkie wyświetlenia</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon icon-secondary">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <div className="summary-content">
              <h3>{totalPetitions}</h3>
              <p>Utworzone petycje</p>
            </div>
          </div>
        </div>

        {petitions.length === 0 ? (
          <div className="no-petitions">
            <h3>Brak petycji</h3>
            <p>Nie utworzyłeś jeszcze żadnych petycji.</p>
            <Link to="/petition/create" className="dashboard-create-btn">
              Utwórz petycję
            </Link>
          </div>
        ) : (
          <div className="dashboard-petitions-grid">
            {petitions.map((petition) => (
              <PetitionCard key={petition._id} petition={petition} variant="dashboard" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPetitionsPage;
