import React, { useState } from 'react';
import { ArrowLeftIcon, UserIcon, CalendarDaysIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface UserDetailsProps {
  userId?: string;
  onBack?: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId = 'U001', onBack }) => {
  const [user] = useState({
    id: 'U001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-10-15',
    status: 'active',
    lastLogin: '2024-01-20T10:30:00Z',
    profilePicture: null,
    dateOfBirth: '1990-05-15',
    address: '123 Main St, Anytown, ST 12345',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4568'
    },
    preferences: {
      sessionType: 'Video Call',
      preferredTime: 'Morning',
      language: 'English',
      notifications: true
    },
    sessions: [
      {
        id: 'S001',
        psychologist: 'Dr. Sarah Johnson',
        date: '2024-01-20T10:00:00Z',
        duration: 60,
        status: 'completed',
        rating: 5
      },
      {
        id: 'S002',
        psychologist: 'Dr. Sarah Johnson',
        date: '2024-01-13T10:00:00Z',
        duration: 60,
        status: 'completed',
        rating: 5
      },
      {
        id: 'S003',
        psychologist: 'Dr. Sarah Johnson',
        date: '2024-01-27T10:00:00Z',
        duration: 60,
        status: 'scheduled',
        rating: null
      }
    ],
    complaints: [
      {
        id: 'C001',
        type: 'technical',
        against: 'Dr. Sarah Johnson',
        date: '2024-01-20T10:00:00Z',
        status: 'open'
      }
    ],
    paymentHistory: [
      {
        id: 'P001',
        amount: 120,
        date: '2024-01-20T10:00:00Z',
        status: 'completed',
        sessionId: 'S001'
      },
      {
        id: 'P002',
        amount: 120,
        date: '2024-01-13T10:00:00Z',
        status: 'completed',
        sessionId: 'S002'
      }
    ],
    totalSessions: 12,
    totalSpent: 1440,
    averageRating: 4.8
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Profile</h1>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Member since {formatDate(user.joinDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Email:</span> {user.email}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Phone:</span> {user.phone}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Address:</span> {user.address}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Personal Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Date of Birth:</span> {formatDate(user.dateOfBirth)}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Last Login:</span> {formatDateTime(user.lastLogin)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Session History</h3>
            <div className="space-y-4">
              {user.sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Session #{session.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{session.psychologist}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(session.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {session.rating && (
                      <div className="flex items-center space-x-1">
                        {renderStars(session.rating)}
                      </div>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Payment History</h3>
            <div className="space-y-4">
              {user.paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Payment #{payment.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Session #{payment.sessionId}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(payment.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800 dark:text-white">${payment.amount}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="text-center p-4 glass-card rounded-lg">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{user.totalSessions}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
              </div>
              <div className="text-center p-4 glass-card rounded-lg">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">${user.totalSpent}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
              </div>
              <div className="text-center p-4 glass-card rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex">{renderStars(user.averageRating)}</div>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">{user.averageRating}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              </div>
            </div>
          </Card>

          {user.complaints.length > 0 && (
            <Card className="p-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4">Recent Complaints</h3>
              <div className="space-y-3">
                {user.complaints.map((complaint) => (
                  <div key={complaint.id} className="p-3 glass-card rounded-lg">
                    <p className="font-medium text-gray-800 dark:text-white text-sm">Complaint #{complaint.id}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{complaint.type} - Against {complaint.against}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(complaint.date)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Account Actions</h3>
            <div className="space-y-3">
              <Button variant="warning" className="w-full">
                Suspend Account
              </Button>
              <Button variant="success" className="w-full">
                Send Message
              </Button>
              <Button variant="primary" className="w-full">
                View Full History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;