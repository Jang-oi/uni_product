import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { uniAlert } from '../utils/commonUtil';

axios.defaults.baseURL = 'http://localhost:4000/';

export const useFetch = ({ url, method, body = null, headers = null }) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');

    const fetchData = useCallback(() => {
        axios[method](url, headers, body)
            .then((res) => {
                const { returnMessage, returnData } = res.data;
                if (returnMessage) uniAlert({ returnMessage, isError: false }, setResponse(returnData));
                else setResponse(returnData);
            })
            .catch((err) => {
                uniAlert({ returnMessage: err.message, isError: true }, setError(err));
            });
    }, [body, headers, method, url]);

    useEffect(() => {
        fetchData();
    }, [fetchData, method, url, body, headers]);

    return [response, error];
};