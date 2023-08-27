// Azioni (actions.js)
export const updateProfile = (profileData) => ({
    type: 'UPDATE_PROFILE',
    payload: profileData,
  });
  export const resetProfile = () => ({
    type: 'RESET_PROFILE',
    payload: {
    nome: 'Nome Utente',
      eta: '',
     citta: '',
     hobby: '',
      interessi: '',
     descrizione: '',
     fotoProfilo: '',
      password: '', // Aggiungi 'password' nello stato iniziale
     email: '',
     // Reimposta anche il campo fotoProfilo
    },
    
  });
  export const loginSuccess = () => ({
    type: 'LOGIN_SUCCESS',
  });
  
  export const logout = () => ({
    type: 'LOGOUT',
  });