import React, { useState } from 'react';
import './dropdownMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function DropdownMenu2() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <div className="menu-toggle" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faBell} />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>Notifica 1</li>
            <li>Notifica 2</li>
            <li>Notifica 3</li>
            <li>Apri tutte le notifiche</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu2;

