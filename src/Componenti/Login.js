import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import { useUser } from './UserContext';
import { auth, firestore } from './Firebase';
import { isEmail } from 'validator';

function LoginPage() {
  const navigate = useNavigate();
  const { handleLogin } = useUser(); // Utilizza la funzione handleLogin dal contesto

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validazione dell'email
    if (!isEmail(username)) {
      setEmailError('Email non valida');
      return;
    }

    // Reset dell'eventuale messaggio di errore precedente se l'email è valida
    setEmailError('');

    try {
      // Esegui il login utilizzando l'API di autenticazione di Firebase
      const response = await auth.signInWithEmailAndPassword(username, password);

      // Utilizza la funzione handleLogin dal contesto per gestire il login e aggiornare lo stato dell'utente
      handleLogin(response.user.email);
     
      const user = auth.currentUser;
       const token = await user.getIdToken();
      console.log(token)
      
      // Verifica se l'utente ha già memorizzato i suoi dati nel database
      const docRef = firestore.collection('profili').doc(response.user.uid);
      docRef.get().then((snapshot) => {
        if (snapshot.exists) {
          // L'utente ha già un profilo nel database. Reindirizzalo alla pagina "DettagliProfilo"
          navigate('/dettagliProfilo');
        } else {
          // L'utente non ha ancora un profilo nel database. Reindirizzalo alla pagina "PaginaDelProfilo"
          navigate('/paginaDelProfilo');
        }
      }).catch((error) => {
        console.error('Errore durante il recupero del profilo:', error.message);
      });
    } catch (error) {
      console.error('Errore durante il login:', error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>
          Email:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button type="submit">Accedi</button>
        <div className="signup-section">
          <p>Non hai ancora un account?</p>
          <Link to="/signup" className="signup-link">Registrati</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
