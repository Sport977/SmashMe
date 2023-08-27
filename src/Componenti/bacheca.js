import React, { useState, useEffect } from 'react';
import './bacheca.css';
import { firestore, auth } from './Firebase';
import Feed from './feed'; // Importa il componente Feed

function Bacheca() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        firestore.collection('Utenti').doc(authUser.uid).get()
          .then((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              setUser({
                uid: authUser.uid,
                username: userData.username,
              });

              firestore.collection('profili').doc(authUser.uid).get()
                .then((profileDoc) => {
                  if (profileDoc.exists) {
                    const profileData = profileDoc.data();
                    setUser((prevUser) => ({
                      ...prevUser,
                      profileImage: profileData.fotoProfilo,
                    }));
                  }
                })
                .catch((error) => {
                  console.error('Errore durante il recupero dell\'immagine profilo:', error);
                });
            }
          })
          .catch((error) => {
            console.error('Errore durante il recupero del nome utente:', error);
          });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <h1 className="centered White-text">Che attività vuoi fare oggi?</h1>
      {user && <Feed user={user} />} {/* Utilizza il componente Feed */}
    </div>
  );
}

export default Bacheca;
