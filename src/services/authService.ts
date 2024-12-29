import { UserData, SignupData, AuthResponse, mapUserData } from '../pages/types';

class AuthService {
  private async fetchWithToken(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    const response = await fetch(url, options);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication token expired');
    }
    
    return response;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    try {
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Response handling error:', error.message);
      } else {
        console.error('Response handling error:', error);
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await this.handleResponse<AuthResponse>(response);
      
      if (data.token && data.user) {
        const userData = mapUserData(data.user, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return data;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  }

  async signup(formData: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await this.handleResponse<AuthResponse>(response);
      
      if (data.token && data.user) {
        const userData = mapUserData(data.user, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return data;
    } catch (error) {
      console.error('Signup request failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
        try {
            const response = await this.fetchWithToken('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error(`Logout failed: ${response.status} - ${errorDetails}`);
                throw new Error(`Logout failed: ${response.statusText}`);
            }

            console.log('Logout successful.');
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            // Ensure localStorage is cleared regardless of logout success
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    } else {
        console.warn('No token found; clearing session.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}


  getToken(): string | null {
    const user = this.getCurrentUser();
    return user?.token || localStorage.getItem('token');
  }

  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user?.token;
  }

  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await this.fetchWithToken('/api/auth/verify', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  }
}

export const authService = new AuthService();