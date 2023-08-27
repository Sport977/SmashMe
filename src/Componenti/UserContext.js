// UserContext.js
import { createContext, useContext, useReducer } from 'react';
import profileReducer from './reduce'; // Importa il tuo riduttore

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(profileReducer, {}); // Usa il riduttore profileReducer

  // Aggiungi la logica per gestire il login qui
  const handleLogin = (email) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { email } });
  };

  return (
    <UserContext.Provider value={{ user, dispatch, handleLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
