import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import type {
  ComplaintListItem,
  ComplaintListingResponse,
} from "../../types/api/admin.types";
import {
  listComplaintsAPI,
  resolveComplaintAPI,
} from "../../services/adminService";
import Modal from "../../components/UI/Modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Table from "../../components/UI/Table";
import { useUpdateQueryParams } from "../../hooks/useUpdateQueryParams";
import { useGetQueryParams } from "../../hooks/useGetQueryParams";
import Pagination from "../../components/Pagination";
import type PaginationData from "../../types/pagination.types";
import { CheckCircle, EyeIcon } from "lucide-react";

const AdminComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<ComplaintListItem[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalItemCount: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "resolved"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [adminNotesError, setAdminNotesError] = useState("");
  const { updateQueryParams } = useUpdateQueryParams();
  const queryParams = useGetQueryParams();
  useEffect(() => {
    fetchComplaints(paginationData.pageSize, statusFilter, searchQuery);
  }, [paginationData.currentPage, statusFilter, searchQuery]);

  const fetchComplaints = async (
    limit: number,
    status: "all" | "pending" | "resolved",
    search?: string
  ) => {
    try {
      const page = queryParams["page"];
      const currentPage = page ? Number(page) : 1;
      const apiStatus = status === "all" ? undefined : status;
      const res = await listComplaintsAPI(
        currentPage,
        limit,
        apiStatus,
        search
      );
      const data: ComplaintListingResponse = res.data;
      setComplaints(data.complaints);
      setPaginationData(data.paginationData);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
    setPaginationData((prev) => ({ ...prev, currentPage: newPage }));
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
  const openResolveModal = (complaintId: string) => {
    setSelectedComplaintId(complaintId);
    setShowResolveModal(true);
  };

  const closeResolveModal = () => {
    setShowResolveModal(false);
    setAdminNotes("");
    setAdminNotesError("");
    setSelectedComplaintId(null);
  };

  const handleResolveComplaint = async () => {
    if (!adminNotes.trim()) {
      setAdminNotesError("Admin notes are required to resolve the complaint.");
      return;
    }
    if (!selectedComplaintId) return;

    try {
      const res = await resolveComplaintAPI(selectedComplaintId, adminNotes);
      if (res.data) {
        toast.success(res.data.message);
        closeResolveModal();
        fetchComplaints(paginationData.pageSize, statusFilter, searchQuery);
      }
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQueryParams({ page: 1 });
    setSearchQuery(e.target.value);
    updateQueryParams({ page: 1 });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQueryParams({ page: 1 });
    setStatusFilter(e.target.value as "all" | "pending" | "resolved");
  };

  const viewDetails = (complaintId: string) => {
    navigate(`/admin/complaints/${complaintId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Complaints Management
        </h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {complaints.filter((c) => c.status === "pending").length} pending
          complaints
        </span>
      </div>

      {/* Filters Section  */}
      <Card className="p-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Complaints
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user or psychologist..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="pl-9 pr-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <Table<ComplaintListItem, "complaintId">
            keyField="complaintId"
            data={complaints}
            columns={[
              {
                header: "ID",
                accessor: "complaintId",
                render: (value) => (
                  <span className="text-gray-800 dark:text-white">
                    #{typeof value === "string" && value.slice(-4)}
                  </span>
                ),
              },
              {
                header: "User",
                render: (_, row) => (
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white truncate">
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
                    <div className="text-sm font-medium text-gray-800 dark:text-white truncate">
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
                render: (value) => (
                  <span className="text-gray-800 dark:text-white text-xs">
                    {formatDateTime(value)}
                  </span>
                ),
              },
              {
                header: "Actions",
                render: (_, row) => (
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      onClick={() => viewDetails(row!.complaintId)}
                    >
                      <EyeIcon />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => openResolveModal(row!.complaintId)}
                    >
                      <CheckCircle />
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
               <XMarkIcon className="w-4 h-4 mr-1 stroke-[2.5]" />
            </Button>
            <Button variant="success" onClick={handleResolveComplaint}>
              <CheckCircle/>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminComplaints;
