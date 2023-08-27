import React, { useState } from 'react';
import './dropdownMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <div className="menu-toggle" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
       <ul>
            <li>le tue attivita</li>
            <li>impostazioni</li>
            <li>assistenza e supporto</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;

