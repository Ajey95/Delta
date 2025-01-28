//  pages/Features.tsx
// import React from 'react';
import { Brain, Code, Users, Star, BookOpen, Bot, Trophy, Target, Rocket } from 'lucide-react';
import { Card, CardContent} from '../components/ui/card';
import { Button } from '../components/ui/button';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Learning Paths',
      description: 'Personalized learning journeys from basics to advanced AI concepts, tailored for women in tech.',
      color: 'text-purple-600'
    },
    {
      icon: Code,
      title: 'Hands-on Projects',
      description: 'Real-world AI projects with step-by-step guidance and industry-standard tools.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Mentorship Program',
      description: 'Connect with experienced women leaders in AI for guidance and support.',
      color: 'text-pink-600'
    },
    {
      icon: Star,
      title: 'Career Development',
      description: 'Access to job opportunities, resume reviews, and interview preparation specific to AI roles.',
      color: 'text-yellow-600'
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Curated collection of articles, research papers, and case studies in AI.',
      color: 'text-green-600'
    },
    {
      icon: Bot,
      title: 'AI Tools Workshop',
      description: 'Learn to use popular AI tools and frameworks with hands-on exercises.',
      color: 'text-indigo-600'
    }
  ];

  const highlights = [
    {
      icon: Trophy,
      title: 'Success Stories',
      stats: '500+',
      description: 'Women who launched successful AI careers through our platform'
    },
    {
      icon: Target,
      title: 'Learning Hours',
      stats: '10K+',
      description: 'Hours of curated learning content and workshops'
    },
    {
      icon: Rocket,
      title: 'Projects Completed',
      stats: '2000+',
      description: 'AI projects completed by our community members'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Features that <span className="text-purple-600">Empower</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Discover tools and resources designed specifically for women pursuing careers in AI and technology.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <item.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-purple-600 mb-2">{item.stats}</h3>
                  <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-purple-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your AI Journey?</h2>
          <p className="text-xl mb-8">Join our community and access all these amazing features today.</p>
          <Button className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Features;