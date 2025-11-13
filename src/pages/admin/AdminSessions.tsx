import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import { handleApiError } from "../../services/axiosInstance";
import type paginationData from "../../types/pagination.types";
import type { SessionListingAdminItem } from "../../types/api/admin.types";
import { fetchSessionListingByAdminAPI } from "../../services/adminService";
import Table from "../../components/UI/Table";

const AdminSessions: React.FC = () => {
  const [sessions, setSessions] = useState<SessionListingAdminItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sessionDetails, setSessionDetails] =
    useState<SessionListingAdminItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pagination, setPagination] = useState<paginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  const loadSessions = async (page: number = 1, status: string = "all") => {
    setLoading(true);
    try {
      const queryParams = `?page=${page}&limit=${pagination.pageSize}${
        status !== "all" ? `&status=${status}` : ""
      }`;

      const result = await fetchSessionListingByAdminAPI(queryParams);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ended":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadSessions(newPage, statusFilter);
    }
  };

  const viewDetails = (sessionId: string) => {
    const session = sessions.find((s) => s.sessionId === sessionId);
    setSessionDetails(session || null);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Sessions
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
          <option value="ended">Ended</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <Card>
        <Table<SessionListingAdminItem>
          data={sessions}
          loading={loading}
          keyField="sessionId"
          columns={[
            {
              header: "User",
              render: (_, session) => (
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {session!.userFullName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {session!.userEmail}
                  </div>
                </div>
              ),
            },
            {
              header: "Psychologist",
              render: (_, session) => (
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {session!.psychFullName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {session!.psychEmail}
                  </div>
                </div>
              ),
            },
            {
              header: "Start Time",
              accessor: "startTime",
              render: (startTime) => (
                <span className="text-gray-800 dark:text-white">
                  {formatDateTime(startTime as string)}
                </span>
              ),
            },
            {
              header: "End Time",
              accessor: "endTime",
              render: (endTime) => (
                <span className="text-gray-800 dark:text-white">
                  {formatDateTime(endTime as string)}
                </span>
              ),
            },
            {
              header: "Status",
              accessor: "status",
              render: (status) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    status as string
                  )}`}
                >
                  {(status as string).charAt(0).toUpperCase() +
                    (status as string).slice(1)}
                </span>
              ),
            },
            {
              header: "Actions",
              render: (_, session) => (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => viewDetails(session!.sessionId)}
                >
                  Details
                </Button>
              ),
            },
          ]}
        />

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

      {/* Session Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Session Details"
      >
        {sessionDetails ? (
          <div className="space-y-4 p-3 text-gray-800 dark:text-gray-200">
            {/* User Info */}
            <div>
              <h4 className="text-lg font-semibold dark:text-white mb-1">
                User
              </h4>
              <p>{sessionDetails.userFullName || "N/A"}</p>
              <p className="text-sm text-gray-500">
                {sessionDetails.userEmail || "N/A"}
              </p>
            </div>

            {/* Psychologist Info */}
            <div>
              <h4 className="text-lg font-semibold dark:text-white mb-1">
                Psychologist
              </h4>
              <p>{sessionDetails.psychFullName || "N/A"}</p>
              <p className="text-sm text-gray-500">
                {sessionDetails.psychEmail || "N/A"}
              </p>
            </div>

            {/* Session Info */}
            <div>
              <h4 className="text-lg font-semibold dark:text-white mb-1">
                Session Information
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Session ID:</span> #
                  {sessionDetails.sessionId.slice(-5)}
                </p>
                <p>
                  <span className="font-medium">Start Time:</span>{" "}
                  {formatDateTime(sessionDetails.startTime)}
                </p>
                <p>
                  <span className="font-medium">End Time:</span>{" "}
                  {formatDateTime(sessionDetails.endTime)}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {sessionDetails.durationInMins} mins
                </p>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h4 className="text-lg font-semibold dark:text-white mb-1">
                Payment
              </h4>
              <p className="text-sm">
                <span className="font-medium">Amount:</span> ₹
                {sessionDetails.fees}
              </p>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-lg font-semibold dark:text-white mb-1">
                Status
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  sessionDetails.status
                )}`}
              >
                {sessionDetails.status.charAt(0).toUpperCase() +
                  sessionDetails.status.slice(1)}
              </span>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center p-4">
            Loading details...
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminSessions;
