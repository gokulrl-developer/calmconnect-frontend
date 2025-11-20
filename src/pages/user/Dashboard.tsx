import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import {
  Calendar,
  Clock,
  AlertTriangle,
  Star,
} from "lucide-react";
import { fetchDashboard } from "../../services/userService";
import type {
  UserDashboardResponse,
  UserRecentSessionsEntry,
  UserRecentTransactionsEntry,
  UserRecentComplaintsEntry,
} from "../../types/api/user.types"; 

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<UserDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetchDashboard();
        setDashboard(res.data.dashboard);
        console.log(res.data.dashboard)
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="text-center py-10 text-red-600">Failed to load dashboard data.</div>;
  }

  const { sessionSummary, recentSessions, recentTransactions, recentComplaints } = dashboard;

  const summaryCards = [
    { title: "Total Sessions", value: sessionSummary.totalSessions, icon: Clock, color: "bg-blue-500" },
    { title: "Completed Sessions", value: sessionSummary.completedSessions, icon: Star, color: "bg-green-500" },
    { title: "Upcoming Sessions", value: sessionSummary.upcomingSessions, icon: Calendar, color: "bg-purple-500" },
    { title: "Cancelled Sessions", value: sessionSummary.cancelledSessions, icon: AlertTriangle, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back!</h1>
          <p className="text-gray-600 mt-2">Here's a quick overview of your activities</p>
        </div>
        <Link to="/user/book">
          <Button>Book New Session</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="p-6 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${card.color} bg-opacity-20`}>
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-sm text-gray-600">{card.title}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Sessions & Transactions Side by Side */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Sessions</h2>
          <div className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((session: UserRecentSessionsEntry) => (
                <div
                  key={session.sessionId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    {session.profilePicture ? (
                      <img
                        src={session.profilePicture}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {session.firstName} {session.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === "ended"
                        ? "bg-green-100 text-green-800"
                        : session.status === "scheduled"
                        ? "bg-yellow-100 text-yellow-800"
                        : session.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent sessions found.</p>
            )}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((txn: UserRecentTransactionsEntry) => (
                <div
                  key={txn.transactionId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="text-sm text-gray-800">
                      {txn.referenceType === "booking"
                        ? `Session with Dr. ${txn.psychFirstName} ${txn.psychLastName}`
                        : `Refund from Session with Dr. ${txn.psychFirstName} ${txn.psychLastName}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(txn.time).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      txn.type === "credit"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {txn.type}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent transactions found.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card className="p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Complaints</h2>
        <div className="space-y-4">
          {recentComplaints.length > 0 ? (
            recentComplaints.map((comp: UserRecentComplaintsEntry) => (
              <div
                key={comp.complaintId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="text-sm text-gray-800">
                    Complaint against Dr. {comp.psychFirstName} {comp.psychLastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(comp.raisedTime).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    comp.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {comp.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No recent complaints found.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
