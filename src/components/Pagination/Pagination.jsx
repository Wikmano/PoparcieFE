import React from 'react';
import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  // Simple pagination logic, showing all pages for now as per previous implementation
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="pagination-arrow"
        aria-label="Poprzednia strona"
      >
        &laquo;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-item ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="pagination-arrow"
        aria-label="Następna strona"
      >
        &raquo;
      </button>
    </div>
  );
}

export default Pagination;
