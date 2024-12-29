import React, { useState, useEffect } from 'react';
import { Bell, MessageCircle, BookOpen, Users, Award, Search, ChevronDown, 
         Calendar, TrendingUp, Target, Bookmark, Share2, ThumbsUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';

const Dashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('mentor');
  const [showNotifications, setShowNotifications] = useState(false);
  interface UserData {
    avatar: string;
    initials: string;
    name: string;
    title: string;
    badges: string[];
    expertise: string[];
    firstName: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  interface Achievement {
    id: number;
    title: string;
    progress: number;
  }

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState([]);
  const [insights, setInsights] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchUserData = async () => {
    const response = await fetch('/api/user/profile');
    if (!response.ok) throw new Error('Failed to fetch user data');
    const data = await response.json();
    setUserData(data);
  };

  const fetchAchievements = async () => {
    const response = await fetch('/api/user/achievements');
    if (!response.ok) throw new Error('Failed to fetch achievements');
    const data = await response.json();
    setAchievements(data);
  };

  const fetchNotifications = async () => {
    const response = await fetch('/api/notifications');
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const data = await response.json();
    setNotifications(data);
  };

  const fetchInsights = async () => {
    const response = await fetch('/api/insights');
    if (!response.ok) throw new Error('Failed to fetch insights');
    const data = await response.json();
    setInsights(data);
  };

  const fetchCourses = async () => {
    const response = await fetch('/api/courses');
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    setCourses(data);
  };

  const renderProfileCard = () => {
    if (!userData) return null;
    
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userData.avatar} alt="Profile" />
            <AvatarFallback>{userData.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{userData.name}</h3>
            <p className="text-gray-600">{userData.title}</p>
            <div className="flex space-x-2 mt-2">
              {userData.badges.map((badge, index) => (
                <Badge key={index} variant="secondary">{badge}</Badge>
              ))}
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="outline" className="mb-2 w-full">
              <Target className="mr-2 h-4 w-4" />
              Set Goals
            </Button>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </div>
        </div>
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
              {userData?.expertise.map(tag => (
                <Button key={tag} variant="outline" size="sm">
                  {tag}
                </Button>
              ))}
            </div>
            <textarea 
              className="w-full p-3 border rounded-lg h-32" 
              placeholder="Ask your business question..."
            />
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Get Personalized Advice
            </Button>
          </div>
        </Card>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Growth Tracking</h3>
            <div className="space-y-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{achievement.title}</span>
                    <span className="text-gray-600">{achievement.progress}%</span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Insights</h3>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{insight.title}</p>
                      <p className="text-sm text-purple-700">{insight.type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSkillSection = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recommended Courses</h3>
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{course.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">{course.level}</Badge>
                      <p className="text-sm text-gray-600">{course.duration}</p>
                    </div>
                  </div>
                  <Button>Enroll</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Learning Progress</h3>
          <div className="space-y-6">
            {achievements.map(achievement => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{achievement.title}</span>
                  <span className="text-purple-600">{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
            ))}
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
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-purple-700">WomenAI</h1>
              <div className="hidden md:flex space-x-4">
                {[
                  { id: 'mentor', icon: Award, label: 'Mentor' },
                  { id: 'skills', icon: BookOpen, label: 'Skills' },
                  { id: 'community', icon: Users, label: 'Community' }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <Button 
                      key={item.id}
                      variant="ghost" 
                      className={activeSection === item.id ? 'bg-purple-50' : ''}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="border rounded-lg px-3 py-2"
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <div className="relative">
                <Button 
                  variant="ghost"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border p-4">
                    <h4 className="font-semibold mb-2">Notifications</h4>
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <Bell className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button variant="ghost">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {userData.firstName}!
            </h2>
            <p className="text-gray-600">Continue your journey of growth and empowerment</p>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
                placeholder="Search resources..."
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              New Post
            </Button>
          </div>
        </div>

        {activeSection === 'mentor' && renderMentorSection()}
        {activeSection === 'skills' && renderSkillSection()}
      </main>
    </div>
  );
};

export default Dashboard;