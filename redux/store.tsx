import { createStore, combineReducers } from 'redux';
import { userReducer } from './reducer';

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Create the Redux store
export const store = createStore(rootReducer);

// Export RootState type from here
export type RootState = ReturnType<typeof rootReducer>;
