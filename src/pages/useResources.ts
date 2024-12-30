// hooks/useCombinedResources.ts
import { useState, useEffect, useCallback } from 'react';
import { getResources, ResourceQueryParams } from '../services/apiUtils';
import { FilterOptions } from './types';

interface CourseraResource {
    name: string;
    link: string;
    description: string;
}

// Function to fetch Coursera courses
interface CourseraResponse {
    courses: Array<{
        name: string;
        link: string;
        description: string;
    }>;
}

const fetchCourseraCourses = async (topic: string): Promise<CourseraResource[]> => {
    if (!topic.trim()) return [];

    try {
        const response = await fetch(`/api/fetch-courses/${encodeURIComponent(topic)}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        const data: CourseraResponse = await response.json();
        return data.courses;
    } catch (error) {
        console.error('Error fetching Coursera courses:', error);
        throw error;
    }
};

export const useCombinedResources = (
    selectedCategory: string,
    searchQuery: string,
    filters: FilterOptions
) => {
    const [resources, setResources] = useState([]);
    const [courseraResources, setCourseraResources] = useState<CourseraResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCourseraLoading, setIsCourseraLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [courseraError, setCourseraError] = useState<string | null>(null);

    // Fetch local resources
    const fetchResources = useCallback(async () => {
        try {
            setIsLoading(true);
            const queryParams: ResourceQueryParams = {
                category: selectedCategory === 'All' ? '' : selectedCategory,
                search: searchQuery,
                type: filters.type === 'All Types' ? '' : filters.type,
                duration: filters.duration === 'Any Duration' ? '' : filters.duration,
                rating: filters.rating === 'Any Rating' ? '' : filters.rating
            };

            const data = await getResources(queryParams);
            setResources(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch resources');
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, searchQuery, filters]);

    // Fetch Coursera resources
    const fetchCoursera = useCallback(async (topic: string) => {
        if (!topic) return;
        try {
            setIsCourseraLoading(true);
            setCourseraError(null);
            const courses = await fetchCourseraCourses(topic);
            setCourseraResources(courses);
        } catch (err) {
            setCourseraError(err instanceof Error ? err.message : 'Failed to fetch Coursera courses');
        } finally {
            setIsCourseraLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    return {
        // Local resources
        resources,
        isLoading,
        error,
        refetch: fetchResources,
        
        // Coursera resources
        courseraResources,
        isCourseraLoading,
        courseraError,
        fetchCoursera
    };
};