// Riduttore (reducer.js)
const initialState = {
  nome: 'Nome Utente',
  eta: '',
  citta: '',
  hobby: '',
  interessi: '',
  descrizione: '',
  fotoProfilo: '',
  password: '', // Aggiungi 'password' nello stato iniziale
  email: '',
  

};

console.log('Initial State:', initialState);
const profileReducer = (state = initialState, action) => {
  console.log('Action:', action);
  console.log('Current State:', state);
  console.log('Profile Reducer:', profileReducer);
  switch (action.type) {
    case 'UPDATE_PROFILE':
      console.log('UPDATE_PROFILE action')
      return {
        ...state,
        ...action.payload,
       
      };
      case 'RESET_PROFILE':
        console.log('RESET_PROFILE action');
        return initialState;
    default:
      return state;
      
  }
};


export default profileReducer;

  