export const API_BASE_URL = 'http://localhost:5000/api';

export interface ResourceQueryParams {
    category?: string;
    search?: string;
    type?: string;
    duration?: string;
    rating?: string;
  }
export class APIError extends Error {
    constructor(
        message: string,
        public status?: number,
        public details?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}

// apiUtils.ts
export const getResources = async (params: ResourceQueryParams) => {
    try {
        const token = localStorage.getItem('token'); // Or however you store your token
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        
        const response = await fetch(`${API_BASE_URL}/resources?${queryString}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Handle unauthorized - maybe redirect to login
                throw new Error('Please login to continue');
            }
            throw new Error('Failed to fetch resources');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw error;
    }
};



export const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(
                errorData.message || 'API request failed',
                response.status,
                errorData
            );
        }

        return response.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError('Network error occurred');
    }
};