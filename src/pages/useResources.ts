// hooks/useResources.ts
import { fetchWithAuth } from '../services/apiUtils'; // or whatever the correct path is
import { useEffect, useState } from 'react';
import { FilterOptions, Resource } from './types';


export const useResources = (
    selectedCategory: string,
    searchQuery: string,
    filters: FilterOptions
) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    category: selectedCategory !== 'All' ? selectedCategory : '',
                    search: searchQuery,
                    type: filters.type !== 'All Types' ? filters.type : '',
                    duration: filters.duration !== 'Any Duration' ? filters.duration : '',
                    rating: filters.rating !== 'Any Rating' ? filters.rating : ''
                });

                const endpoint = searchQuery
                    ? `/search?query=${searchQuery}`
                    : `/resources?${queryParams}`;

                const data = await fetchWithAuth(endpoint);
                setResources(searchQuery ? data.results : data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch resources');
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResources, 300);
        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchQuery, filters]);

    return { resources, error, isLoading };
};