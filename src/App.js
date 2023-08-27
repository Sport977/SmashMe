import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Componenti/Home';
import PaginaDelProfilo from './Componenti/Paginadelprofilo';
import DettagliProfilo from './Componenti/Dettagliprofilo';
import LoginPage from './Componenti/Login'; // Aggiungi l'import per la pagina di login
import SignupPage from './Componenti/SignupPage'; 
import Chat from './Componenti/Chat';
import GenericProfile from './Componenti/GenericProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Paginadelprofilo" element={<PaginaDelProfilo />} />
      <Route path="/Dettagliprofilo" element={<DettagliProfilo />} />
      <Route path="/login" element={<LoginPage />} /> {/* Aggiungi la rotta per la pagina di login */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile/:userId" element={<GenericProfile />} />
    </Routes>
  );
}

export default App;


