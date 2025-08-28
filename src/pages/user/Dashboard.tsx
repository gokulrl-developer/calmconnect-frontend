import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { 
  Calendar, 
  MessageCircle, 
  User, 
  Clock, 
  Star, 
  Bell,
  CreditCard,
  FileText,
  Shield,
  Users
} from 'lucide-react';
import { fetchDashboard } from '../../services/userService';

const Dashboard = () => {

  useEffect(() => {
        async function loadDashboard() {
          try {
            const result = await fetchDashboard();
          } catch (error) {}
        }
          loadDashboard();
      }, []);

  const upcomingSessions = [
    {
      id: 1,
      psychologist: 'Dr. Sarah Johnson',
      date: '2024-02-15',
      time: '10:00 AM',
      type: 'Individual Therapy'
    },
    {
      id: 2,
      psychologist: 'Dr. Michael Chen',
      date: '2024-02-18',
      time: '2:00 PM',
      type: 'Anxiety Support'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Session completed with Dr. Sarah Johnson', time: '2 hours ago' },
    { id: 2, action: 'New message from Dr. Michael Chen', time: '1 day ago' },
    { id: 3, action: 'Payment processed successfully', time: '3 days ago' }
  ];

  const quickActions = [
    { title: 'Book Session', icon: Calendar, href: '/user/book', color: 'bg-blue-500' },
    { title: 'My Sessions', icon: Clock, href: '/user/sessions', color: 'bg-green-500' },
    { title: 'Messages', icon: MessageCircle, href: '/user/followup-chats', color: 'bg-purple-500' },
    { title: 'Profile', icon: User, href: '/user/profile', color: 'bg-orange-500' },
    { title: 'Notifications', icon: Bell, href: '/user/notifications', color: 'bg-red-500' },
    { title: 'Payments', icon: CreditCard, href: '/user/transactions', color: 'bg-indigo-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your mental health journey</p>
        </div>
        <Link to="/user/book">
          <Button>Book New Session</Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.href}>
            <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer" hover>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-3 rounded-full ${action.color} bg-opacity-20`}>
                  <action.icon className="w-6 h-6 text-gray-800" />
                </div>
                <span className="text-sm font-medium text-gray-800">{action.title}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <Card className="p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Sessions</h2>
              <Link to="/user/sessions">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
            
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary-500/20 rounded-full">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{session.psychologist}</h3>
                        <p className="text-sm text-gray-600">{session.type}</p>
                        <p className="text-sm text-gray-600">{session.date} at {session.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">Join</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming sessions</p>
                <Link to="/user/book">
                  <Button className="mt-4">Book Your First Session</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-1 bg-primary-500/20 rounded-full mt-1">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-full">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">4.8</p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">24</p>
              <p className="text-sm text-gray-600">Messages</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">3</p>
              <p className="text-sm text-gray-600">Psychologists</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;