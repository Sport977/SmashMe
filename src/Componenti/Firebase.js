// Firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/messaging';
// Configurazione di Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDE3RwldJm91tlv068Ta7ugS3h4PLV-SVQ",
    authDomain: "smashme-5e9f5.firebaseapp.com",
    projectId: "smashme-5e9f5",
    storageBucket: "smashme-5e9f5.appspot.com",
    messagingSenderId: "235128879334",
    appId: "1:235128879334:web:8819ec7770edd9da0aa327",
    measurementId: "G-B2X3P300HN"
  };

// Inizializza Firebase con la configurazione
firebase.initializeApp(firebaseConfig);

// Export dei moduli di Firebase che desideri utilizzare nel tuo progetto
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage(); 
export const messaging =firebase.messaging();