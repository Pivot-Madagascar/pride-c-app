import axios from 'axios';
import { useState, useEffect } from 'react';

const useAxios = ({ baseUrl, url, method, body = null, headers = null }) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const instance = axios.create({
        baseURL: baseUrl, // Set the baseURL dynamically
    });

    const fetchData = () => {
        instance[method](url, JSON.parse(body), {
            headers: JSON.parse(headers),
        })
            .then((res) => {
                setResponse(res.data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [method, url, body, headers, baseUrl]);

    return { response, error, loading };
};

export default useAxios;