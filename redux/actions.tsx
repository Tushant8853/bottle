// actions.ts
import { GET_LOGINUSERID } from './actionType';

interface GetLoginUserIdAction {
  type: typeof GET_LOGINUSERID;
  payload: string; // Adjust type as per the expected result type
}

export const getLoginUserId = (result: string): GetLoginUserIdAction => ({
  type: GET_LOGINUSERID,
  payload: result,
});
