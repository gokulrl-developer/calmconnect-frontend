import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { 
  Video, 
  Shield, 
  Users, 
  MessageCircle, 
  CheckCircle, 
  Heart,
  Clock,
  Star,
  Phone,
  Monitor
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const topPsychologists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Anxiety & Depression',
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Cognitive Behavioral Therapy',
      rating: 4.8,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Trauma & PTSD',
      rating: 4.9,
      reviews: 178,
      image: 'https://images.unsplash.com/photo-1594824475550-87d7cfcc42ef?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialization: 'Family Therapy',
      rating: 4.7,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      text: 'CalmConnect helped me find the perfect therapist. The platform is so easy to use!',
      rating: 5,
    },
    {
      name: 'Michael R.',
      text: 'Professional, secure, and convenient. Exactly what I needed for my mental health journey.',
      rating: 5,
    },
    {
      name: 'Emma L.',
      text: 'The booking process is seamless and the therapists are highly qualified.',
      rating: 5,
    },
  ];

  const stats = [
    { number: '5,000+', label: 'Registered Users' },
    { number: '250+', label: 'Licensed Psychologists' },
    { number: '15,000+', label: 'Sessions Completed' },
    { number: '4.8/5', label: 'Average Rating' }
  ];

  const features = [
    {
      icon: Video,
      title: 'Online Therapy Sessions',
      description: 'Access professional therapy from the comfort of your home. No travel required.',
      benefit: 'Convenient & Accessible'
    },
    {
      icon: Users,
      title: 'Individual Sessions',
      description: 'Personalized one-on-one therapy sessions tailored to your specific needs.',
      benefit: 'Personalized Care'
    },
    {
      icon: CheckCircle,
      title: 'Verified Professionals',
      description: 'All our psychologists are licensed and thoroughly vetted for quality assurance.',
      benefit: 'Trusted Experts'
    },
    {
      icon: MessageCircle,
      title: 'Follow-up Support',
      description: 'Stay connected with your therapist through secure messaging between sessions.',
      benefit: 'Ongoing Support'
    },
    {
      icon: Clock,
      title: 'Easy Booking',
      description: 'Simple, user-friendly booking system to schedule your sessions in minutes.',
      benefit: 'Hassle-free'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Comprehensive complaint resolution system ensuring your safety and satisfaction.',
      benefit: 'Peace of Mind'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">CalmConnect</span>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-800 transition-colors">Features</a>
              <a href="#therapists" className="text-gray-600 hover:text-gray-800 transition-colors">Therapists</a>
              <a href="#about" className="text-gray-600 hover:text-gray-800 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-800 transition-colors">Contact</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary"
                onClick={() => navigate('/psychologist/login')}
                className="hidden sm:flex"
              >
                Psychologist Login
              </Button>
              <Button 
                variant="secondary"
                onClick={() => navigate('/user/login')}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent leading-tight">
                Professional Online Therapy
                <br />
                <span className="text-gray-800">From Home</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with verified licensed therapists for personalized online therapy sessions. 
                Start your mental health journey with trusted professionals today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/auth/signup')}
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Start Online Therapy
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/auth/login')}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Sign In
                </Button>
              </div>
            </div>

            {/* Right: Large Hero Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"
                  alt="Online therapy session from home"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Trust Banner with Glassmorphism */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Licensed Professionals</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <Star className="w-4 h-4" />
              <span>4.8/5 User Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Why Choose Online Therapy?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience professional therapy designed for modern life - accessible, personal, and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const cardColors = [
                'bg-blue-50 border-blue-200',
                'bg-green-50 border-green-200', 
                'bg-purple-50 border-purple-200',
                'bg-teal-50 border-teal-200',
                'bg-orange-50 border-orange-200',
                'bg-pink-50 border-pink-200'
              ];
              const iconColors = [
                'text-blue-600 bg-blue-100',
                'text-green-600 bg-green-100',
                'text-purple-600 bg-purple-100', 
                'text-teal-600 bg-teal-100',
                'text-orange-600 bg-orange-100',
                'text-pink-600 bg-pink-100'
              ];
              return (
                <Card key={index} className={`p-6 text-center border ${cardColors[index % cardColors.length]} shadow-lg`} hover>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${iconColors[index % iconColors.length]} shadow-lg`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {feature.description}
                  </p>
                  <div className="inline-block bg-secondary-100 text-secondary-700 px-3 py-1 text-xs font-medium rounded-full">
                    {feature.benefit}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Large Feature Section - Image Left, Text Right */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="lg:pr-8">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&h=500&fit=crop"
                alt="Professional online therapy session"
                className="w-full h-auto shadow-xl rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Professional Therapy, Personalized for You
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform connects you with verified, licensed therapists who specialize in individual therapy sessions. 
                Each session is tailored to your unique needs, ensuring you receive the most effective care possible.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Licensed Professionals</div>
                    <div className="text-sm text-gray-600">All therapists verified</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Individual Focus</div>
                    <div className="text-sm text-gray-600">One-on-one sessions</div>
                  </div>
                </div>
              </div>
              <Button variant="primary" size="lg" className="mt-6">
                Browse Therapists
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Image Banner */}
      <div className="relative h-64 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=400&fit=crop')"}}>
        <div className="absolute inset-0 bg-gray-900/80"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Connected Between Sessions
            </h3>
            <p className="text-gray-200 mb-6">
              Our platform enables secure messaging with your therapist, perfect for follow-up questions and ongoing support.
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-medium text-white">Secure Messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-medium text-white">Quick Response</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Psychologists Section - Compact */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Meet Our Top-Rated Therapists
            </h2>
            <p className="text-lg text-gray-600">
              Connect with experienced mental health professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topPsychologists.map((psychologist, index) => {
              const cardColors = [
                'bg-indigo-50 border-indigo-200',
                'bg-emerald-50 border-emerald-200',
                'bg-rose-50 border-rose-200', 
                'bg-amber-50 border-amber-200'
              ];
              return (
                <Card 
                  key={psychologist.id} 
                  className={`p-4 text-center border ${cardColors[index % cardColors.length]} shadow-lg`}
                  hover
                >
                  <img 
                    src={psychologist.image}
                    alt={psychologist.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover shadow-lg border-2 border-white"
                  />
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">
                    {psychologist.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {psychologist.specialization}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{psychologist.rating}</span>
                    <span className="text-gray-500">({psychologist.reviews})</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section - Text Right, Image Left */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=700&h=500&fit=crop"
                alt="Simple booking process"
                className="w-full h-auto shadow-xl rounded-lg"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Simple Booking, Powerful Results
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our user-friendly platform makes it easy to book sessions, especially for follow-up appointments. 
                Whether you're starting fresh or continuing your therapy journey, we've streamlined the process.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-gray-800">Choose your therapist</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-gray-800">Pick a convenient time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-gray-800">Start your session online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Safety Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Your Safety is Our Priority
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We maintain the highest standards of safety and trust through our comprehensive complaint resolution system 
                and continuous monitoring of all therapy sessions.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">24/7 Support</div>
                    <div className="text-sm text-gray-600">Always here to help</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Crisis Support</div>
                    <div className="text-sm text-gray-600">Emergency assistance</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <img 
                src="https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=700&h=500&fit=crop"
                alt="Trust and safety in therapy"
                className="w-full h-auto shadow-xl rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section - Compact */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from people who found help through our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => {
              const cardColors = [
                'bg-cyan-50 border-cyan-200',
                'bg-violet-50 border-violet-200',
                'bg-lime-50 border-lime-200'
              ];
              return (
                <Card 
                  key={index} 
                  className={`p-5 border ${cardColors[index % cardColors.length]} shadow-lg`}
                  hover
                >
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-800 mb-3 italic text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="text-gray-600 font-medium text-sm">
                    — {testimonial.name}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-xl">
            <div className="text-center mb-4">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">CalmConnect</h3>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Start Your Mental Health Journey Today
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands who've found support through our platform. Professional therapy is just a few clicks away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/auth/signup')}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                Start Online Therapy
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/auth/login')}
              >
                Sign In
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>No waiting lists</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>100% confidential</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>Personalized care</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-3">CalmConnect</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Professional online therapy platform connecting you with verified licensed therapists.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Services</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Individual Therapy</div>
                <div>Follow-up Sessions</div>
                <div>Secure Messaging</div>
                <div>Crisis Support</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>HIPAA Compliance</div>
                <div>Safety Guidelines</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Support</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>help@calmconnect.com</div>
                <div>1-800-CALM-HELP</div>
                <div>24/7 Crisis Line</div>
                <div>FAQ & Help Center</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-6 pt-4 text-center text-sm text-gray-600">
            <p>&copy; 2024 CalmConnect. All rights reserved. • Professional online therapy platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;