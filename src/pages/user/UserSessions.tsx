import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import {
  cancelSessionAPI,
  createComplaintAPI,
  createReviewAPI,
  fetchSessionsByUserAPI,
} from "../../services/userService";
import { handleApiError } from "../../services/axiosInstance";
import type { SessionListingUserItem } from "../../types/api/user.types";
import type paginationData from "../../types/pagination.types";
import Modal from "../../components/UI/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Table from "../../components/UI/Table";

const UserSessions: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionListingUserItem[]>([]);
  const [sessionDetails, setSessionDetails] =
    useState<SessionListingUserItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pagination, setPagination] = useState<paginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cancelSessionId, setCancelSessionId] = useState<string | null>(null);
  const [showReportPsychologistModal, setShowReportPsychologistModal] =
    useState(false);
  const [complaintDescription, setComplaintDescription] = useState("");
  const [complaintDescriptionError, setComplaintDescriptionError] =
    useState("");
  const [reportSessionId, setReportSessionId] = useState<string | null>(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewCommentError, setReviewCommentError] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [reviewSessionId, setReviewSessionId] = useState<string | null>(null);
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

  const reportPsychologist = (sessionId: string) => {
    setReportSessionId(sessionId);
    setShowReportPsychologistModal(true);
  };
  const closeReportPsychologistModal = () => {
    setShowReportPsychologistModal(false);
    setReportSessionId(null);
    setComplaintDescription("");
    setComplaintDescriptionError("");
  };
  const handleReportPsychologist = async () => {
    if (!complaintDescription.trim()) {
      setComplaintDescriptionError("Please describe your concern.");
      return;
    }
    try {
      const result = await createComplaintAPI(
        reportSessionId!,
        complaintDescription
      );
      if (result.data) {
        closeReportPsychologistModal();
        toast.success(result.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const joinSession = (sessionId: string) => {
    navigate(`/user/sessions/${sessionId}/video`);
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

  function viewDetails(sessionId: string) {
    const sessionDetails = sessions.find(
      (session: SessionListingUserItem) => session.sessionId === sessionId
    );
    setSessionDetails(sessionDetails!);
    setShowDetailsModal(true);
  }

  const closeReviewModal = () => {
    setShowRateModal(false);
    setReviewComment("");
    setReviewCommentError("");
    setRating(null);
    setReviewSessionId(null);
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    if (reviewComment.trim().length > 300) {
      setReviewCommentError("Comment should not exceed 300 characters.");
      return;
    }
    if (!rating) {
      setRatingError("Rating is needed for submitting review.");
      return;
    }

    try {
      const result = await createReviewAPI({
        sessionId: reviewSessionId!,
        rating,
        comment: reviewComment.trim(),
      });

      if (result.data) {
        toast.success(result.data.message || "Review submitted successfully!");
        closeReviewModal();
      }
    } catch (error) {
      console.log("error on submitting review", error);
    }
  };
  function markRating(star: number) {
    setRating(star);
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
        <div className="overflow-x-auto">
          <Table<SessionListingUserItem, "sessionId">
            keyField="sessionId"
            data={sessions}
            loading={loading}
            columns={[
              {
                header: "Psychologist",
                render: (_, row) => (
                  <div>
                    <div className="text-gray-800 dark:text-white font-medium">
                      {row!.psychFullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {row!.psychEmail}
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      value as string
                    )}`}
                  >
                    {(value as string).charAt(0).toUpperCase() +
                      (value as string).slice(1)}
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
                          5 * 60 * 1000 || // 5 minutes
                        new Date(row!.endTime).getTime() < Date.now()
                      }
                      onClick={() => joinSession(row!.sessionId)}
                    >
                      Join
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => reportPsychologist(row!.sessionId)}
                    >
                      Report
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => viewDetails(row!.sessionId)}
                    >
                      Details
                    </Button>
                    {row!.status === "ended" && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => {
                          setShowRateModal(true);
                          setReviewSessionId(row!.sessionId);
                        }}
                      >
                        Rate
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
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

      {/* complaintRaise Modal */}
      <Modal
        isOpen={showReportPsychologistModal}
        onClose={closeReportPsychologistModal}
        title="Report Psychologist"
      >
        <div className="space-y-4 p-3">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Describe your issue below.
              </h4>
            </div>
          </div>
          <div className="rounded-lg p-4">
            {/* Complaint Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={complaintDescription}
                onChange={(e) => {
                  setComplaintDescription(e.target.value);
                  if (
                    typeof e.target.value.trim() === "string" &&
                    e.target.value.trim() !== ""
                  ) {
                    setComplaintDescriptionError("");
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                  complaintDescriptionError
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Describe the complaint"
              />
              {complaintDescriptionError && (
                <p className="text-red-500 text-sm">
                  {complaintDescriptionError}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={closeReportPsychologistModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReportPsychologist}>
              Proceed
            </Button>
          </div>
        </div>
      </Modal>
      {/* Rate and Review Modal */}
      <Modal
        isOpen={showRateModal}
        onClose={closeReviewModal}
        title="Rate and Review Psychologist"
      >
        <div className="space-y-4 p-3">
          {/* Rating Section */}
          <div className="flex flex-col items-center space-y-3">
            <h4 className="text-lg font-semibold text-gray-800">
              Rate your experience
            </h4>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => markRating(star)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= (rating || 0) ? "#facc15" : "none"}
                  stroke="#facc15"
                  strokeWidth="2"
                  className={`w-8 h-8 cursor-pointer transition-transform duration-200 hover:scale-110 ${
                    star <= (rating || 0)
                      ? "drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]"
                      : "hover:drop-shadow-[0_0_3px_rgba(250,204,21,0.4)]"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              ))}
            </div>
            {rating && (
              <p className="text-sm text-gray-600">
                You rated <span className="font-medium">{rating}</span> out of 5
              </p>
            )}
            {ratingError && (
              <p className="text-red-500 text-sm">{ratingError}</p>
            )}
          </div>

          {/* Review Textarea */}
          <div className="rounded-lg p-4">
            <div className="space-y-2">
              <label
                htmlFor="reviewComment"
                className="block text-sm font-medium text-gray-700"
              >
                Comment (optional)
              </label>
              <textarea
                id="reviewComment"
                value={reviewComment}
                onChange={(e) => {
                  setReviewComment(e.target.value);
                  setReviewCommentError("");
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                  reviewCommentError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Share your experience..."
              />
              {reviewCommentError && (
                <p className="text-red-500 text-sm">{reviewCommentError}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={closeReviewModal}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSubmitReview}>
              Submit Review
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
            {/* Psychologist Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Psychologist
              </h4>
              <p>{sessionDetails.psychFullName || "N/A"}</p>
              <p className="text-sm text-gray-500">
                {sessionDetails.psychEmail || "N/A"}
              </p>
            </div>

            {/* Session Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Session Information
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <span className="font-medium">Session Id:</span> #
                  {sessionDetails.sessionId.split("").slice(-5).join("")}
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
                  {sessionDetails.durationInMins} minutes
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Payment
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <span className="font-medium">Amount:</span> ₹
                  {sessionDetails.fees}
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Status
              </h4>
              <p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    sessionDetails.status
                  )}`}
                >
                  {sessionDetails.status.charAt(0).toUpperCase() +
                    sessionDetails.status.slice(1)}
                </span>
              </p>
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

export default UserSessions;
