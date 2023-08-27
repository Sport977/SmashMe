import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './chatlist.css';
import { firestore } from './Firebase';

function ChatList({ chats, selectedChat, onSelectChat, allUsers }) {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImages, setUserImages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log(isDropdownOpen)
  };

  const handleChatClick = (chat) => {
    console.log('Chat clicked:', chat);
    setSelectedRecipient(null);
    onSelectChat(chat.uid, null); // Passa null come recipientId
  };
 
 

  const handleUserClick = (user) => {
    console.log('User clicked:', user.uid);
    setSelectedRecipient(user.uid);
    onSelectChat(null, user.uid); // Passa user.uid come recipientId
  };
 
  useEffect(() => {
    const populateUserImages = async () => {
      const images = {};
  
      for (const user of allUsers) {
        try {
          const docRef = firestore.collection('profili').doc(user.uid);
          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
            const imageUrl = docSnapshot.data().fotoProfilo;
            images[user.uid] = imageUrl;
          }
        } catch (error) {
          console.error('Errore durante il recupero dell\'immagine:', error.message);
        }
      }
  
      setUserImages(images);
    };
  
    if (isDropdownOpen) {
      populateUserImages();
    }
  }, [isDropdownOpen, allUsers]);
  
  // ...
  
  useEffect(() => {
    const populateChatImages = async () => {
      const images = {};
  
      for (const chat of chats) {
        try {
          const docRef = firestore.collection('profili').doc(chat.uid);
          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
            const imageUrl = docSnapshot.data().fotoProfilo;
            images[chat.uid] = imageUrl;
          }
        } catch (error) {
          console.error('Errore durante il recupero dell\'immagine:', error.message);
        }
      }
  
      setUserImages(images);
    };
  
    populateChatImages();
  }, [chats]);
  
  return (
    <div className={`chat-list ${isDropdownOpen ? 'selected' : ''}`}>
      <div className="new-chat-button" onClick={(e) => {
        e.stopPropagation(); // Impedisce la propagazione dell'evento al livello superiore
        handleDropdownToggle();
      }}>
        <FontAwesomeIcon icon={faEnvelope} />
        <span className="new-message-text">Nuovo messaggio</span>
      </div>
      {isDropdownOpen && (
        <div className="dropdown-menu-list">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Cerca utente"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {allUsers.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
            <div
              key={user.uid}
              onClick={() => {
                handleUserClick(user);
                handleDropdownToggle();
              }}
            >
              <div className="dropdown-menu-list-image">
                <img className="profile-icon" src={userImages[user.uid]} alt={user.username} />
              </div>
              {user.username}
            </div>
          ))}
        </div>
      )}
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.uid}
            className={`chat-item ${selectedChat === chat.uid ? 'selected' : ''}`}
            onClick={() => handleChatClick(chat)}
          >
            <div className="profile-image">
              <img className="profile-icon" src={userImages[chat.uid]} alt={chat.username} />
            </div>
            {chat.username}
          </li>
        ))}
      </ul>
    </div>
  );
  };
export default ChatList;  