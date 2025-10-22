import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import {
  cancelSessionAPI,
  fetchSessionsByUserAPI,
} from "../../services/userService";
import { handleApiError } from "../../services/axiosInstance";
import type { SessionListingUserItem } from "../../types/api/user.types";
import type paginationData from "../../types/pagination.types";
import Modal from "../../components/UI/Modal";
import { useNavigate } from "react-router-dom";

const UserSessions: React.FC = () => {
  const navigate=useNavigate()
  const [sessions, setSessions] = useState<SessionListingUserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<paginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cancelSessionId, setCancelSessionId] = useState<string | null>(null);
  const loadSessions = async (page: number = 1, status: string = "all") => {
    setLoading(true);
    try {
      const queryParams = `?page=${page}&limit=${pagination.pageSize}${
        status !== "all" ? `&status=${status}` : ""
      }`;

      const result = await fetchSessionsByUserAPI(queryParams);

      if (result.data) {
        setSessions(result.data.sessions);
        setPagination(result.data.paginationData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions(pagination.currentPage, statusFilter);
  }, [statusFilter]);

  const joinSession = (sessionId: string) => {
    navigate(`/user/sessions/${sessionId}/video`);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "available":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDateTime = (dateString?: string | Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadSessions(newPage, statusFilter);
    }
  };

  const handleCancelSession = async () => {
    const sessionId = cancelSessionId;
    try {
      const result = await cancelSessionAPI(sessionId!);
      if (result.data) {
        setShowConfirmationModal(false);
        setCancelSessionId(null);
        loadSessions();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        My Sessions
      </h1>

      {/* Status Filter */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Filter by status:
        </span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="all">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-300">
              Loading...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Psychologist
                  </th>
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Start Time
                  </th>
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    End Time
                  </th>
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500 dark:text-gray-300"
                    >
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr
                      key={session.sessionId}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      <td className="p-6">
                        <div className="text-gray-800 dark:text-white font-medium">
                          {session.psychFullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {session.psychEmail}
                        </div>
                      </td>
                      <td className="p-6 text-gray-800 dark:text-white">
                        {formatDateTime(session.startTime)}
                      </td>
                      <td className="p-6 text-gray-800 dark:text-white">
                        {formatDateTime(session.endTime)}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            session.status
                          )}`}
                        >
                          {session.status.charAt(0).toUpperCase() +
                            session.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-6 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setCancelSessionId(session.sessionId);
                            setShowConfirmationModal(true);
                          }}
                          disabled={session.status !== "scheduled"}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={
                            session.status !== "scheduled" ||
                            new Date(session.startTime).getTime() - Date.now() >
                              5 * 60 * 1000 || // 5 minutes
                            new Date(session.endTime).getTime() < Date.now()
                          }
                          onClick={() => joinSession(session.sessionId)}
                        >
                          Join
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            size="sm"
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            Previous
          </Button>
          <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
            {pagination.currentPage} / {pagination.totalPages || 1}
          </span>
          <Button
            size="sm"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
          setCancelSessionId(null);
        }}
        title={`Cancel Session`}
      >
        <div className="space-y-4 p-3">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Are you sure you want to cancell this session? <br />
                This action cannot be undone.
                <br />
                You will get refund only if you cancel three days prior to the
                sheduled session.
              </h4>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmationModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleCancelSession}>
              Proceed to Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserSessions;
