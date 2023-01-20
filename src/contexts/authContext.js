import { createContext, useReducer, useContext } from 'react';

const initialState = {
    token   : null,
    authInfo: {},
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                token: action.token,
                authInfo: action.authInfo,
            };
        default:
            throw new Error(`UnHandled action type : ${action.type}`);
    }
};

const AuthStateContext = createContext(null);
const AuthDispatchContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
};

export const useAuthState = () => {
    const state = useContext(AuthStateContext);
    if (!state) throw new Error('cannot find AuthProvider');
    return state;
};

export const useAuthDispatch = () => {
    const dispatch = useContext(AuthDispatchContext);
    if (!dispatch) throw new Error('cannot find AuthProvider');
    return dispatch;
};
