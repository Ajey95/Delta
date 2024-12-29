import React, { useState, useEffect, Fragment } from 'react';
import { Bell, MessageCircle, BookOpen, Users, Award, Search, 
         Calendar, TrendingUp, Target, Bookmark, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';

// API URLs configuration
const API_BASE_URL = 'http://localhost:5000';
const API_ENDPOINTS = {
  userProfile: '/api/user/profile',
  achievements: '/api/user/achievements',
  notifications: '/api/notifications',
  insights: '/api/insights',
  courses: '/api/courses',
  advice: '/get-advice'
};

const Dashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('mentor');
  const [showNotifications, setShowNotifications] = useState(false);
  interface UserData {
    avatar: string;
    name: string;
    initials: string;
    title: string;
    badges: string[];
    expertise: string[];
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  interface Achievement {
    id: string;
    title: string;
    progress: number;
  }

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  interface Notification {
    id: string;
    title: string;
    time: string;
    read: boolean;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  interface Insight {
    id: string;
    title: string;
    type: string;
  }

  const [insights, setInsights] = useState<Insight[]>([]);
  interface Course {
    name: string;
    description: string;
    link: string;
  }

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mentorQuestion, setMentorQuestion] = useState('');
  const [mentorResponse, setMentorResponse] = useState('');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' }
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchUserData(),
          fetchAchievements(),
          fetchNotifications(),
          fetchInsights(),
          fetchCourses()
        ]);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.userProfile}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.achievements}`);
      if (!response.ok) throw new Error('Failed to fetch achievements');
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.notifications}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.insights}`);
      if (!response.ok) throw new Error('Failed to fetch insights');
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.courses}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };

  const handleMentorQuestion = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.advice}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: mentorQuestion,
          language: currentLanguage,
          category: 'business'
        }),
      });

      if (!response.ok) throw new Error('Failed to get mentor advice');
      const data = await response.json();
      setMentorResponse(data.advice);
    } catch (error) {
      console.error('Error getting mentor advice:', error);
      setError('Failed to get mentor response');
    }
  };

  const renderNotifications = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Recent Notifications
        </h3>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{notification.title}</span>
                <span className="text-sm text-gray-500">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderInsights = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Business Insights
        </h3>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <p className="font-medium">{insight.title}</p>
                <p className="text-sm text-gray-600">{insight.type}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCourses = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Recommended Courses
        </h3>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">{course.name}</h4>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={course.link} target="_blank" rel="noopener noreferrer">
                  View Course
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderAchievements = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Award className="mr-2 h-5 w-5" />
          Achievements
        </h3>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{achievement.title}</span>
                <span>{achievement.progress}%</span>
              </div>
              <Progress value={achievement.progress} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderProfileCard = () => {
    if (!userData) return null;
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-gray-600">{userData.title}</p>
              <div className="flex gap-2 mt-2">
                {userData.badges?.map((badge: string, index: number) => (
                  <Badge key={index} variant="secondary">{badge}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMentorSection = () => (
    <div className="space-y-6">
      {renderProfileCard()}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">AI Business Mentor</h3>
          <div className="space-y-4">
            <div className="flex space-x-2 mb-4">
              {userData?.expertise?.map(tag => (
                <Button key={tag} variant="outline" size="sm">
                  {tag}
                </Button>
              ))}
            </div>
            <textarea 
              className="w-full p-3 border rounded-lg h-32" 
              placeholder="Ask your business question..."
              value={mentorQuestion}
              onChange={(e) => setMentorQuestion(e.target.value)}
            />
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleMentorQuestion}
            >
              Get Personalized Advice
            </Button>
            {mentorResponse && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <p className="text-purple-900">{mentorResponse}</p>
              </div>
            )}
          </div>
        </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 mr-3 text-purple-600" />
            <div>
              <p className="font-medium">Schedule Mentoring Session</p>
              <p className="text-sm text-gray-600">Book a one-on-one session</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <MessageCircle className="h-5 w-5 mr-3 text-purple-600" />
            <div>
              <p className="font-medium">Join Community Discussion</p>
              <p className="text-sm text-gray-600">Connect with other entrepreneurs</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Bookmark className="h-5 w-5 mr-3 text-purple-600" />
            <div>
              <p className="font-medium">Save Resources</p>
              <p className="text-sm text-gray-600">Build your learning library</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Share2 className="h-5 w-5 mr-3 text-purple-600" />
            <div>
              <p className="font-medium">Share Your Journey</p>
              <p className="text-sm text-gray-600">Inspire others with your story</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2">
            {renderMentorSection()}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {renderAchievements()}
            {renderNotifications()}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {renderInsights()}
          {renderCourses()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
