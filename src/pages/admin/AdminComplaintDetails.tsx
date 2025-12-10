import React, { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import {
  fetchComplaintDetailsAPI,
  fetchComplaintHistoryAPI,
  resolveComplaintAPI,
  updatePsychologistStatus,
} from "../../services/adminService";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/UI/Modal";
import type {
  ComplaintDetailsResponse,
  ComplaintHistoryResponse,
  ComplaintListItem,
} from "../../types/api/admin.types";
import { toast } from "sonner";
import type paginationData from "../../types/pagination.types";
import Table from "../../components/UI/Table";
import { produce } from "immer";

const AdminComplaintDetails: React.FC = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<ComplaintListItem[]>([]);
  const [pagination, setPagination] = useState<paginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 5,
  });
  const [complaint, setComplaint] = useState<ComplaintDetailsResponse | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [adminNotesError, setAdminNotesError] = useState<string>("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedComplaintDetails, setSelectedComplaintDetails] =
    useState<ComplaintDetailsResponse | null>(null);
  const [showUpdateStatusModal, setShowUpdateStatusModal] =
    useState<boolean>(false);
  useEffect(() => {
    fetchComplaints(pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage, complaint]);

  const fetchComplaints = async (page: number, limit: number) => {
    if (!complaint) {
      return;
    }
    try {
      const res = await fetchComplaintHistoryAPI(
        complaint.psychologistId!,
        page,
        limit
      );
      const data: ComplaintHistoryResponse = res.data;
      setComplaints(data.complaints);
      setPagination(data.paginationData);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };
  useEffect(() => {
    loadComplaint();
  }, [complaintId, navigate]);
  const loadComplaint = async () => {
    try {
      const res = await fetchComplaintDetailsAPI(complaintId!);
      setComplaint(res.data);
      if (res.data.adminNotes) setAdminNotes(res.data.adminNotes);
    } catch (err) {
      console.error("Error fetching complaint details:", err);
    }
  };

  const closeResolveModal = () => {
    setShowResolveModal(false);
    setAdminNotes("");
    setAdminNotesError("");
  };

  const handleResolveComplaint = async () => {
    if (!adminNotes.trim()) {
      setAdminNotesError("Admin notes are required to resolve the complaint.");
      return;
    }

    try {
      const res = await resolveComplaintAPI(complaintId!, adminNotes);
      if (res.data) {
        toast.success(res.data.message);
        closeResolveModal();
        loadComplaint();
      }
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };
  const formatDateTime = (dateString?: string | Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="flex flex-col leading-tight">
        <span>{datePart}</span>
        <span>{timePart}</span>
      </div>
    );
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
  };
  const viewDetails = async (id: string) => {
    try {
      const res = await fetchComplaintDetailsAPI(id);
      setSelectedComplaintDetails(res.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Failed to fetch complaint details:", err);
      toast.error("Failed to load complaint details.");
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedComplaintDetails(null);
  };
  if (!complaint) return <div>Loading...</div>;

  const handleStatusToggle = async () => {
    const newStatus =
      complaint.psychologistStatus === "active" ? "inactive" : "active";
    try {
      await updatePsychologistStatus(complaint.psychologistId, newStatus);
      setShowUpdateStatusModal(false);
      setComplaint((prev) =>
        produce(prev, (draft) => {
          draft!.psychologistStatus = newStatus;
        })
      );
    } catch (err) {
      console.error("Failed to update psychologist status", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Complaint Details
          </h1>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
            complaint.status
          )}`}
        >
          {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Info */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Complaint Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {complaint.description}
            </p>
            <div className="text-sm text-gray-800">
              <span className="font-medium">Created at:</span>{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </div>
          </Card>

          {/* Related Info */}
          <Card className="p-6 space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-white">
              Related Data
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium">User:</span>{" "}
                <span>{complaint.userFullName}</span>
                <div className="text-sm text-gray-800">
                  {complaint.userEmail}
                </div>
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={() =>
                    navigate(`/admin/user-details/${complaint.userId}`)
                  }
                >
                  View User
                </Button>
              </div>
              <div className="pt-3">
                <span className="font-medium">Psychologist:</span>{" "}
                <span>{complaint.psychologistFullName}</span>
                <div className="text-sm text-gray-800">
                  {complaint.psychologistEmail}
                </div>
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={() =>
                    navigate(
                      `/admin/psychologist-details/${complaint.psychologistId}`
                    )
                  }
                >
                  View Psychologist
                </Button>
              </div>
              {complaint.sessionId && (
                <div className="pt-3">
                  <span className="font-medium">Related Session:</span>
                  <div className="text-sm text-gray-800">
                    {new Date(complaint.sessionStartTime).toLocaleString()} -{" "}
                    {new Date(complaint.sessionEndTime).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-800">
                    Status: {complaint.sessionStatus} | Fees: ₹
                    {complaint.sessionFees}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Admin Notes */}
          {complaint && complaint.adminNotes && (
            <Card className="p-6 space-y-3">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Admin Notes
              </h3>
              <div>
                <p>{adminNotes}</p>
              </div>
              {adminNotesError && (
                <p className="text-red-500 text-sm">{adminNotesError}</p>
              )}
              {complaint.resolvedAt && (
                <p className="text-sm text-gray-800">
                  Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
                </p>
              )}
            </Card>
          )}

          {/* Resolve Action */}
          {complaint.status === "pending" && (
            <Card className="p-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4">
                Actions
              </h3>
              <Button
                variant="success"
                className="w-full flex items-center justify-center mb-1"
                onClick={() => setShowResolveModal(true)}
              >
                <CheckIcon className="w-4 h-4 mr-2" /> Resolve Complaint
              </Button>
              <Button
                variant={
                  complaint.psychologistStatus === "active"
                    ? "danger"
                    : "success"
                }
                className="w-full flex items-center justify-center mt-1"
                onClick={() => setShowUpdateStatusModal(true)}
              >
                <CheckIcon className="w-4 h-4 mr-2" />{" "}
                {complaint.psychologistStatus === "active"
                  ? "Block"
                  : "Unblock"}
              </Button>
            </Card>
          )}
        </div>
      </div>
      {/* Previous reports */}
      <Card className="p-6 space-y-4">
        {/* Filters Section  */}
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Previous Complaints Against The Psychologist
        </h1>
        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <Table<ComplaintListItem, "complaintId">
            keyField="complaintId"
            data={complaints}
            columns={[
              {
                header: "ID",
                render: (_, row) => (
                  <span className="text-gray-800 dark:text-white font-medium">
                    #{row!.complaintId.slice(-4)}
                  </span>
                ),
              },
              {
                header: "User",
                render: (_, row) => (
                  <div>
                    <div className="text-sm font-medium truncate text-gray-800 dark:text-white">
                      {row!.userFullName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {row!.userEmail}
                    </div>
                  </div>
                ),
              },
              {
                header: "Psychologist",
                render: (_, row) => (
                  <div>
                    <div className="text-sm font-medium truncate text-gray-800 dark:text-white">
                      {row!.psychologistFullName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {row!.psychologistEmail}
                    </div>
                  </div>
                ),
              },
              {
                header: "Status",
                accessor: "status",
                render: (value) => (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      value ? getStatusColor(value) : ""
                    }`}
                  >
                    {typeof value === "string" &&
                      value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                ),
              },
              {
                header: "Created At",
                accessor: "createdAt",
                render: (value) => formatDateTime(value),
              },
              {
                header: "Actions",
                render: (_, row) => (
                  <Button
                    variant="primary"
                    onClick={() => viewDetails(row!.complaintId)}
                  >
                    Details
                  </Button>
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
      {/* complaint resolve  Modal */}
      <Modal
        isOpen={showResolveModal}
        onClose={closeResolveModal}
        title="Resolve Complaint"
      >
        <div className="space-y-4 p-3">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Add admin notes before resolving this complaint.
              </h4>
            </div>
          </div>

          <div className="rounded-lg p-4">
            {/* Admin Notes Input */}
            <div className="space-y-2">
              <label
                htmlFor="adminNotes"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Notes
              </label>
              <textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => {
                  setAdminNotes(e.target.value);
                  if (
                    typeof e.target.value.trim() === "string" &&
                    e.target.value.trim() !== ""
                  ) {
                    setAdminNotesError("");
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                  adminNotesError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your resolution notes here..."
              />
              {adminNotesError && (
                <p className="text-red-500 text-sm">{adminNotesError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={closeResolveModal}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleResolveComplaint}>
              Resolve Complaint
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complaint Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        title="Complaint Details"
      >
        {selectedComplaintDetails ? (
          <div className="space-y-4 p-3">
            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                Description
              </h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {selectedComplaintDetails.description}
              </p>
            </div>

            {/* Complaint Info */}
            <div className="text-sm text-gray-800 dark:text-gray-300 space-y-2">
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selectedComplaintDetails.status}
              </p>
              <p>
                <span className="font-medium">Created At:</span>{" "}
                {new Date(selectedComplaintDetails.createdAt).toLocaleString()}
              </p>

              {/* Include resolved date if exists */}
              {selectedComplaintDetails.resolvedAt && (
                <p>
                  <span className="font-medium">Resolved At:</span>{" "}
                  {new Date(
                    selectedComplaintDetails.resolvedAt
                  ).toLocaleString()}
                </p>
              )}

              {/* Admin Notes if present */}
              {selectedComplaintDetails.adminNotes && (
                <p>
                  <span className="font-medium">Admin Notes:</span>{" "}
                  {selectedComplaintDetails.adminNotes}
                </p>
              )}

              {/* User Info */}
              <p>
                <span className="font-medium">User:</span>{" "}
                {selectedComplaintDetails.userFullName} (
                {selectedComplaintDetails.userEmail})
              </p>

              {/* Psychologist Info */}
              <p>
                <span className="font-medium">Psychologist:</span>{" "}
                {selectedComplaintDetails.psychologistFullName} (
                {selectedComplaintDetails.psychologistEmail})
              </p>

              {/* Session Info */}
              {selectedComplaintDetails.sessionStartTime &&
                selectedComplaintDetails.sessionEndTime && (
                  <div className="pt-2">
                    <p>
                      <span className="font-medium">Session Start:</span>{" "}
                      {new Date(
                        selectedComplaintDetails.sessionStartTime
                      ).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Session End:</span>{" "}
                      {new Date(
                        selectedComplaintDetails.sessionEndTime
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center p-4">
            Loading details...
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showUpdateStatusModal}
        onClose={() => setShowUpdateStatusModal(false)}
        title={`${
          complaint.psychologistStatus === "active" ? "Deactivate" : "Activate"
        } Psychologist`}
      >
        <div className="space-y-4 p-3">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Are you sure you want to{" "}
                {complaint.psychologistStatus === "active"
                  ? "Deactivate"
                  : "Activate"}{" "}
                this Psychologist? <br />
              </h4>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowUpdateStatusModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={
                complaint.psychologistStatus === "inactive"
                  ? "success"
                  : "danger"
              }
              onClick={() => {
                handleStatusToggle();
              }}
            >
              {complaint.psychologistStatus === "active"
                ? "Deactivate Psychologist"
                : "Activate Psychologist"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminComplaintDetails;
