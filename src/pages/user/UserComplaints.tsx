import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import type paginationData from "../../types/pagination.types";
import type {
  ComplaintDetailsResponse,
  ComplaintListingItem,
  ComplaintListingResponse,
} from "../../types/api/user.types";
import {
  fetchComplaintDetailsAPI,
  listComplaintsAPI,
} from "../../services/userService";
import Modal from "../../components/UI/Modal";
import Table from "../../components/UI/Table";
import { useGetQueryParams } from "../../hooks/useGetQueryParams";
import { useUpdateQueryParams } from "../../hooks/useUpdateQueryParams";
import Pagination from "../../components/Pagination";
import { EyeIcon } from "lucide-react";

const UserComplaints: React.FC = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [complaints, setComplaints] = useState<ComplaintListingItem[]>([ ]);

  const [paginationData, setPaginationData] = useState<paginationData>({
    totalItems: 2,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [complaintDetails, setComplaintDetails] =
    useState<ComplaintDetailsResponse>({
      psychologistFullName: "N/A",
      psychologistEmail: "N/A",
      sessionId: "N/A",
      sessionStartTime: "N/A",
      sessionEndTime: "N/A",
      sessionStatus: "N/A" as "scheduled" | "cancelled" | "ended" | "pending",
      sessionFees: 0,
      description: "N/A",
      status: "N/A" as "resolved" | "pending",
      adminNotes: "N/A",
      createdAt: "N/A",
      resolvedAt: "N/A",
    });

  useEffect(() => {
    fetchComplaints(paginationData.pageSize);
  }, [paginationData.currentPage]);
 const { updateQueryParams } = useUpdateQueryParams();
  const queryParams = useGetQueryParams();
  const fetchComplaintDetails = async (complaintId: string) => {
    try {
      const res = await fetchComplaintDetailsAPI(complaintId);
      const data: ComplaintDetailsResponse = res.data;
      if (data) {
        setComplaintDetails(data);
      }
    } catch (error) {
      console.error("Failed to fetch complaint details:", error);
    }
  };
  const fetchComplaints = async (limit: number) => {
    try {
      const page = queryParams["page"];
    const currentPage = page ? Number(page) : 1;
      const res = await listComplaintsAPI(currentPage, limit);
      const data: ComplaintListingResponse = res.data;

      setComplaints(data.complaints);
      setPaginationData({
        totalItems: data.paginationData.totalItems,
        totalPages: data.paginationData.totalPages,
        currentPage: data.paginationData.currentPage,
        pageSize: data.paginationData.pageSize,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
  const formatDateTimeOneLine = (dateString?: string | Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
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

  const viewComplaintDetails = (complaintId: string) => {
    fetchComplaintDetails(complaintId);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        My Complaints
      </h1>

      <Card>
        <div className="overflow-x-auto">
          <Table<ComplaintListingItem, "complaintId">
            keyField="complaintId"
            data={complaints}
            loading={false}
            columns={[
              {
                header: "Complaint ID",
                accessor: "complaintId",
                render: (value) => `#${value!.slice(-4)}`,
              },
              {
                header: "Psychologist",
                accessor: "psychologistFullName",
              },
              {
                header: "Email",
                accessor: "psychologistEmail",
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
                header: "Created At",
                accessor: "createdAt",
                render: (value) => formatDateTime(value),
              },
              {
                header: "Actions",
                render: (_, row) => (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => viewComplaintDetails(row!.complaintId)}
                    >
                      <EyeIcon/>
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Pagination */}
        <Pagination
          paginationData={paginationData}
          setCurrentPage={(page: number) => handlePageChange(page)}
        />
      </Card>

      {/* Complaint Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Complaint Details"
      >
        {complaintDetails ? (
          <div className="space-y-4 p-3 text-gray-800 dark:text-gray-200">
            {/* Psychologist Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Psychologist
              </h4>
              <p>{complaintDetails.psychologistFullName || "N/A"}</p>
              <p className="text-sm text-gray-500">
                {complaintDetails.psychologistEmail || "N/A"}
              </p>
            </div>

            {/* Session Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Session Details
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <span className="font-medium">Start Time:</span>{" "}
                  {complaintDetails.sessionStartTime
                    ? formatDateTimeOneLine(complaintDetails.sessionStartTime)
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">End Time:</span>{" "}
                  {complaintDetails.sessionEndTime
                    ? formatDateTimeOneLine(complaintDetails.sessionEndTime)
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Description
              </h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {complaintDetails.description || "N/A"}
              </p>
            </div>

            {/* Complaint Status */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Status
              </h4>
              <p>
                {complaintDetails.status === "pending" ? (
                  <span className="text-yellow-500 font-medium">Pending</span>
                ) : complaintDetails.status === "resolved" ? (
                  <span className="text-green-500 font-medium">Resolved</span>
                ) : (
                  "N/A"
                )}
              </p>
            </div>

            {/* Admin Notes */}
            {complaintDetails.adminNotes && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  Admin Notes
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {complaintDetails.adminNotes}
                </p>
              </div>
            )}

            {/* Dates */}
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>
                <span className="font-medium">Created At:</span>{" "}
                {formatDateTimeOneLine(complaintDetails.createdAt)}
              </p>
              {complaintDetails.resolvedAt && (
                <p>
                  <span className="font-medium">Resolved At:</span>{" "}
                  {formatDateTimeOneLine(complaintDetails.resolvedAt)}
                </p>
              )}
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

export default UserComplaints;
