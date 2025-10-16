import React, { useEffect, useState } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { fetchSessionListingByAdminAPI } from '../../services/adminService';
import { handleApiError } from '../../services/axiosInstance';
import type { SessionListingAdminItem } from '../../types/api/admin.types';
import type paginationData from '../../types/pagination.types';

const AdminSessions: React.FC = () => {
  const [sessions, setSessions] = useState<SessionListingAdminItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<paginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  const loadSessions = async (page: number = 1, status: string = 'all') => {
    setLoading(true);
    try {
      // Construct query params for pagination & filter
      const queryParams = `?page=${page}&limit=${pagination.pageSize}${
        status !== 'all' ? `&status=${status}` : ''
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'available':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDateTime = (dateString?: string | Date) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadSessions(newPage, statusFilter);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sessions</h1>

      {/* Status Filter */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="all">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-300">Loading...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Psychologist</th>
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Start Time</th>
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">End Time</th>
                  <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500 dark:text-gray-300">
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  sessions.map(session => (
                    <tr
                      key={session.sessionId}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      <td className="p-6">
                        <div className="text-gray-800 dark:text-white font-medium">{session.userFullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{session.userEmail}</div>
                      </td>
                      <td className="p-6">
                        <div className="text-gray-800 dark:text-white font-medium">{session.psychFullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{session.psychEmail}</div>
                      </td>
                      <td className="p-6 text-gray-800 dark:text-white">{formatDateTime(session.startTime)}</td>
                      <td className="p-6 text-gray-800 dark:text-white">{formatDateTime(session.endTime)}</td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}
                        >
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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
    </div>
  );
};

export default AdminSessions;
