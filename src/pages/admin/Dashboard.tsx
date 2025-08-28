import React from 'react';
import { useState } from 'react';
import { UserIcon, AcademicCapIcon, CalendarDaysIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('this-week');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');

  const stats = [
    { 
      title: 'Total Users', 
      value: '1,234', 
      change: '+12.3%', 
      icon: UserIcon, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Total Psychologists', 
      value: '89', 
      change: '+5.2%', 
      icon: AcademicCapIcon, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Sessions This Week', 
      value: '456', 
      change: '+18.7%', 
      icon: CalendarDaysIcon, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Open Complaints', 
      value: '12', 
      change: '-25.0%', 
      icon: ExclamationTriangleIcon, 
      color: 'bg-red-500' 
    }
  ];

  const sessionData = [
    { day: 'Mon', sessions: 45 },
    { day: 'Tue', sessions: 52 },
    { day: 'Wed', sessions: 48 },
    { day: 'Thu', sessions: 61 },
    { day: 'Fri', sessions: 55 },
    { day: 'Sat', sessions: 42 },
    { day: 'Sun', sessions: 38 }
  ];

  const registrationData = [
    { week: 'Week 1', users: 45 },
    { week: 'Week 2', users: 52 },
    { week: 'Week 3', users: 48 },
    { week: 'Week 4', users: 61 }
  ];

  const topPsychologists = [
    { name: 'Dr. Sarah Johnson', sessions: 156 },
    { name: 'Dr. Michael Chen', sessions: 142 },
    { name: 'Dr. Emily Rodriguez', sessions: 128 },
    { name: 'Dr. David Kim', sessions: 119 },
    { name: 'Dr. Lisa Anderson', sessions: 98 }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          >
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {timeRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">From:</span>
              <input
                type="date"
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">To:</span>
              <input
                type="date"
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
              />
              <Button variant="primary" size="sm">
                Apply
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sessions This Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">New Registrations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Bar dataKey="users" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Psychologists by Sessions</h3>
        <div className="space-y-4">
          {topPsychologists.map((psychologist, index) => (
            <div key={index} className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{psychologist.name.split(' ')[1][0]}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{psychologist.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{psychologist.sessions} sessions</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(psychologist.sessions / 156) * 100}%` }}
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{psychologist.sessions}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;