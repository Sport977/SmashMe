// Store (store.js)
import { createStore } from 'redux';
import profileReduce from './reduce';

const store = createStore(profileReduce);

export default store;
