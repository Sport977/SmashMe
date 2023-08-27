import React from 'react';
import { auth } from './Firebase'; // Assicurati di importare il modulo Firebase Auth correttamente
import { useUser } from './UserContext'; // Assicurati di importare il tuo hook useUser
import { useNavigate } from 'react-router-dom';
import { resetProfile } from '../actions.js';
import { firestore } from './Firebase';




  const LogoutButton = () => {
  const { dispatch } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Effettua il logout tramite Firebase
    auth.signOut().then(() => { 
        const profiliListener = firestore.collection('profili').onSnapshot(() => {});
        profiliListener();
  
        // Chiudi eventuali ascoltatori in corso su collezione "message"
        const messageListener = firestore.collection('messages').onSnapshot(() => {});
        messageListener();
    
        dispatch(resetProfile());
        navigate('/');
        window.location.reload(); 
    }).catch((error) => {
      // Gestisci eventuali errori durante il logout
      console.error('Errore durante il logout:', error);
      
    });
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
