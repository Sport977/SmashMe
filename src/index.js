import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { UserProvider } from './Componenti//UserContext'; // Import the UserProvider
import store from './Componenti/store';
import { Provider } from 'react-redux';



ReactDOM.render(
  <React.StrictMode>
    <UserProvider> {/* Wrap the App with UserProvider */}
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
