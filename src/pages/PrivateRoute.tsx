import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './app1';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {isAuthenticated }= useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) 
           {
          // Clear invalid token
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
          localStorage.removeItem('user');
        }
      } catch (err) {
        setError('Unable to authenticate. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle loading state with a spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Handle authentication errors (including offline)
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  return isAuthenticated ? children:null;

};