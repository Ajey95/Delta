// Description: This page is the landing page for the WomenAI project. It includes a hero section, features section, and a call-to-action section. The hero section includes a title, description, and statistics. The features section includes three cards with icons, titles, and descriptions. The call-to-action section includes a title, description, and a button to start the journey.
import { Award, Brain, Heart, Users, ArrowRight, ChevronRight, Globe, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './app1';



const LandingPage = () => {
  const stats = [
    { number: '10K+', label: 'Women Empowered' },
    { number: '50+', label: 'AI Projects' },
    { number: '100+', label: 'Mentors' },
    { number: '30+', label: 'Countries' }
  ];
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  const handleNavigation = (path: string) => {
    navigate(path);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="text-2xl font-bold text-purple-900 cursor-pointer" 
            onClick={() => handleNavigation('/')}
          >
            WomenAI
          </div>
          <div className="flex gap-8 items-center">
            <button 
              onClick={() => handleNavigation('/about')}
              className="text-gray-600 hover:text-purple-700"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation('/features')}
              className="text-gray-600 hover:text-purple-700"
            >
              Features
            </button>
            <button 
              onClick={() => handleNavigation('/community')}
              className="text-gray-600 hover:text-purple-700"
            >
              Community
            </button>
            <Button 
              className="bg-purple-700 hover:bg-purple-800"
              onClick={handleGetStarted}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Join Now'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-bold leading-tight text-gray-900 mb-6">
                Transforming Tech
                <span className="text-purple-700"> Through Women's Innovation</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join a community of visionary women leveraging AI to shape the future of technology.
              </p>
              <div className="flex gap-4">
                <Button 
                  className="bg-purple-700 hover:bg-purple-800 text-lg px-8 py-6"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
                <Button variant="outline" className="text-lg px-8 py-6">
                  Learn More <ChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30"></div>
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-30"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-purple-700">{stat.number}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Empowering Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Innovation Lab',
                description: 'Access cutting-edge AI tools and resources designed for women innovators'
              },
              {
                icon: Users,
                title: 'Mentor Network',
                description: 'Connect with industry leaders and receive personalized guidance'
              },
              {
                icon: Globe,
                title: 'Global Community',
                description: 'Join a worldwide network of women transforming the tech landscape'
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-8">
                  <feature.icon className="w-12 h-12 text-purple-700 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-700 to-purple-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-6 text-purple-300" />
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of women worldwide who are using AI to innovate and lead in technology.
          </p>
          <Button className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-6">
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
