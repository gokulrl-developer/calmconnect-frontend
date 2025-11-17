import React, { useEffect, useState } from "react";
import {
  UserIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  BarChart,
  AreaChart,
  Area,
} from "recharts";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import {
  fetchRegistrationTrendsAPI,
  fetchRevenueTrendsAPI,
  fetchSessionTrendsAPI,
  fetchTopPsychologistsAPI,
  fetchDashboardSummaryCardsAPI,
} from "../../services/adminService";
import type {
  AdminRegistrationTrendsEntry,
  AdminRevenueTrendsEntry,
  AdminSessionTrendsEntry,
  AdminTopPsychologistEntry,
  DashboardSummaryCardResponse,
} from "../../types/api/admin.types";

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("this-year");
  const [rangeMode, setRangeMode] = useState("this-year");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

  const [revenueData, setRevenueData] = useState<AdminRevenueTrendsEntry[]>([]);
  const [registrationData, setRegistrationData] = useState<
    AdminRegistrationTrendsEntry[]
  >([]);
  const [sessionData, setSessionData] = useState<AdminSessionTrendsEntry[]>([]);
  const [topPsychologists, setTopPsychologists] = useState<
    AdminTopPsychologistEntry[]
  >([]);
  const [summaryCardsData, setSummaryCardsData] =
    useState<DashboardSummaryCardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getDateRange = () => {
    const now = new Date();
    if (timeRange === "this-week") {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      return { fromDate: start.toISOString(), toDate: now.toISOString() };
    } else if (timeRange === "this-month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { fromDate: start.toISOString(), toDate: now.toISOString() };
    } else if (timeRange === "this-year") {
      const start = new Date(now.getFullYear(), 0, 1);
      return { fromDate: start.toISOString(), toDate: now.toISOString() };
    } else if (timeRange === "custom" && customFromDate && customToDate) {
      const start = new Date(customFromDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(customToDate);
      end.setHours(23, 59, 59, 999);

      return { fromDate: start.toISOString(), toDate: end.toISOString() };
    } else {
      return { fromDate: "", toDate: "" };
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const { fromDate, toDate } = getDateRange();
      if (!fromDate || !toDate) return;

      const [revenue, clients, sessions, top, summaryCards] = await Promise.all(
        [
          fetchRevenueTrendsAPI({ fromDate, toDate }),
          fetchRegistrationTrendsAPI({ fromDate, toDate }),
          fetchSessionTrendsAPI({ fromDate, toDate }),
          fetchTopPsychologistsAPI({ fromDate, toDate, limit: 5 }),
          fetchDashboardSummaryCardsAPI({ fromDate, toDate }),
        ]
      );

      setRevenueData(revenue.data.revenueTrends);
      setRegistrationData(clients.data.registrationTrends);
      setSessionData(sessions.data.sessionTrends);
      setTopPsychologists(top.data.topPsychologists);
      setSummaryCardsData(summaryCards.data.summaryCards);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-600 dark:text-gray-300">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Time Range:
          </span>
          <select
            value={rangeMode}
            onChange={(e) => {
              if (rangeMode !== "custom") {
                setTimeRange(e.target.value);
              }
              setRangeMode(e.target.value);
            }}
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          >
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {timeRange === "custom" && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                From:
              </span>
              <input
                type="date"
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                To:
              </span>
              <input
                type="date"
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
              />
              <Button variant="primary" size="sm" onClick={fetchDashboardData}>
                Apply
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCardsData && (
          <>
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {summaryCardsData.users.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{summaryCardsData.users.addedValue.toLocaleString()} in
                    selected range
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Psychologists
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {summaryCardsData.psychologists.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +
                    {summaryCardsData.psychologists.addedValue.toLocaleString()}{" "}
                    in selected range
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Sessions
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {summaryCardsData.sessions.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{summaryCardsData.sessions.addedValue.toLocaleString()} in
                    selected range
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    ₹{summaryCardsData.revenue.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +₹{summaryCardsData.revenue.addedValue.toLocaleString()} in
                    selected range
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="label" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Session Volume Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sessionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="label" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="sessions" fill="#8B5CF6" barSize={20} />
              <Bar dataKey="cancelledSessions" fill="#EF4444" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Psychologist & User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={registrationData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorPsychologists"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Area
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="psychologists"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorPsychologists)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Psychologists */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Top Psychologists
        </h3>
        <div className="space-y-4">
          {topPsychologists &&
            topPsychologists.length > 0 &&
            topPsychologists.map((p, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {p.firstName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {p.sessionCount} sessions
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                      style={{
                        width: `${
                          (p.sessionCount /
                            (topPsychologists[0]?.sessionCount || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {p.sessionCount}
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
