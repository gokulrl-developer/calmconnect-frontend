import React, { useState } from 'react';
import { EyeIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';

interface PsychologistsProps {
  onViewDetails?: (id: string) => void;
}

interface Psychologist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  rating: number;
  sessionsCount: number;
  status: 'active' | 'inactive';
  joinDate: string;
  qualifications: string[];
  about: string;
}

const PsychologistDetails: React.FC<PsychologistsProps> = ({ onViewDetails }) => {
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([
    {
      id: 'P001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      specialization: 'Anxiety & Depression',
      experience: '8 years',
      rating: 4.8,
      sessionsCount: 156,
      status: 'active',
      joinDate: '2023-01-15',
      qualifications: ['PhD in Clinical Psychology', 'Licensed Psychologist', 'CBT Certification'],
      about: 'Experienced clinical psychologist specializing in anxiety and depression treatment.'
    },
    {
      id: 'P002',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      specialization: 'Trauma & PTSD',
      experience: '12 years',
      rating: 4.9,
      sessionsCount: 142,
      status: 'active',
      joinDate: '2022-08-10',
      qualifications: ['PhD in Psychology', 'EMDR Certified', 'Trauma Specialist'],
      about: 'Specialized in trauma therapy with extensive experience in EMDR treatments.'
    },
    {
      id: 'P003',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      specialization: 'Family Counseling',
      experience: '6 years',
      rating: 4.7,
      sessionsCount: 128,
      status: 'inactive',
      joinDate: '2023-03-20',
      qualifications: ['MA in Marriage & Family Therapy', 'Licensed MFT', 'Gottman Method Certified'],
      about: 'Family therapist with expertise in couples counseling and family dynamics.'
    }
  ]);

  const handleStatusToggle = (psychologistId: string) => {
    setPsychologists(prev => 
      prev.map(psych => 
        psych.id === psychologistId 
          ? { ...psych, status: psych.status === 'active' ? 'inactive' : 'active' }
          : psych
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Psychologist Management</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {psychologists.filter(p => p.status === 'active').length} active psychologists
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['active', 'inactive'].map((status) => (
          <Card key={status} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {psychologists.filter(p => p.status === status).length}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[0]}`}></div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Psychologist</th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Specialization</th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Experience</th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Rating</th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Sessions</th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {psychologists.map((psychologist) => (
                <tr 
                  key={psychologist.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <td className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <AcademicCapIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{psychologist.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{psychologist.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-gray-800 dark:text-white">{psychologist.specialization}</td>
                  <td className="p-6 text-gray-800 dark:text-white">{psychologist.experience}</td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800 dark:text-white">{psychologist.rating}</span>
                    </div>
                  </td>
                  <td className="p-6 text-gray-800 dark:text-white">{psychologist.sessionsCount}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(psychologist.status)}`}>
                      {psychologist.status.charAt(0).toUpperCase() + psychologist.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetails?.(psychologist.id)}
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant={psychologist.status === 'active' ? 'warning' : 'success'}
                        size="sm"
                        onClick={() => handleStatusToggle(psychologist.id)}
                      >
                        {psychologist.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default PsychologistDetails;