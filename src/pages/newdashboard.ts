import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/apiUtils';

interface UserData {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  title: string;
  badges: string[];
  expertise: string[];
}

interface Achievement {
  id: string;
  title: string;
  progress: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface Insight {
  id: string;
  title: string;
  type: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  link: string;
}

export function useDashboardData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [userResponse, achievementsResponse, notificationsResponse, insightsResponse, coursesResponse] = 
        await Promise.all([
          fetchWithAuth('/user/profile'),
          fetchWithAuth('/user/achievements'),
          fetchWithAuth('/notifications'),
          fetchWithAuth('/insights'),
          fetchWithAuth('/courses')
        ]);

      setUserData(userResponse);
      setAchievements(achievementsResponse);
      setNotifications(notificationsResponse);
      setInsights(insightsResponse);
      setCourses(coursesResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetchWithAuth(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      setNotifications(prev => prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  return {
    userData,
    achievements,
    notifications,
    insights,
    courses,
    loading,
    error,
    markNotificationAsRead,
    refetchData: fetchAllData
  };
}

export function useAIMentor() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithAuth('/get-advice', {
        method: 'POST',
        body: JSON.stringify({
          query: question,
          category: 'business'
        })
      });

      setResponse(response.advice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI advice');
      console.error('AI mentor error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    question,
    setQuestion,
    response,
    loading,
    error,
    getAdvice
  };
}
//export default Dashboard;