import React, { useState } from 'react';
import { Bell, MessageCircle, BookOpen, Award, 
         Calendar, TrendingUp, Target, Bookmark, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useDashboardData, useAIMentor } from './newdashboard';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' }
];

const Dashboard: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const {
    userData,
    achievements,
    notifications,
    insights,
    courses,
    loading,
    error
  } = useDashboardData();

  const {
    question: mentorQuestion,
    setQuestion: setMentorQuestion,
    response: mentorResponse,
    loading: aiLoading,
    getAdvice: handleMentorQuestion
  } = useAIMentor();

  const renderNotifications = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Recent Notifications
        </h3>
        <div className="space-y-4">
          {notifications.map((notification: { id: string; title: string; time: string; read: boolean }) => (
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
          {insights.map((insight: { id: string; title: string; type: string }) => (
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
          {courses.map((course: { name: string; description: string; link: string }, index: number) => (
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
          {achievements.map((achievement: { id: string; title: string; progress: number }) => (
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
              {userData?.expertise?.map((tag: string) => (
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
              disabled={aiLoading}
            >
              {aiLoading ? 'Getting Advice...' : 'Get Personalized Advice'}
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
            {[
              { icon: Calendar, title: 'Schedule Mentoring Session', desc: 'Book a one-on-one session' },
              { icon: MessageCircle, title: 'Join Community Discussion', desc: 'Connect with other entrepreneurs' },
              { icon: Bookmark, title: 'Save Resources', desc: 'Build your learning library' },
              { icon: Share2, title: 'Share Your Journey', desc: 'Inspire others with your story' }
            ].map((action, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <action.icon className="h-5 w-5 mr-3 text-purple-600" />
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-gray-600">{action.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 p-4 text-center">
      Error: {error}
    </div>
  );
  
  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
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

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {renderMentorSection()}
          </div>

          <div className="space-y-6">
            {renderAchievements()}
            {renderNotifications()}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {renderInsights()}
          {renderCourses()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;