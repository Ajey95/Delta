import React, { useState, createContext, useContext, Suspense, useEffect, ReactNode } from 'react';
// import express from 'express'; // Removed as it is not used in a React frontend application
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Bell, Home, BookOpen, TrendingUp, Loader2, LogOut } from 'lucide-react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate,useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import Dashboard from './dashboard';
import ResourceDirectory from './resourcedirectory';
import FundingVisualization from './enhanced-funding-viz';
import { LoginPage, SignupPage } from './login-signup';
import { authService } from '../services/authService';
import LandingPage from './women-empowerment-landing';
import AboutPage from './AboutPage';
import Features from './features';
import Community from './community';
import { ResourceList } from './resourceList';
import { UserData, AuthResponse, mapUserData,SignupData } from '../pages/types';


interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Notification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string | number) => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

// Create contexts with types
const UserContext = createContext<UserContextType | undefined>(undefined);
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
//const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setIsLoading(false);
          return;
        }

        const isValid = await authService.verifyToken();
        setIsAuthenticated(isValid);
      } catch (err) {
        setError('Unable to authenticate. Please check your connection.');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

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

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}
// Error Boundary Component
class ErrorBoundary extends React.Component<Props, State> {
  // constructor(props: ErrorBoundaryProps) {
  //   super(props);
  //   this.state = { hasError: false, error: null };
  // }

  // static getDerivedStateFromError(error: Error): ErrorBoundaryState {
  //   return { hasError: true, error };
  // }
  public state: State = {
    hasError: false,
    error: null,
};

public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
}

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>
            Something went wrong. Please try refreshing the page.
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-2 text-sm">{this.state.error?.toString()}</pre>
            )}
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}

// Update AuthProvider to handle navigation after login

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
  </div>
);

// Notification Panel Component
const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onMarkAsRead }) => (
  <div className="space-y-4">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`p-4 rounded-lg ${
          notification.read ? 'bg-gray-50' : 'bg-blue-50'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
          {!notification.read && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark as read
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(notification.time).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
);
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser) as UserData;
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const userData = mapUserData(response.user, response.token);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (formData: SignupData) => {
    try {
      const response = await authService.signup(formData);
      const userData = mapUserData(response.user, response.token);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout ,setIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// Main App Layout
const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const notificationsData = await response.json();
        setNotifications(notificationsData);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string | number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
        <div className="min-h-screen bg-gray-50">
          {/* Top Navigation */}
          <header className="bg-white border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-purple-600">
                    Business Resource Hub
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="relative p-2 rounded-full hover:bg-gray-100">
                        <Bell className="h-6 w-6 text-gray-500" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                          </span>
                        )}
                      </button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Notifications</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg ${
                          notification.read ? 'bg-gray-50' : 'bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                          </div>
                          {!notification.read && (
                            <Badge
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as read
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.time).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
                  {user && (
                    <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Welcome, {user.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ErrorBoundary>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white p-1 rounded-lg">
                  <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Resources</span>
                    
                  </TabsTrigger>
                  <TabsTrigger value="funding" className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Funding</span>
                  </TabsTrigger>
                </TabsList>

                <Suspense fallback={<LoadingSpinner />}>
                  <TabsContent value="dashboard">
                    <Dashboard />
                  </TabsContent>

                  <TabsContent value="resources">
                    <ResourceDirectory />
                  </TabsContent>

                  <TabsContent value="funding">
                    <FundingVisualization />
                  </TabsContent>
                </Suspense>
              </Tabs>
            </ErrorBoundary>
          </main>
        </div>
  );
};



const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Check for existing auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          // Verify the token is still valid
          const isValid = await authService.verifyToken();
          if (isValid) {
            setUserData(user);
          } else {
            // Clear invalid auth data
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout();
      }
    };

    initializeAuth();
  }, []);

  // Fetch initial notifications if user is authenticated
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userData) {
        try {
          const response = await fetch('http://localhost:5000/api/notifications', {
            headers: {
              'Authorization': `Bearer ${userData.token}`,
            },
          });
          
          if (response.ok) {
            const notificationsData = await response.json();
            setNotifications(notificationsData);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [userData]);

  return (
    <Router>
      <AuthProvider>
      <UserContext.Provider value={{ userData, setUserData }}>
      <NotificationContext.Provider value={{ notifications, setNotifications }}>
      <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Add Landing Page as the default route */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/AboutPage" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/features" element={<Features />} />
              <Route path="/community" element={<Community />} />
              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <AppLayout />
                  </PrivateRoute>
                }
              />
               <Route path="/resources" element={
              <PrivateRoute>
                <ResourceDirectory />
              </PrivateRoute>
            } />
            <Route path="/funding" element={
              <PrivateRoute>
                <FundingVisualization />
              </PrivateRoute>
            } />
              {/* Redirect other unknown routes to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
            </NotificationContext.Provider>
            </UserContext.Provider>
            </AuthProvider>
    </Router>
  );
};
// Export context hooks with types
// Create contexts

// Auth Hook


// Notifications Hook
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationContext.Provider');
  }
  return context;
};

export default App;