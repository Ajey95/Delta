import React from 'react';
import { 
  Users, 
  Target, 
  Heart, 
  Award,
  ArrowRight,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Ajey Bharghava JashwanthReddy V',
      role: 'Founder & CEO',
      image: '/api/placeholder/400/400',
      bio: 'AI researcher with 10+ years experience in machine learning and a passion for increasing diversity in tech.',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    },
    {
      name: 'Nikhil  Mamilla',
      role: 'CTO',
      image: '/api/placeholder/400/400',
      bio: 'Former Tech Lead at major AI companies, specializing in natural language processing and ethical AI development.',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    },
    {
      name: 'Bindu Sathwika',
      role: 'Head of Community',
      image: '/api/placeholder/400/400',
      bio: 'Community builder and advocate for women in STEM, with experience in leading global tech initiatives.',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'Pushing boundaries in AI while maintaining ethical standards and inclusive practices.'
    },
    {
      icon: Heart,
      title: 'Empowerment',
      description: 'Creating opportunities for women to lead and excel in the AI industry.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive network of women helping women succeed in technology.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Maintaining high standards in everything we do, from mentorship to project development.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-purple-700">Team Delta</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We are a passionate group of technologists and innovators committed to bridging the gender gap in AI and technology through education, mentorship, and community building.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <value.icon className="w-12 h-12 text-purple-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Meet Team Delta</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
                  <p className="text-purple-700 text-center mb-4">{member.role}</p>
                  <p className="text-gray-600 text-center mb-6">{member.bio}</p>
                  <div className="flex justify-center gap-4">
                    <a href={member.social.linkedin} className="text-gray-600 hover:text-purple-700">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={member.social.github} className="text-gray-600 hover:text-purple-700">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-600 hover:text-purple-700">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-700 to-purple-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            To create a more inclusive AI industry by empowering women with the tools, knowledge, and support they need to become leaders in artificial intelligence and technology.
          </p>
          <Button 
            className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-6"
            onClick={() => navigate('/join')}
          >
            Join Our Community <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;