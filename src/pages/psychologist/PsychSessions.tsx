import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import {
  cancelSessionAPI,
  fetchSessionsByPsychAPI,
} from "../../services/psychologistService";
import { handleApiError } from "../../services/axiosInstance";
import type paginationData from "../../types/pagination.types";
import type { SessionListingPsychItem } from "../../types/api/psychologist.types";
import Modal from "../../components/UI/Modal";
import { useNavigate } from "react-router-dom";
import Table from "../../components/UI/Table";
import { useUpdateQueryParams } from "../../hooks/useUpdateQueryParams";
import { useGetQueryParams } from "../../hooks/useGetQueryParams";
import Pagination from "../../components/Pagination";
import type PaginationData from "../../types/pagination.types";

const PsychSessions: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionListingPsychItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sessionDetails, setSessionDetails] =
    useState<SessionListingPsychItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cancelSessionId, setCancelSessionId] = useState<string | null>(null);
  const { updateQueryParams } = useUpdateQueryParams();
  const queryParams = useGetQueryParams();

  const loadSessions = async (status: string = "all") => {
    setLoading(true);
    try {
      const page = queryParams["page"];
      const currentPage = page ? Number(page) : 1;
      const params = `?page=${currentPage}&limit=${paginationData.pageSize}${
        status !== "all" ? `&status=${status}` : ""
      }`;

      const result = await fetchSessionsByPsychAPI(params);

      if (result.data) {
        setSessions(result.data.sessions);
        setPaginationData(result.data.paginationData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions(statusFilter);
  }, [statusFilter, paginationData.currentPage]);

  const joinSession = (sessionId: string) => {
    navigate(`/psychologist/sessions/${sessionId}/video`);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "ended":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
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
    updateQueryParams({ page: newPage });
    setPaginationData((prev) => ({ ...prev, currentPage: newPage }));
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
  function viewDetails(sessionId: string) {
    const sessionDetails = sessions.find(
      (session: SessionListingPsychItem) => session.sessionId === sessionId
    );
    setSessionDetails(sessionDetails!);
    setShowDetailsModal(true);
  }

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
          onChange={(e) => {
            updateQueryParams({ page: 1 });
            setStatusFilter(e.target.value);
            setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
          }}
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
        <Table<SessionListingPsychItem, "sessionId">
          keyField="sessionId"
          data={sessions}
          loading={loading}
          columns={[
            {
              header: "User",
              render: (_, row) => (
                <div>
                  <div className="text-gray-800 dark:text-white font-medium">
                    {row!.userFullName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {row!.userEmail}
                  </div>
                </div>
              ),
            },
            {
              header: "Start Time",
              accessor: "startTime",
              render: (value) => formatDateTime(value as string),
            },
            {
              header: "End Time",
              accessor: "endTime",
              render: (value) => formatDateTime(value as string),
            },
            {
              header: "Status",
              accessor: "status",
              render: (value) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    value ? getStatusColor(value as string) : ""
                  }`}
                >
                  {typeof value === "string" &&
                    value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              ),
            },
            {
              header: "Actions",
              render: (_, row) => (
                <div className="flex gap-2">
                  {row!.status === "scheduled" && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setCancelSessionId(row!.sessionId);
                        setShowConfirmationModal(true);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={
                      row!.status !== "scheduled" ||
                      new Date(row!.startTime).getTime() - Date.now() >
                        5 * 60 * 1000 ||
                      new Date(row!.endTime).getTime() < Date.now()
                    }
                    onClick={() => joinSession(row!.sessionId)}
                  >
                    Join
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => viewDetails(row!.sessionId)}
                  >
                    Details
                  </Button>
                </div>
              ),
            },
          ]}
        />

        {/* Pagination */}
        <Pagination
          paginationData={paginationData}
          setCurrentPage={(page: number) => handlePageChange(page)}
        />
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
                Repeated Cancelling of sessions may lead to punishment actions.
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

            {/* Session Info */}
            <div>
              <h4 className="text-lg font-semibold dark:text-white mb-1">
                Session Information
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Session Id:</span> #
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

            {/* Payment Info */}
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

            {/* Actions */}
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

export default PsychSessions;
