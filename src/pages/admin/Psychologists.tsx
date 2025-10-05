import React, { useEffect, useState } from "react";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import {
  fetchPsychologists,
  updatePsychologistStatus,
} from "../../services/adminService";
import type { PsychItem } from "../../services/adminService";
import { handleApiError } from "../../services/axiosInstance";
import Modal from "../../components/UI/Modal";
import { DataTable, type Column } from "../../components/UI/Table";

const Psychologists: React.FC = () => {
  const [psychs, setPsychs] = useState<PsychItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    currentStatus: "active" | "inactive" | null;
    psychId: string | null;
  }>({
    isOpen: false,
    currentStatus: null,
    psychId: null,
  });

  const openConfirmationModal = (
    psychId: string,
    currentStatus: "active" | "inactive"
  ) => {
    setConfirmationModal({
      isOpen: true,
      currentStatus,
      psychId,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      currentStatus: null,
      psychId: null,
    });
  };

  const loadPsychs = async () => {
    try {
      setLoading(true);
      const res = await fetchPsychologists(page);
      setPsychs(res.data);
    } catch (err) {
      console.error("Failed to fetch psychologists", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPsychs();
  }, [page]);

  /* ------------ VIEW BUTTON (just refresh page) ------------ */
  const handleView = async (psychId: string) => {
    await loadPsychs();
  };

  /* ------------ ACTIVATE/DEACTIVATE BUTTON ------------ */
  const handleStatusToggle = async (psychId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updatePsychologistStatus(
        psychId,
        newStatus as "active" | "inactive"
      );
      closeConfirmationModal();
      await loadPsychs();
    } catch (err) {
      handleApiError(err);
      console.error("Failed to update psychologist status", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  /* ---------------- FILTERING ---------------- */
  const filteredPsychs = psychs.filter((psych) => {
    const matchesSearch =
      psych.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psych.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psych.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || psych.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  
  const columns: Column<PsychItem>[] = [
    {
      key: "name",
      header: "Psychologist",
      render: (psych) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <p className="font-medium text-gray-800 dark:text-white">
            {psych.firstName} {psych.lastName}
          </p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "status",
      header: "Status",
      render: (psych) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            psych.status
          )}`}
        >
          {psych.status.charAt(0).toUpperCase() + psych.status.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (psych) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleView(psych.id)}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant={psych.status === "active" ? "warning" : "success"}
            size="sm"
            onClick={() => openConfirmationModal(psych.id, psych.status)}
          >
            {psych.status === "active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Psychologist Management
        </h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {psychs.filter((p) => p.status === "active").length} active
          psychologists
        </span>
      </div>
      {/* Search + Filter */}
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search psychologists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          ) : (
            <DataTable
              data={filteredPsychs}
              columns={columns}
              rowKey={(psych) => psych.id}
            />
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
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
          confirmationModal.currentStatus === "active"
            ? "Deactivate"
            : "Activate"
        } Psychologist`}
      >
        <div className="space-y-4 p-3">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Are you sure you want to{" "}
                {confirmationModal.currentStatus === "active"
                  ? "Deactivate"
                  : "Activate"}{" "}
                this Psychologist? <br />
              </h4>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={closeConfirmationModal}>
              Cancel
            </Button>
            <Button
              variant={
                confirmationModal.currentStatus === "inactive"
                  ? "success"
                  : "danger"
              }
              onClick={() => {
                handleStatusToggle(
                  confirmationModal.psychId!,
                  confirmationModal.currentStatus!
                );
              }}
            >
              {confirmationModal.currentStatus === "active"
                ? "Deactivate Psychologist"
                : "Activate Psychologist"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Psychologists;
