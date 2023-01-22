import { createContext, useReducer, useContext } from 'react';

const initialState = {
    loading: false,
};

const loadingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.loading,
            };
        default:
            throw new Error(`UnHandled action type : ${action.type}`);
    }
};

const LoadingStateContext = createContext(null);
const LoadingDispatchContext = createContext(null);

export const LoadingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(loadingReducer, initialState);
    return (
        <LoadingStateContext.Provider value={state}>
            <LoadingDispatchContext.Provider value={dispatch}>{children}</LoadingDispatchContext.Provider>
        </LoadingStateContext.Provider>
    );
};

export const useLoadingState = () => {
    const state = useContext(LoadingStateContext);
    if (!state) throw new Error('cannot find LoadingProvider');
    return state;
};

export const useLoadingDispatch = () => {
    const dispatch = useContext(LoadingDispatchContext);
    if (!dispatch) throw new Error('cannot find LoadingProvider');
    return dispatch;
};
