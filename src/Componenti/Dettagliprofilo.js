import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './dettagliprofilo.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { updateProfile } from '../actions';
import { firestore, auth } from './Firebase'; // Import 'auth' from Firebase
import { useNavigate } from 'react-router-dom';
import Post from './post'; // Assicurati di importare il componente Post

function DettagliProfilo() {
  const dispatch = useDispatch();
  const profilo = useSelector((state) => state);
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [userPostLikes, setUserPostLikes] = useState({});

  const caricaProfilo = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Utente non autenticato.');
        navigate('/');
        return;
      }

      const docRef = firestore.collection('profili').doc(user.uid);
      const snapshot = await docRef.get();
      if (snapshot.exists) {
        dispatch(updateProfile(snapshot.data()));
        const utenteDocRef = firestore.collection('Utenti').doc(user.uid);
        const utenteSnapshot = await utenteDocRef.get();
        if (utenteSnapshot.exists) {
          const utenteData = utenteSnapshot.data();
          dispatch(updateProfile({ username: utenteData.username }));
        }
      }
    } catch (error) {
      console.error('Errore durante il caricamento del profilo:', error.message);
    }
  };

  const caricaPostUtente = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Utente non autenticato.');
        return;
      }

      const querySnapshot = await firestore.collection('Posts')
        .where('userId', '==', user.uid)
        .get();

      const userPostsData = [];
      const userLikesData = {};

      querySnapshot.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };
        userPostsData.push(post);

        firestore.collection('Likes')
          .where('postId', '==', post.id)
          .get()
          .then((likeQuerySnapshot) => {
            const likes = [];
            likeQuerySnapshot.forEach((likeDoc) => {
              likes.push({ id: likeDoc.id, ...likeDoc.data() });
            });
            userLikesData[post.id] = likes;
          })
          .catch((error) => {
            console.error('Errore durante il recupero dei like:', error);
          });
      });

      setUserPosts(userPostsData);
      setUserPostLikes(userLikesData);
    } catch (error) {
      console.error('Errore durante il caricamento dei post dell\'utente:', error.message);
    }
  };

  useEffect(() => {
    caricaProfilo();
    caricaPostUtente();
  }, [dispatch]);
  console.log('userPosts:', userPosts);
  console.log('userPostLikes:', userPostLikes);

  function formatDate(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
    return formattedDate;
  }
  return (
    <>
      <Navbar />
      <div className='App'>
      <div className="container">
        <div className="profile-card">
          <div className="profile-picture">
            {profilo.fotoProfilo && <img src={profilo.fotoProfilo} alt="Profile" />}
          </div>
          <div className="profile-info">
            <h2>{profilo.username}</h2>
            <div className="label-container">
              <label>Nome:</label>
              <p>{profilo.nome}</p>
            </div>
            <div className="label-container">
              <label>Età:</label>
              <p>{profilo.eta}</p>
            </div>
            <div className="label-container">
              <label>Città:</label>
              <p>{profilo.citta}</p>
            </div>
            <div className="label-container">
              <label>Hobby:</label>
              <p>{profilo.hobby}</p>
            </div>
            <div className="label-container">
              <label>Interessi:</label>
              <p>{profilo.interessi}</p>
            </div>
          <div className="label-container">
            <label>Descrizione:</label>
            <p>{profilo.descrizione}</p>
          </div>
          </div>
        </div>
      </div>
      <div className='feed'>
      {userPosts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          text={post.text}
          location={post.location}
          username={post.username}
          profileImage={post.profileImage}
          radius={post.radius}
          searchingFor={post.searchingFor}
          time={post.time}
          date={new Date(post.date)} 
          likes={userPostLikes[post.id] || []}
          formatDate={formatDate}
        />
        
      ))}
      </div>
      </div>
      <Footer />
    </>
  );
}

export default DettagliProfilo;
