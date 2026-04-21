import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { petitionsService } from '../../services/petitionsService.js';

function PetitionDetailsPage() {
  const { id } = useParams();
  const [petition, setPetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPetition = async () => {
      if (!id) {
        if (isMounted) {
          setError('Brak id petycji');
          setIsLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setError('');
          setIsLoading(true);
        }
        const data = await petitionsService.getPetitionById(id);
        if (isMounted) {
          setPetition(data);
        }
      } catch {
        if (isMounted) {
          setError('Nie udalo sie pobrac petycji');
          setPetition(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPetition();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSignPetition = async () => {
    if (!id || isSigning) {
      return;
    }

    try {
      setError('');
      setIsSigning(true);
      const updatedPetition = await petitionsService.signPetition(id);
      setPetition(updatedPetition);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie podpisac petycji');
    } finally {
      setIsSigning(false);
    }
  };

  if (isLoading) {
    return <div className="mx-auto w-full max-w-6xl px-4 py-8">Ladowanie...</div>;
  }

  if (error) {
    return <div className="mx-auto w-full max-w-6xl px-4 py-8 text-red-600">{error}</div>;
  }

  if (!petition && !isLoading) {
    return <div className="mx-auto w-full max-w-6xl px-4 py-8">Petycja nie znaleziona</div>;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 text-left">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <section className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">{petition.title}</h1>
          <p className="mt-2 text-sm text-slate-500">Autor: {petition.author}</p>
          <p className="mt-6 whitespace-pre-line text-base leading-7 text-slate-700">
            {petition.description}
          </p>
        </section>

        <aside className="w-full rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm lg:w-72">
          <p className="text-xs uppercase tracking-wide text-slate-500">Kategoria</p>
          <p className="mt-1 text-base font-medium text-slate-900">{petition.category}</p>

          <p className="mt-4 text-sm text-slate-600">
            Głosy: {petition.votes} / {petition.goal}
          </p>

          <button
            type="button"
            onClick={handleSignPetition}
            disabled={isSigning}
            className="mt-7 nav-btn-primary"
          >
            {isSigning ? 'Podpisywanie...' : 'Podpisz petycje'}
          </button>
        </aside>
      </div>
    </main>
  );
}

export default PetitionDetailsPage;
