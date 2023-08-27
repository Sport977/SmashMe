import React, { useState } from 'react';
import './chatlist.css';

function DropdownMenu5({ options, selectedValue, onSelect }) {
  return (
    <div className="dropdown-container">
      <select value={selectedValue} onChange={(event) => onSelect(event.target.value)}>
        <option value="" disabled>
          Seleziona un utente
        </option>
        {options.map((option) => (
          <option key={option.uid} value={option.uid}>
            {option.username}
          </option>
        ))}
      </select>
    </div>
  );
}
export default DropdownMenu5;