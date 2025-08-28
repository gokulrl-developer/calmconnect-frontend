import React, { useEffect } from 'react';
import { fetchDashboard } from '../../services/psychologistService';
import { setVerification } from '../../features/authentication/authSlice';
import { useAppDispatch } from '../../hooks/customReduxHooks';
import { Calendar, Clock, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const Dashboard: React.FC = () => {
const dispatch=useAppDispatch()

  useEffect(() => {
      async function loadDashboard() {
        try {
          const result = await fetchDashboard();
          if (result.data.psych) {
            dispatch(setVerification(result.data.psych.isVerified));
          }
        } catch (error) {}
      }
        loadDashboard();
    }, []);

  const stats = [
    {
      title: "Today's Sessions",
      value: "3",
      icon: Calendar,
      color: "bg-blue-500",
      change: "+2 from yesterday"
    },
    {
      title: "Upcoming Sessions",
      value: "7",
      icon: Clock,
      color: "bg-green-500",
      change: "Next: 2:00 PM"
    },
    {
      title: "Total Sessions",
      value: "142",
      icon: Users,
      color: "bg-purple-500",
      change: "+15 this month"
    },
    {
      title: "Active Complaints",
      value: "2",
      icon: AlertTriangle,
      color: "bg-red-500",
      change: "1 pending review"
    }
  ];

  const recentSessions = [
    { id: 1, patient: "John D.", time: "10:00 AM", status: "Completed", rating: 5 },
    { id: 2, patient: "Sarah M.", time: "11:30 AM", status: "Completed", rating: 4 },
    { id: 3, patient: "Mike R.", time: "2:00 PM", status: "Upcoming", rating: null },
    { id: 4, patient: "Anna L.", time: "3:30 PM", status: "Upcoming", rating: null },
  ];

  // Mock data for the chart
  const chartData = [
    { week: 'Week 1', sessions: 12 },
    { week: 'Week 2', sessions: 15 },
    { week: 'Week 3', sessions: 18 },
    { week: 'Week 4', sessions: 22 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
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
        {/* Sessions Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Sessions This Month
            </h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {item.week}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(item.sessions / 25) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {item.sessions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Sessions
          </h3>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-gray-50/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {session.patient.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {session.patient}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </span>
                  {session.rating && (
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < session.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;