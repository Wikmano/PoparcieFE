import React from 'react';
import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  // If we don't know totalPages, we can at least show Next/Prev if we have items
  if (totalPages <= 1 && currentPage === 1) return null;

  const pages = [];
  if (totalPages && totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
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

      {/* If totalPages is unknown or we are not on the last page */}
      <button
        disabled={totalPages ? currentPage === totalPages : false}
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
