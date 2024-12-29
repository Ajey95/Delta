// api.ts - Centralized API handling
export const API_BASE_URL = 'http://localhost:5000/api';



class APIService {
    private getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'API request failed');
        }
        return response.json();
    }

    async getFundingStatistics(timeRange: string) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/funding/statistics?timeRange=${timeRange}`,
                { headers: this.getHeaders() }
            );
            return this.handleResponse(response);
        } catch (error) {
            console.error('Funding statistics error:', error);
            throw new Error('Failed to fetch funding data');
        }
    }

    async getSuccessStories() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/funding/success-stories`,
                { headers: this.getHeaders() }
            );
            return this.handleResponse(response);
        } catch (error) {
            console.error('Success stories error:', error);
            throw new Error('Failed to fetch success stories');
        }
    }

    async getUserProfile() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/user/profile`,
                { headers: this.getHeaders() }
            );
            return this.handleResponse(response);
        } catch (error) {
            console.error('User profile error:', error);
            throw new Error('Failed to fetch user data');
        }
    }
    
}

export const apiService = new APIService();

