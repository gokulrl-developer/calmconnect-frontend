import React, { useEffect, useState } from "react";
import { EyeIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import {
  fetchApplications,
  updateApplication,
} from "../../services/adminService";
import type { ApplicationItem } from "../../services/adminService";
import { handleApiError } from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/UI/Modal";
import Table from "../../components/UI/Table";

const PAGE_SIZE = 10;

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [rejectionReasonError, setRejectionReasonError] = useState<string>("");
  const [filterStatus,setFilterStatus]=useState<"accepted"|"pending"|"rejected"|undefined>(undefined)
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
    applicationId: string | null;
  }>({
    isOpen: false,
    type: null,
    applicationId: null,
  });

  const openConfirmationModal = (
    type: "approve" | "reject",
    applicationId: string
  ) => {
    setConfirmationModal({
      isOpen: true,
      type,
      applicationId,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      applicationId: null,
    });
  };

  const handleConfirmAction = () => {
    if (confirmationModal.type && confirmationModal.applicationId) {
      handleStatusChange(
        confirmationModal.applicationId,
        confirmationModal.type === "approve" ? "accepted" : "rejected"
      );
      closeConfirmationModal();
    }
  };

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const response = await fetchApplications(currentPage,filterStatus);
        setApplications(response.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [currentPage,filterStatus]);

  const handleStatusChange = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    if (status === "rejected") {
      if (
        !rejectionReason ||
        typeof rejectionReason !== "string" ||
        rejectionReason.trim() === ""
      ) {
        setRejectionReasonError("Rejection reason is required");
        return;
      }
    }
    try {
      const reason = status === "rejected" ? rejectionReason : null;
      await updateApplication(id, status, reason);
      window.location.reload();
    } catch (error) {
      handleApiError(error);
      window.location.reload();
    }
  };

  const handleView = (id: string) => {
    navigate(`/admin/application-details/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      `${app.firstName} ${app.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApplications.length / PAGE_SIZE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Psychologist Applications
          </h1>
          <select
            value={filterStatus ?? ""}
            onChange={(e) =>
              setFilterStatus(
                e.target.value === ""
                  ? undefined
                  : (e.target.value as "pending" | "accepted" | "rejected")
              )
            }
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {
                filteredApplications.filter((app) => app.status === "pending")
                  .length
              }{" "}
              pending applications
            </span>
          </div>
        </div>

        <Card>
          <Table<ApplicationItem, "id">
            keyField="id"
            data={paginatedApplications}
            columns={[
              {
                header: "Name",
                render: (_, row) => (
                  <span className="text-gray-800 dark:text-white">
                    {row!.firstName} {row!.lastName}
                  </span>
                ),
              },
              {
                header: "Specialization",
                render: (_, row) => (
                  <span className="text-gray-800 dark:text-white">
                    {row!.specializations.join(", ")}
                  </span>
                ),
              },
              {
                header: "Email",
                render: (_, row) => (
                  <span className="text-gray-800 dark:text-white">
                    {row!.email}
                  </span>
                ),
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
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleView(row!.id)}
                    >
                      <EyeIcon className="w-4 h-4 mr-1" /> View
                    </Button>
                    {row!.status === "pending" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            openConfirmationModal("approve", row!.id)
                          }
                        >
                          <CheckIcon className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            openConfirmationModal("reject", row!.id)
                          }
                        >
                          <XMarkIcon className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
          />

          {/* Pagination */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              size="sm"
              disabled={
                currentPage === totalPages || paginatedApplications.length === 0
              }
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </Button>
          </div>
        </Card>

        {/* Confirmation Modal */}
        <Modal
          isOpen={confirmationModal.isOpen}
          onClose={closeConfirmationModal}
          title={`${
            confirmationModal.type === "approve" ? "Approve" : "Reject"
          } Application`}
        >
          <div className="space-y-4 p-3">
            <div className="flex items-center space-x-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Are you sure you want to {confirmationModal.type} this
                  application? <br />
                  This action cannot be undone.
                </h4>
              </div>
            </div>
            <div className="rounded-lg p-4">
              <p className="text-md">
                {confirmationModal.type === "approve"
                  ? "This psychologist will be granted access to the platform and can start accepting sessions."
                  : "This application will be rejected and the applicant will be notified via email."}
              </p>
              {/* Rejection Reason */}
              {confirmationModal.type === "reject" ? (
                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                      rejectionReasonError
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Rejection Reason"
                  />
                  {rejectionReasonError && (
                    <p className="text-red-500 text-sm">
                      {rejectionReasonError}
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={closeConfirmationModal}>
                Cancel
              </Button>
              <Button
                variant={
                  confirmationModal.type === "approve" ? "success" : "danger"
                }
                onClick={handleConfirmAction}
              >
                {confirmationModal.type === "approve"
                  ? "Approve Application"
                  : "Reject Application"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Applications;
