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
        setPetition(data[0]); //it returns array of jsons and in this case there is only one
      } catch {
        setError('Nie udalo sie pobrac petycji');
        setPetition(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPetition();
  }, [id]);

  const handleSignPetition = async () => {
    if (!id) {
      return;
    }

    try {
      setError('');
      setIsSigning(true);
      const updatedPetition = await petitionsService.signPetition(id);
      setPetition(updatedPetition);
    } catch (err) {
      setError(err?.message || 'Nie udalo sie podpisac petycji');
    } finally {
      setIsSigning(false);
    }
  };

  if (isLoading) {
    return <div>Ladowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!petition) {
    return <div>Petycja nie znaleziona</div>;
  }

  return (
    <main className="content">
      <h1>{petition.title}</h1>
      <p>Autor: {petition.authorDisplayName}</p>
      <p>{petition.longDescription}</p>
      <p>
        Głosy: {petition.votes} / {petition.goal}
      </p>
      <button type="button" onClick={handleSignPetition} disabled={isSigning}>
        {isSigning ? 'Podpisywanie...' : 'Podpisz petycje'}
      </button>
    </main>
  );
}

export default PetitionDetailsPage;
