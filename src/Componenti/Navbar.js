import React, { useState } from 'react';
import './Navbar.css';
import DropdownMenu from './DropdownMenu';
import DropdownMenu2 from './DropdownMenu2';
import DropdownMenu3 from './DropdownMenu3';
import Dropdownmenu4 from './Dropdownmenu4';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Importa useSelector dal pacchetto react-redux


function Navbar() {
  const [showMenu] = useState(false);
  const fotoProfilo = useSelector((state) => state.fotoProfilo); // Accesso diretto allo stato fotoProfilo dallo store
  const currentUser = useSelector((state) => state.currentUser);
  
  
  return (
    <div className="navbar">
      <DropdownMenu showMenu={showMenu} />
      <h1>
        <Link to="/">SMASHME</Link>
      </h1>
      <DropdownMenu2 showMenu={showMenu} />
      <DropdownMenu3 showMenu={showMenu} />
      <Dropdownmenu4 showMenu={showMenu} currentUser={currentUser} />
      <div className="login-button">
        {fotoProfilo ? ( // Controlla se esiste l'immagine del profilo
          // Se l'immagine del profilo è disponibile, visualizzala
          <Link to="/DettagliProfilo">
            <div className="profile-image">
              <img src={fotoProfilo} alt="Fotoprofilo" />
            </div>
          </Link>
        ) : (
          // Altrimenti, mostra il link di login
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;





