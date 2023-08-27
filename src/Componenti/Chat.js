import React, { useState, useEffect,useRef} from 'react';
import { useUser } from './UserContext';
import { firestore,auth } from './Firebase';
import Navbar from './Navbar';
import Footer from './Footer';
import './chat.css';
import ChatList from './ChatList';
import './chatlist.css';
import { useNavigate } from 'react-router-dom';

function Chat() {
  var { user } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null); // Stato per memorizzare l'ID della chat selezionata
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const chatRef = useRef(null);
  const [usersWithChatDetails, setUsersWithChatDetails] = useState([]);
  const [chatUserImageUrl, setChatUserImageUrl] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');

  
  
  

  try  {
    const user_check = auth.currentUser;
    console.log (typeof user_check.uid)
    console.log (user_check.uid)
  } catch {
    navigate('/login');
  }
  
 
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }
  
    const user = auth.currentUser;
    const chatRef = firestore.collection('messages');
  
    const userRef = firestore.collection('profili').doc(user.uid);
    const chatUserRef = firestore.collection('profili').doc(selectedChatId);
  
    const query1 = chatRef
      .where('users', '==', [user.uid, selectedChatId])
      .orderBy('timestamp', 'asc');
  
    const query2 = chatRef
      .where('users', '==', [selectedChatId, user.uid])
      .orderBy('timestamp', 'asc');
  
    const unsubscribe1 = query1.onSnapshot((snapshot1) => {
      const data1 = snapshot1.docs.map((doc) => doc.data());
  
      query2.onSnapshot((snapshot2) => {
        const data2 = snapshot2.docs.map((doc) => doc.data());
  
        const combinedData = [...data1, ...data2];
        combinedData.sort((a, b) => a.timestamp - b.timestamp);
  
        setMessages(combinedData);
      });
    });
  
// Fetch profile images
const fetchProfileImages = async () => {
  try {
    const userSnapshot = await userRef.get();
    const chatUserSnapshot = await chatUserRef.get();

    const userImageUrl = userSnapshot.exists ? userSnapshot.data().fotoProfilo : '';
    const chatUserImageUrl = chatUserSnapshot.exists ? chatUserSnapshot.data().fotoProfilo : '';

    setUserImageUrl(userImageUrl);
    setChatUserImageUrl(chatUserImageUrl);
    // Use these image URLs for your rendering
    console.log('User Image URL:', userImageUrl);
    console.log('Chat User Image URL:', chatUserImageUrl);

    // Additional debug logs
    console.log('User Snapshot Data:', userSnapshot.data());
    console.log('Chat User Snapshot Data:', chatUserSnapshot.data());
  } catch (error) {
    console.error('Error fetching profile images:', error.message);
  }
};

fetchProfileImages();

return () => {
  unsubscribe1();
};

  }, [user.uid, selectedChatId]);
  
  




  
   
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const unsubscribe = firestore
        .collection('messages')
        .where('users', '==', user.uid) // Cambiato da 'array-contains' a '=='
        .onSnapshot(async (snapshot) => {
          const otherUserIds = new Set();
          snapshot.docs.forEach((doc) => {
            const messageData = doc.data();
            const otherUser = messageData.users.find((userId) => userId !== user.email);
            if (otherUser) {
              otherUserIds.add(otherUser);
              console.log(otherUser);
            }
          });
  
          const usersDataPromises = Array.from(otherUserIds).map(async (otherUserId) => {
            try {
              console.log('Fetching user data for:', otherUserId);
              const userDoc = await firestore.collection('Utenti').doc(otherUserId).get();
              if (userDoc.exists) {
                const userData = userDoc.data();
                console.log('User data retrieved:', userData);
                return {
                  uid: otherUserId,
                  username: userData.username,
                };
              }
            } catch (error) {
              console.error('Errore durante il recupero dei dati dell\'utente:', error.message);
            }
          });
  
          Promise.all(usersDataPromises)
            .then((users) => {
              const filteredUsers = users.filter((user) => user !== undefined);
              setAvailableRecipients(filteredUsers);
            });
        });
  
      // Cleanup della sottoscrizione quando il componente viene smontato
      return () => unsubscribe();
    }
  }, []);
  
  useEffect(() => {
    const user = auth.currentUser;
    
    if (user) {
      const unsubscribe = firestore.collection('Utenti').onSnapshot((snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        
        // Filtra gli utenti per rimuovere l'utente loggato
        const filteredUsers = users.filter((userData) => userData.uid !== user.uid);
  
        setAllUsers(filteredUsers);
        console.log(filteredUsers);
      });
  
      return () => unsubscribe();
    }
  }, []);
  
  useEffect(() => {
    const user = auth.currentUser;
  
    if (user) {
      const unsubscribe = firestore.collection('messages').where('users', 'array-contains', user.uid).onSnapshot((snapshot) => {
        const chats = snapshot.docs.map((doc) => doc.data());
  
        // Filtra gli utenti che hanno già una chat aperta
        const usersWithChat = chats.flatMap(chat => chat.users).filter(uid => uid !== user.uid);
  
        // Rimuovi utenti duplicati
        const uniqueUsersWithChat = [...new Set(usersWithChat)];
  
        if (uniqueUsersWithChat.length > 0) {
          // Query per ottenere i dettagli degli utenti con chat aperte
          firestore.collection('Utenti').where('uid', 'in', uniqueUsersWithChat).get()
            .then((querySnapshot) => {
              const usersData = querySnapshot.docs.map((doc) => doc.data());
              setUsersWithChatDetails(usersData);
            })
            .catch((error) => {
              console.error('Errore durante la query degli utenti:', error.message);
            });
        } else {
          setUsersWithChatDetails([]); // Nessun utente con chat aperte
        }
      });
  
      return () => unsubscribe();
    }
  }, []);
  
  
  
  
 
  
    
  

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };


  const handleSendMessage = async (event) => {
    event.preventDefault();

    // Assicuriamoci che il messaggio e il destinatario non siano vuoti
    if (message.trim() === '') {
      return;
    }
    try {
      const newMessageRef = firestore.collection('messages').doc();
      var user = auth.currentUser;
      console.log(message);
      console.log(user.uid);
      console.log(selectedChatId);
     
      const userDoc = await firestore.collection('Utenti').doc(user.uid).get();
      const username = userDoc.data().username;
      
     
      // Imposta i dati del documento utilizzando il metodo 'set()'
      if (message && user.uid) {
        await newMessageRef.set({
          text: message,
          users: [user.uid, selectedChatId], // Utilizza l'UID dell'utente corrente e del destinatario selezionato
          sender: username, // Utilizza l'UID dell'utente corrente come mittente
          timestamp: new Date(),
        });
        // Reset del campo di input del messaggio
        setMessage('');
        setSelectedChatId(selectedChatId);
     
      } else {
        console.error('Errore durante l\'invio del messaggio: valori mancanti.');
      }
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error.message);
    }
  };
  // All'interno della funzione handleSelectChat
// All'interno della funzione handleSelectChat
const handleSelectChat = async (chatId, recipientId) => {
  console.log('ChatId:', chatId);
  console.log('RecipientId:', recipientId);
  if (chatId === null) {
    // Apri una nuova chat con un utente selezionato
    console.log(recipientId);
    try {
      const currentUser = auth.currentUser;

      // Assicurati che recipientId sia valorizzato prima di creare la nuova chat
      if (!recipientId) {
        console.error('Nessun utente selezionato per avviare la chat.');
        return;
      }

      // Crea una nuova chat nel database
      const newChatRef = firestore.collection('messages').doc();
      await newChatRef.set({
        users: [currentUser.uid, recipientId],
        
      });
      // Imposta l'ID della nuova chat appena creata
      setSelectedChatId(recipientId);
      setMessages([]);
      const chatForm = document.querySelector('.chat-container form');
      chatForm.style.display = 'block';
    } catch (error) {
      console.error('Errore durante la creazione della nuova chat:', error.message);
    }
  } else {
    const filteredMessages = messages.filter(msg => msg.users.includes(selectedChatId));
    setMessages(filteredMessages);
    setSelectedChatId(chatId);
    const chatForm = document.querySelector('.chat-container form');
    chatForm.style.display = 'block';
  }
};


useEffect(() => {
  // Quando i messaggi vengono aggiornati, sposta la scrollbar in basso
  if (messages.length > 0) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [messages]);

  

return (
  <>
    <Navbar />
    <ChatList
      chats={usersWithChatDetails}
      selectedChat={selectedChatId}
      onSelectChat={handleSelectChat}
      allUsers={allUsers}
    />

    <div className="chat-container">
      {auth.currentUser && (
       <div className="chat-messages" ref={chatRef}>
        {messages
         .filter(msg => msg.users.includes(selectedChatId))
         .map((msg, index) => {
          const isSent = msg.users[0] === auth.currentUser.uid;
         const userProfileImage = isSent ? userImageUrl : chatUserImageUrl;

      return (
        <div
          key={index}
          className={`chat-message ${isSent ? 'sent' : 'received'}`}
        >
          <img
            src={userProfileImage}
            alt="Profile"
            className={`profile-image ${isSent ? 'sent-image' : 'received-image'}`}
          />
          <div className="message-content">
            <strong>{msg.sender}: </strong>
            <span>{msg.text}</span>
          </div>
        </div>
      );
    })}
</div>

      )}

      <form onSubmit={handleSendMessage}>
        <div className="chat-form">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            className="chat-input"
            placeholder="Scrivi un messaggio..."
          />
          <button type="submit" className="chat-button">
            Invia
          </button>
        </div>
      </form>
    </div>
    <Footer />
  </>
);
}

export default Chat;
