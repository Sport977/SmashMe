import React, { useState } from 'react';
import './dropdownMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Importiamo il componente Link
import Logout from './Logout'
function DropdownMenu3() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <div className="menu-toggle" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faUser} />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            {/* Utilizziamo il componente Link per creare un link al profilo */}
            <li>
              <Link to="/Paginadelprofilo">Il mio profilo</Link>
            </li>
            <li>
              <Link to="/login">Cambia profilo </Link>
              </li>
            <li> <Logout/></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu3;

