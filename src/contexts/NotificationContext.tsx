import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "sonner";
import type { IRootState } from "../store";
import { useAppSelector } from "../hooks/customReduxHooks";
import type { SocketConnectionErrorPayload } from "../types/domain/socket.types";
import { logOut, refreshTokenAPI } from "../services/authService";
import { getUserUnreadNotificationsCountAPI } from "../services/userService";
import { getPsychUnreadNotificationsCountAPI } from "../services/psychologistService";
import { getAdminUnreadNotificationsCountAPI } from "../services/adminService";
import { Link } from "react-router-dom";

const SIGNALING_URL = import.meta.env.VITE_API_URL;
interface Notification {
  notificationId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}

interface NotificationContextProps {
  unreadNotificationCount: number;
  setUnreadNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

export const NotificationContext = createContext<NotificationContextProps>({
  unreadNotificationCount: 0,
  setUnreadNotificationCount: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const accountId = useAppSelector((state: IRootState) => state.auth.accountId);
  const isAuthenticated = useAppSelector(
    (state: IRootState) => state.auth.isAuthenticated
  );
  const role = useAppSelector((state: IRootState) => state.auth.role);
  useEffect(() => {
    fetchUnreadCount();
  }, [accountId, isAuthenticated, role]);

  async function fetchUnreadCount() {
    if (!isAuthenticated || !role) return;
    if (role === "user") {
      const result = await getUserUnreadNotificationsCountAPI();
      setUnreadCount(result.data.count);
    }
    if (role === "psychologist") {
      const result = await getPsychUnreadNotificationsCountAPI();
      setUnreadCount(result.data.count);
    }
    if (role === "admin") {
      const result = await getAdminUnreadNotificationsCountAPI();
      setUnreadCount(result.data.count);
    }
  }
  useEffect(() => {
    if (!isAuthenticated || !role) return;
    const s = io(`${SIGNALING_URL}/notifications`, {
      transports: ["websocket"],
    });

    s.emit("register");

    s.on("notification", (notif: Notification) => {
      setUnreadCount((prev) => prev + 1);
      console.log(notif);
      toast.info(
        <div>
          <div>
            {notif.title}: {notif.message}
          </div>
          {notif.link && (
            <Link to={notif.link} className="underline text-blue-600">
              Click here
            </Link>
          )}
        </div>
      );
    });
    s.on("connect_error", async (err: SocketConnectionErrorPayload) => {
      const msg = err instanceof Error ? err.message : "Connection error";
      if (
        err.code === "INVALID_CREDENTIALS" ||
        err.code === "SESSION_EXPIRED"
      ) {
        await refreshTokenAPI();
      } else if (err.code === "BLOCKED") {
        if (isAuthenticated === true) {
          await logOut();
        }
      } else {
        console.error(msg);
        toast.error(msg);
      }
    });

    return () => {
      s.disconnect();
    };
  }, [isAuthenticated, accountId]);

  return (
    <NotificationContext.Provider
      value={{
        unreadNotificationCount: unreadCount,
        setUnreadNotificationCount: setUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
