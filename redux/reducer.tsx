// reducer.ts
import { GET_LOGINUSERID } from './actionType';

interface State {
    userId: string;
}

interface Action {
    type: string;
    payload?: string;
}

const initialState: State = {
    userId: '',
};

export const ApiResponse = (state = initialState, action: Action): State => {
    switch (action.type) {
        case GET_LOGINUSERID:
            return {
                ...state,
                userId: action.payload || '',
            };

        default:
            return state;
    }
};
