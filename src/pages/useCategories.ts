import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/apiUtils';
export const useCategories = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await fetchWithAuth('/categories');
                setCategories(['All', ...data]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch categories');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, error, isLoading };
};