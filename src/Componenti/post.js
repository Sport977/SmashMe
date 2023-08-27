import React, { useState,useRef,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faCalendar, faArrowRight,faTimes } from '@fortawesome/free-solid-svg-icons';
import './post.css';
import { firestore, auth } from './Firebase';
import { Link } from 'react-router-dom';





function Post({ text, location, username, profileImage, radius, searchingFor, time, date,id }) {
    function formatDate(timestamp) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString(undefined, options);
      return formattedDate;
    }
    const [isLiked, setIsLiked] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(null);
    const [initialPosition, setInitialPosition] = useState(0);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [cancelIconActive, setCancelIconActive] = useState(false);
    const sliderRef = useRef(null);
    const [likes, setLikes] = useState([]);
    const [user, setUser] = useState(auth.currentUser);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        // Recupera i like associati a questo post
        const likesCollection = firestore.collection('Likes');
        const query = likesCollection.where('postId', '==', id);
        
        const unsubscribe = query.onSnapshot((snapshot) => {
          const likesData = [];
          let hasUserLiked = false;
      
          // Creiamo un array di promesse per il recupero delle informazioni dei like
          const likePromises = snapshot.docs.map((doc) => {
            const likeData = doc.data();
            const like = { id: doc.id, ...likeData };
      
            // Verifica se l'utente ha messo mi piace a questo post
            if (user && like.userId === user.uid) {
              hasUserLiked = true;
              setSliderPosition(sliderRef.current.clientWidth - 50);
            }
            
            // Recupera le informazioni dell'utente e dell'immagine del profilo
            const userPromise = firestore.collection('Utenti').doc(like.userId).get();
            const profilePromise = firestore.collection('profili').doc(like.userId).get();
      
            // Ritorna una promessa con le informazioni del like
            return Promise.all([userPromise, profilePromise]).then(([userDoc, profileDoc]) => {
              if (userDoc.exists) {
                const userData = userDoc.data();
                like.username = userData.username;
            
                if (profileDoc.exists) {
                  const profileData = profileDoc.data();
                  like.profileImage = profileData.fotoProfilo;
                }
              }
              return like;
            });
          });
      
          // Attendiamo che tutte le promesse siano risolte
          Promise.all(likePromises).then((resolvedLikes) => {
            setLikes(resolvedLikes);
            setIsLiked(hasUserLiked);
          });
        });
      
        return () => unsubscribe();
      }, [id, user]);


      useEffect(() => {
        setLikeCount(likes.length);
      }, [likes]);
      
      
  
  
    const handleSwipeStart = (event) => {
      event.preventDefault();
      setIsDragging(true);
      setDragStartX(event.clientX || event.touches[0].clientX);
      setInitialPosition(sliderPosition);
    };
    const handleSwipeMove = (event) => {
        event.preventDefault();
        if (!isDragging || dragStartX === null) {
          return;
        }
        const dragEndX = event.clientX || event.touches[0].clientX;
        const swipeDistance = dragEndX - dragStartX;
        let newPosition = initialPosition + swipeDistance;
      
        if (isLiked) {
          newPosition = Math.min(sliderRef.current.clientWidth - 50, newPosition);
        } else {
          newPosition = Math.min(sliderRef.current.clientWidth - 100, Math.max(0, newPosition));
        }
      
        setSliderPosition(newPosition);
      
        if (!isLiked && newPosition >= sliderRef.current.clientWidth - 100) {
          setIsLiked(true);
      
          const likesCollection = firestore.collection('Likes');
          likesCollection.add({
            postId: id, // Make sure 'id' is defined and valid here
            userId: auth.currentUser.uid,
          }).then(() => {
            console.log("Like aggiunto con successo");
          }).catch((error) => {
            console.error('Errore durante l\'aggiunta del like nel database:', error);
          });
        }
      };
    
      const handleSwipeEnd = () => {
        setIsDragging(false);
        setDragStartX(null);
    
        if (isLiked) {
          console.log("End dragging (liked)");
          setSliderPosition(sliderRef.current.clientWidth - 50);
        } else {
          console.log("End dragging (not liked)");
          setSliderPosition(0);
        }
      };
      const handleCancelIconToggle = () => {
        if (cancelIconActive) {
          // Rimuovi il like dal database solo se era già stato messo
          const likesCollection = firestore.collection('Likes');
          likesCollection
            .where('postId', '==', id) // Utilizza la prop "id" ricevuta da "Feed"
            .where('userId', '==', auth.currentUser.uid)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.delete().then(() => {
                  console.log("Like rimosso con successo");
                  setIsLiked(false);
                  setSliderPosition(0); // Imposta sliderPosition su 0 dopo aver eliminato il like
                  setCancelIconActive(false); // Imposta cancelIconActive su false dopo l'eliminazione
                }).catch((error) => {
                  console.error('Errore durante la rimozione del like dal database:', error);
                });
              });
            });
        } else {
          setCancelIconActive(true);
        }
      };
  
      
      
    
    
    return (
      <div className="post">
        <div className="post-header">
          <img src={profileImage} alt={username} className="profile-image" />
          <span className="username">{username}</span>
        </div>
        <div className="post-content">
          {text}
          {location && (
            <div className="post-location">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {location}
            </div>
          )}
          {radius && (
            <div className="post-radius">
              <span>Raggio di ricerca: {radius} km</span>
            </div>
          )}
          {searchingFor && (
            <div className="post-searching-for">
              <span>Chi cerco: {searchingFor}</span>
            </div>
          )}
          {time && (
            <div className="post-time">
              <FontAwesomeIcon icon={faClock} /> Ora: {time}
            </div>
          )}
          {date && (
            <div className="post-date">
              <FontAwesomeIcon icon={faCalendar} /> Data: {formatDate(date)}
            </div>
          )}
       <div className="swipe-slider" onMouseMove={handleSwipeMove}>
        <div
          className={`slider ${isLiked ? 'liked' : ''}`}
          ref={sliderRef}
          style={{ left: `${sliderPosition}px` }}
        
        />
    <div
      className={`heart-icon ${isDragging ? 'dragging' : ''} ${isLiked ? 'liked' : ''} ${cancelIconActive ? 'cancel' : ''}`}
      onMouseDown={handleSwipeStart}
      onMouseUp={handleSwipeEnd}
      onMouseLeave={handleSwipeEnd} 
      onClick={handleCancelIconToggle}
      onTouchStart={handleSwipeStart}
      onTouchEnd={handleSwipeEnd}
      onTouchMove={handleSwipeMove}
      style={{ left: `${sliderPosition}px`, color: cancelIconActive ? 'red' : 'white' }}
    >
      {cancelIconActive ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faArrowRight} />}
    </div>
</div>
<div className="likes-section">
  <h3>Candidati:</h3>
  <div className="likes-list">
    {likes.slice(0, 5).map((like) => (
      <div key={like.id} className="like-item">
        {like.profileImage && (
         <Link to={`/profile/${like.userId}`}>  
          <img
            src={like.profileImage}
            alt={like.username}
            className="Like-profile-image"
          />
          </Link>  
        )}
        <span className="username">{like.username}</span>
      </div>
    ))}
    {likes.length > 5 && (
      <div className="like-count">
        {likes.length - 5} altri utenti hanno messo mi piace
      </div>
    )}
  </div>
</div>
</div>
</div>
      
      
    );
  }
  
  export default Post;