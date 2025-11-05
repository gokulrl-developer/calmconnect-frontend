import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import type paginationData from "../../types/pagination.types";
import type {
  ComplaintListItem,
  ComplaintListingResponse,
} from "../../types/api/admin.types";
import { listComplaintsAPI, resolveComplaintAPI } from "../../services/adminService";
import Modal from "../../components/UI/Modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminComplaints: React.FC = () => {
  const navigate=useNavigate()
  const [complaints, setComplaints] = useState<ComplaintListItem[]>([]);
  const [pagination, setPagination] = useState<paginationData>({
    totalItems: 0,
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
  useEffect(() => {
    fetchComplaints(
      pagination.currentPage,
      pagination.pageSize,
      statusFilter,
      searchQuery
    );
  }, [pagination.currentPage, statusFilter, searchQuery]);

  const fetchComplaints = async (
    page: number,
    limit: number,
    status: "all" | "pending" | "resolved",
    search?: string
  ) => {
    try {
      const apiStatus = status === "all" ? undefined : status;
      const res = await listComplaintsAPI(page, limit, apiStatus, search);
      const data: ComplaintListingResponse = res.data;
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
     const res= await resolveComplaintAPI(selectedComplaintId,  adminNotes );
     if(res.data){
        toast.success(res.data.message)
      closeResolveModal();
      fetchComplaints(
        pagination.currentPage,
        pagination.pageSize,
        statusFilter,
        searchQuery
      );
    }
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as "all" | "pending" | "resolved");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const viewDetails = (complaintId: string) => {
    navigate(`/admin/complaints/${complaintId}`)
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                  ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                  Psychologist
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Created At
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-3 text-center text-gray-500 dark:text-gray-300 text-sm"
                  >
                    No complaints found
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr
                    key={complaint.complaintId}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-gray-800 dark:text-white font-medium">
                      #{complaint.complaintId.slice(-4)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white">
                      <div className="text-sm font-medium truncate">
                        {complaint.userFullName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {complaint.userEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white">
                      <div className="text-sm font-medium truncate">
                        {complaint.psychologistFullName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {complaint.psychologistEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {complaint.status.charAt(0).toUpperCase() +
                          complaint.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white whitespace-nowrap text-xs">
                      {formatDateTime(complaint.createdAt)}
                    </td>
                    <td className="px-4 py-3 flex gap-1">
                      <Button
                        variant="primary"
                        onClick={() => viewDetails(complaint.complaintId)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => openResolveModal(complaint.complaintId)}
                      >
                        Resolve
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
    </div>
  );
};

export default AdminComplaints;
