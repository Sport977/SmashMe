import React, { useState, useEffect } from 'react';
import './dropdownMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { firestore, auth } from './Firebase';

function DropdownMenu4({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [otherUser, setOtherUser] = useState('');
  const [otherUsername, setOtherUsername] = useState('');


  // ...

useEffect(() => {
  if (!currentUser && !auth.currentUser) {
    return; // Se currentUser o auth.currentUser non sono definiti, esci dall'effetto
  }

  const currentUserUid = currentUser ? currentUser.uid : auth.currentUser.uid;
  console.log('Current User UID:', currentUserUid);

  const unsubscribe = firestore
    .collection('messages')
    .where('users', 'array-contains', currentUserUid)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .onSnapshot((snapshot) => {
      console.log('Snapshot received:', snapshot.docs.length, 'documents');
      if (!snapshot.empty) {
        const lastMessageData = snapshot.docs[0].data();
        console.log('Last Message Data:', lastMessageData);
        setLastMessage(lastMessageData);

        // Trova l'ID dell'altro utente nel messaggio
        const otherUserId = lastMessageData.users.find(uid => uid !== currentUserUid);
        console.log('Other User ID:', otherUserId);
        setOtherUser(otherUserId);
        
        // Query per ottenere il nome utente dell'altro utente
        firestore.collection('Utenti').doc(otherUserId).get()
          .then((userDoc) => {
            if (userDoc.exists) {
              const userData = userDoc.data();
              console.log('Other User Data:', userData);
              setOtherUsername(userData.username);
            }
          });
      }
    });

  return () => unsubscribe();
}, [currentUser]);

// ...


  const handleClick = () => {
    if (currentUser || auth.currentUser) {
      toggleDropdown();
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  console.log(lastMessage)

  return (
    <div className="dropdown-container">
      <div className="menu-toggle" onClick={handleClick}>
        <FontAwesomeIcon icon={faComment} />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>
              {lastMessage ? (
                <Link to={'/chat'}>
                  <button>
                    {otherUsername} - {lastMessage.text}
                  </button>
                </Link>
              ) : (
                <Link to="/chat">
                  <button>Apri tutti i messaggi</button>
                </Link>
              )}
            </li>
            <li>Secondo messaggio</li>
            <li>Terzo messaggio</li>
          </ul>
        </div>
      )}
    </div>
  );
  
  
}

export default DropdownMenu4;
