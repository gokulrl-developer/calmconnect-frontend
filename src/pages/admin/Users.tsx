import React, { useEffect, useState } from "react";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { fetchUsers, updateUserStatus } from "../../services/adminService";
import type { UserItem } from "../../services/adminService";
import Modal from "../../components/UI/Modal";
import { useNavigate } from "react-router-dom";
import Table from "../../components/UI/Table";
import { useUpdateQueryParams } from "../../hooks/useUpdateQueryParams";
import { useGetQueryParams } from "../../hooks/useGetQueryParams";
import Pagination from "../../components/Pagination";
import type PaginationData from "../../types/pagination.types";

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateQueryParams } = useUpdateQueryParams();
  const queryParams = useGetQueryParams();
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    currentStatus: "active" | "inactive" | null;
    userId: string | null;
  }>({
    isOpen: false,
    currentStatus: null,
    userId: null,
  });

  const openConfirmationModal = (
    userId: string,
    currentStatus: "active" | "inactive"
  ) => {
    setConfirmationModal({
      isOpen: true,
      currentStatus,
      userId,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      currentStatus: null,
      userId: null,
    });
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const page = queryParams["page"];
      const currentPage = page ? Number(page) : 1;
      const res = await fetchUsers(currentPage);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [paginationData.currentPage]);

  /* ------------ VIEW BUTTON (just refresh page) ------------ */
  const handleView = (userId: string) => {
    navigate(`/admin/user-details/${userId}`);
  };

  /* ------------ ACTIVATE/DEACTIVATE BUTTON ------------ */
  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateUserStatus(userId, newStatus as "active" | "inactive");
      closeConfirmationModal();
      await loadUsers();
    } catch (err) {
      console.error("Failed to update user status", err);
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
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
    setPaginationData((prev) => ({ ...prev, currentPage: newPage }));
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          User Management
        </h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {users.filter((u) => u.status === "active").length} active users
        </span>
      </div>

      {/* Search + Filter */}
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                updateQueryParams({ page: 1 });
                setSearchTerm(e.target.value);
                setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              updateQueryParams({ page: 1 });
              setFilterStatus(e.target.value);
              setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <Table<UserItem>
          loading={loading}
          data={filteredUsers}
          keyField="id"
          columns={[
            {
              header: "User",
              render: (_, user) => (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {user!.firstName} {user!.lastName}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              header: "Email",
              accessor: "email",
              className: "text-gray-800 dark:text-white",
            },
            {
              header: "Status",
              accessor: "status",
              render: (status, user) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    status!
                  )}`}
                >
                  {status!.charAt(0).toUpperCase() + status!.slice(1)}
                </span>
              ),
            },
            {
              header: "Actions",
              render: (_, user) => (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleView(user!.id)}
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant={user!.status === "active" ? "warning" : "success"}
                    size="sm"
                    onClick={() =>
                      openConfirmationModal(user!.id, user!.status)
                    }
                  >
                    {user!.status === "active" ? "Deactivate" : "Activate"}
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
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        title={`${
          confirmationModal.currentStatus === "active"
            ? "Deactivate"
            : "Activate"
        } User`}
      >
        <div className="space-y-4 p-3">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Are you sure you want to{" "}
                {confirmationModal.currentStatus === "active"
                  ? "Deactivate"
                  : "Activate"}{" "}
                this User? <br />
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
                  confirmationModal.userId!,
                  confirmationModal.currentStatus!
                );
              }}
            >
              {confirmationModal.currentStatus === "active"
                ? "Deactivate User"
                : "Activate User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
