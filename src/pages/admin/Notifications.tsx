import { useContext, useEffect, useState } from "react";
import {
  clearNotificationsAPI,
  fetchNotificationsAPI,
  markAllNotificationsReadAPI,
} from "../../services/adminService";

import { produce } from "immer";
import { BellIcon, Trash2 } from "lucide-react";
import Pagination from "../../components/Pagination";
import type paginationData from "../../types/pagination.types";
import { NotificationContext } from "../../contexts/NotificationContext";
import { toast } from "sonner";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import { useGetQueryParams } from "../../hooks/useGetQueryParams";
import { useUpdateQueryParams } from "../../hooks/useUpdateQueryParams";
import type { NotificationListingItem } from "../../types/api/shared.types";

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationListingItem[]>(
    []
  );
  const [paginationData, setPaginationData] = useState<paginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [showConfirmationModal,setShowConfirmationModal]=useState(false);
  const { setUnreadNotificationCount } = useContext(NotificationContext);
   const { updateQueryParams } = useUpdateQueryParams();
    const queryParams = useGetQueryParams();
  function setCurrentPage(page: number) {
    setPaginationData(prev=>produce(prev,(draft) => {draft.currentPage = page}));
  }
  useEffect(() => {
    fetchNotifications();
  }, [paginationData.currentPage]);
  useEffect(() => {
    markAllAsRead();
  }, []);

  async function fetchNotifications() {
    try {
      const page = queryParams["page"];
    const currentPage = page ? Number(page) : 1;
      const result = await fetchNotificationsAPI({
        page: currentPage,
        limit: paginationData.pageSize,
      });
      if (result.data) {
        setNotifications(prev=>
          produce(prev,(draft) => {
              draft.splice(0, draft.length, ...result.data.notifications);
          })
        );
        setPaginationData(prev=>
          produce(prev,draft=>{
            draft.totalItems=result.data.paginationData.totalItems;
                        draft.totalPages=result.data.paginationData.totalPages;
          })
        );
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

  async function clearNotifications(){
    try{
      const result=await clearNotificationsAPI();
      if(result.data){
        toast.success(result.data.message);
        fetchNotifications();
      }
    }catch(error){
      console.log("error clearing messages",error)
    }
  }

   const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
    setCurrentPage(newPage)
    //setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };
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
            {notifications.length>0 &&
            <Button
            variant="danger"
             onClick={()=>setShowConfirmationModal(true)}
            >
              <Trash2/>
            </Button>}
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
          setCurrentPage={(page: number) => handlePageChange(page)}
        />
      </div>
        {/* Confirmation Modal */}
            <Modal
              isOpen={showConfirmationModal}
              onClose={()=>setShowConfirmationModal(false)}
              title="Clear All Notifications"
            >
              <div className="space-y-4 p-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Are you sure you want to clear all notifications?
                    </h4>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="secondary" onClick={()=>setShowConfirmationModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                     clearNotifications();
                     setShowConfirmationModal(false)
                    }}
                  >
                    Proceed
                  </Button>
                </div>
              </div>
            </Modal>
    </div>
  );
}
