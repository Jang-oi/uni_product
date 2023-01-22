import { useState } from 'react';
import { uniAlert } from '../utils/commonUtil';
import { useLoadingDispatch } from '../contexts/loadingContext';

export const useAxios = () => {

    const [response, setResponse] = useState(null);
    const loadingDispatch = useLoadingDispatch();

    const axiosFetch = async (configObj) => {
        const { axiosInstance, method, url, requestConfig = {} } = configObj;

        try {
            loadingDispatch({ type: 'SET_LOADING', loading: true });
            const res = await axiosInstance[method.toLowerCase()](url, { ...requestConfig });

            const { returnMessage, returnData } = res.data;

            if (returnMessage) uniAlert({ text: returnMessage, isError: false }, setResponse(returnData));
            else setResponse(returnData);

        } catch (err) {
            uniAlert({ text: err.message, isError: true });
        } finally {
            loadingDispatch({ type: 'SET_LOADING', loading: false });
        }
    };

    return [response, axiosFetch];
};