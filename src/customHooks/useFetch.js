import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/';

export const useFetch = ({ url, method, body = null, headers = null }) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');

    const fetchData = useCallback(() => {
        axios[method](url, headers, body)
            .then(res => setResponse(res.data))
            .catch(err => setError(err));
    }, [body, headers, method, url]);

    useEffect(() => {
        fetchData();
    }, [fetchData, method, url, body, headers]);

    return [response, error];
};