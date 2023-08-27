import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import { useUser } from './UserContext';
import { auth, firestore } from './Firebase';

function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await auth.createUserWithEmailAndPassword(email, password);

      // Memorizza il nome utente, l'email e l'UID nella raccolta "Utenti" nel database Firestore
      await firestore.collection('Utenti').doc(response.user.uid).set({
        username: username,
        email: email,
        uid: response.user.uid, // Aggiungi l'UID dell'utente
      });

      setUser({ username, email }); // Aggiorna lo stato dell'utente nel contesto globale

      navigate('/login');
    } catch (error) {
      console.error('Errore durante la registrazione:', error.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h1>Registrati</h1>
        <label>
          Nome utente:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}

export default SignupPage;

