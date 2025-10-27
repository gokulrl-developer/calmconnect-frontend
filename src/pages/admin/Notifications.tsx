import { useContext, useEffect, useState } from "react";
import {
  fetchNotificationsAPI,
  markAllNotificationsReadAPI,
} from "../../services/adminService";

import { produce } from "immer";
import { BellIcon } from "lucide-react";
import type { NotificationListingItem } from "../../types/domain/Notification.types";
import Pagination from "../../components/Pagination";
import type paginationData from "../../types/pagination.types";
import { NotificationContext } from "../../contexts/NotificationContext";

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationListingItem[]>(
    []
  );
  const [paginationData, setPagingationData] = useState<paginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const { setUnreadNotificationCount } = useContext(NotificationContext);

  function setCurrentPage(page: number) {
    setPagingationData(produce((draft) => (draft.currentPage = page)));
  }
  useEffect(() => {
    fetchNotifications();
  }, [paginationData.currentPage]);
  useEffect(() => {
    markAllAsRead();
  }, []);

  async function fetchNotifications() {
    try {
      const result = await fetchNotificationsAPI({
        page: paginationData.currentPage,
        limit: paginationData.pageSize,
      });
      if (result.data) {
        setNotifications(
          produce((draft) => {
            if (paginationData.currentPage === 1)
              draft.splice(0, draft.length, ...result.data.notifications);
            else draft.push(...result.data.notifications);
          })
        );
        setPagingationData(result.data.paginationData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function markAllAsRead() {
    try {
      const result=await markAllNotificationsReadAPI();
      if(result.data){
        setUnreadNotificationCount(0);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <section className="glass-card p-6 animate-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-200 flex items-center gap-2">
              <BellIcon className="w-5 h-5" />
              Notifications
            </h2>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((n) => (
                <li
                  key={n.notificationId}
                  className={`glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between fade-in ${
                    n.isRead ? "opacity-70" : "border-l-4 border-primary-500"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {n.title}
                    </span>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {n.message}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No notifications yet.
            </p>
          )}
        </section>
        <Pagination
          paginationData={paginationData}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
