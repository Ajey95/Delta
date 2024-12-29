import { useState, useEffect} from 'react';

export function useAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
} {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchWithAuth(endpoint, options);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, loading, error, refetch: fetchData };
}
async function fetchWithAuth(endpoint: string, options: RequestInit) {
    const token = localStorage.getItem('authToken');
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const response = await fetch(endpoint, { ...options, headers });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

