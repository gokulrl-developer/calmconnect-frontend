import React, { useEffect, useState } from "react";
import { fetchDashboard } from "../../services/psychologistService";
import { useAppDispatch } from "../../hooks/customReduxHooks";
import { Calendar, Clock, Users, Star, IndianRupee } from "lucide-react";
import Card from "../../components/UI/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PsychologistDashboardResponse } from "../../types/api/psychologist.types";
import type { RecentSessionEntry } from "../../types/api/psychologist.types";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [dashboard, setDashboard] =
    useState<PsychologistDashboardResponse | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await fetchDashboard();
        if (result.data.dashboard) {
          setDashboard(result.data.dashboard);
          console.log(result.data.dashboard);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }
    loadDashboard();
  }, [dispatch]);

  const summary = dashboard?.summary;
  const sessionsTrend = dashboard?.sessionsTrend || [];
  const revenueTrend = dashboard?.revenueTrend || [];
  const recentSessions = dashboard?.recentSessions || [];

  const stats = [
    {
      title: "Today's Sessions",
      value: summary?.sessionSummary.todaySessions ?? 0,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Upcoming Sessions",
      value: summary?.sessionSummary.upcomingSessions ?? 0,
      icon: Clock,
      color: "bg-green-500",
      change: `Upcoming: ${summary?.sessionSummary.nextSessionTime || "N/A"}`,
    },
    {
      title: "Total Sessions",
      value: summary?.sessionSummary.totalSessions ?? 0,
      icon: Users,
      color: "bg-purple-500",
      change: `This Month: ${summary?.sessionSummary.thisMonthSessions ?? 0}`,
    },
    {
      title: "Average Rating",
      value: summary?.ratingSummary.current?.toFixed(1) ?? 0,
      icon: Star,
      color: "bg-yellow-500",
      change: `Last Month: ${summary?.ratingSummary.lastMonth ?? 0}`,
    },
    {
      title: "Revenue (₹)",
      value: summary?.revenueSummary.current ?? 0,
      icon: IndianRupee,
      color: "bg-green-600",
      change: `Last Month: ₹${summary?.revenueSummary.lastMonth ?? 0}`,
    },
  ];

 
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.title === "Revenue (₹)"
                      ? `₹${stat.value.toLocaleString()}`
                      : stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sessions in Past 4 Weeks
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sessionsTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue in Past 4 Weeks
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Sessions
        </h3>
        <div className="space-y-4">
          {recentSessions.map((entry: RecentSessionEntry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-gray-50/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={entry.profilePicture}
                  alt={`${entry.firstName} ${entry.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {entry.firstName} {entry.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.startTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.status === "ended"
                      ? "bg-green-100 text-green-800"
                      : entry.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
