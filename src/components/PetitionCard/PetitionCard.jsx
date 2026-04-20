import React from 'react';
import { Link } from 'react-router-dom';
import './PetitionCard.css';

function PetitionCard({ petition }) {
  const progress = (petition.votes / petition.goal) * 100;

  return (
    <Link to={`/petition/${petition._id}`} className="petition-card">
      <h3>{petition.title}</h3>
      <p>Autor: {petition.authorDisplayName}</p>
      <p>{petition.shortDescription}</p>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p>
        {petition.votes} / {petition.goal} głosów
      </p>
    </Link>
  );
}

export default PetitionCard;
