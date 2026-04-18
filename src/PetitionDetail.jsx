import React from 'react';
import { useParams } from 'react-router-dom';
import './PetitionDetail.css';

// Mock data - w rzeczywistości pochodziłoby z API
const petitions = [
  {
    id: 1,
    title: 'Petycja o ochronę środowiska',
    author: 'Jan Kowalski',
    description: 'Szczegółowy opis petycji...',
    votes: 150,
    target: 500,
  },
  {
    id: 2,
    title: 'Petycja o lepsze drogi',
    author: 'Anna Nowak',
    description: 'Opis...',
    votes: 200,
    target: 400,
  },
  {
    id: 3,
    title: 'Petycja o edukację',
    author: 'Piotr Wiśniewski',
    description: 'Opis...',
    votes: 80,
    target: 300,
  },
  {
    id: 4,
    title: 'Petycja o zdrowie',
    author: 'Maria Zielińska',
    description: 'Opis...',
    votes: 120,
    target: 600,
  },
];

function PetitionDetail() {
  const { id } = useParams();
  const petition = petitions.find((p) => p.id === parseInt(id));

  if (!petition) {
    return <div>Petycja nie znaleziona</div>;
  }

  return (
    <main className="content">
      <h1>{petition.title}</h1>
      <p>Autor: {petition.author}</p>
      <p>{petition.description}</p>
      <p>
        Głosy: {petition.votes} / {petition.target}
      </p>
      <button>Podpisz petycję</button>
    </main>
  );
}

export default PetitionDetail;
