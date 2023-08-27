import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './paginadelprofilo.css';
import { updateProfile } from '../actions';
import { firestore, auth, storage } from './Firebase'; // Importa anche il modulo di Firebase Storage

function PaginaDelProfilo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profilo = useSelector((state) => state);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateProfile({ ...profilo, [name]: value }));
  };

  const handleFotoProfiloChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Converti il file in un URL base64
      const fotoProfilo = reader.result;
      dispatch(updateProfile({ ...profilo, fotoProfilo }));
    };

    if (file) {
      // Leggi il file come URL base64
      reader.readAsDataURL(file);
    }
  };

  const salvaProfilo = async (event) => {
    event.preventDefault();

    // Altri controlli dei campi del profilo qui...

    try {
      // Verifica se l'utente è autenticato
      const user = auth.currentUser;
      if (!user) {
        console.error('Utente non autenticato. Impossibile salvare il profilo.');
        return;
      }

      // Ottieni il token di accesso dell'utente autenticato
      const token = await user.getIdToken();
      console.log(token)

      // Carica l'immagine del profilo in Firebase Storage
      if (profilo.fotoProfilo) {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`profilo/${user.uid}/fotoProfilo`);
        await imageRef.putString(profilo.fotoProfilo, 'data_url');
        // Ottieni l'URL dell'immagine appena caricata
        const imageURL = await imageRef.getDownloadURL();
        dispatch(updateProfile({ ...profilo, fotoProfilo: imageURL }));
      }

      // Salva il profilo nel database Firestore utilizzando l'indirizzo del documento corretto
      await firestore.collection('profili').doc(user.uid).set(
        {
          nome: profilo.nome,
          eta: profilo.eta,
          citta: profilo.citta,
          hobby: profilo.hobby,
          interessi: profilo.interessi,
          descrizione: profilo.descrizione,
          fotoProfilo: profilo.fotoProfilo,
        },
        { headers: { Authorization: `Bearer ${token}` } } // Passa il token di accesso come header per l'autenticazione Firestore
      );

      // Reindirizza l'utente alla pagina dei dettagli del profilo
      navigate('/dettagliProfilo');
    } catch (error) {
      console.error('Errore durante il salvataggio del profilo:', error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Profilo dell'utente</h1>
        <form className="profile-form" onSubmit={salvaProfilo}>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={profilo.nome}
              onChange={handleChange}
            />
          </label>
          <label>
            Età:
            <input
              type="text"
              name="eta"
              value={profilo.eta}
              onChange={handleChange}
            />
          </label>
          <label>
            Città:
            <input
              type="text"
              name="citta"
              value={profilo.citta}
              onChange={handleChange}
            />
          </label>
          <label>
            Hobby:
            <input
              type="text"
              name="hobby"
              value={profilo.hobby}
              onChange={handleChange}
            />
          </label>
          <label>
            Interessi:
            <input
              type="text"
              name="interessi"
              value={profilo.interessi}
              onChange={handleChange}
            />
          </label>
          <label>
            Descrizione:
            <textarea
              name="descrizione"
              value={profilo.descrizione}
              onChange={handleChange}
            />
          </label>
          <label>
            Foto del profilo:
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoProfiloChange}
            />
          </label>
          <button type="submit">Salva</button>
          {profilo.fotoProfilo && <img src={profilo.fotoProfilo} alt="Foto profilo" />}
        </form>
      </div>
      <Footer />
    </>
  );
}

export default PaginaDelProfilo;
