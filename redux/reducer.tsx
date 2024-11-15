// redux/reducer.ts
import { SET_LOGIN_USER_ID, CLEAR_USER_ID } from './actions';

export interface UserState {
  userId: string;
}

const initialState: UserState = {
  userId: '', // Default to empty string
};

export const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case SET_LOGIN_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };
    case CLEAR_USER_ID:
      return {
        ...state,
        userId: '',
      };
    default:
      return state;
  }
};
