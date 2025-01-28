// pages/Community.tsx
// import React from 'react';
import { Users, MessageCircle, Calendar, Globe, Award, Heart } from 'lucide-react';
import { Card, CardContent} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const Community = () => {
  const upcomingEvents = [
    {
      title: 'AI for Social Good Workshop',
      date: 'March 15, 2024',
      time: '2:00 PM EST',
      attendees: 156
    },
    {
      title: 'Machine Learning Career Panel',
      date: 'March 18, 2024',
      time: '1:00 PM EST',
      attendees: 203
    },
    {
      title: 'Deep Learning Study Group',
      date: 'March 20, 2024',
      time: '3:00 PM EST',
      attendees: 89
    }
  ];

  const successStories = [
    {
      name: 'Sarah Chen',
      role: 'AI Research Scientist',
      company: 'Tech Innovation Labs',
      image: '/placeholder-1.jpg',
      quote: 'Through WomenAI, I found mentors who guided me to my dream role in AI research.'
    },
    {
      name: 'Maria Rodriguez',
      role: 'ML Engineer',
      company: 'Future AI',
      image: '/placeholder-2.jpg',
      quote: 'The community support helped me transition from data analysis to machine learning engineering.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Join Our <span className="text-purple-600">Global Community</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Connect with thousands of women in AI worldwide, share experiences, and grow together.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-purple-700 hover:bg-purple-800 text-lg px-8 py-6">
              Join Community
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, stat: '10,000+', label: 'Active Members' },
              { icon: Globe, stat: '50+', label: 'Countries' },
              { icon: MessageCircle, stat: '100+', label: 'Daily Discussions' },
              { icon: Award, stat: '500+', label: 'Success Stories' }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <item.icon className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{item.stat}</h3>
                  <p className="text-gray-600">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-2">{event.date}</p>
                  <p className="text-gray-600 mb-4">{event.time}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {event.attendees} attending
                    </span>
                    <Button variant="outline" size="sm">
                      Join Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={story.image} alt={story.name} />
                      <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{story.name}</h3>
                      <p className="text-purple-600">{story.role}</p>
                      <p className="text-gray-500 mb-4">{story.company}</p>
                      <p className="text-gray-600 italic">{story.quote}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community CTA */}
      <section className="py-16 px-6 bg-purple-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 text-pink-300" />
          <h2 className="text-3xl font-bold mb-6">Be Part of Our Growing Community</h2>
          <p className="text-xl mb-8">Join thousands of women worldwide who are shaping the future of AI.</p>
          <Button className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6">
            Join Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Community;