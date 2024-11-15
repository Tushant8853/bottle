// redux/actions.ts
export const SET_LOGIN_USER_ID = 'SET_LOGIN_USER_ID';
export const CLEAR_USER_ID = 'CLEAR_USER_ID';

export const setLoginUserId = (userId: string) => ({
  type: SET_LOGIN_USER_ID,
  payload: userId,
});

export const clearUserId = () => ({
  type: CLEAR_USER_ID,
});
