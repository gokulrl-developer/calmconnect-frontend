import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import { fetchUserDetailsByAdminAPI } from "../../services/adminService";

export interface AdminUserDetailsResponse {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  userId: string;
  gender?: "male" | "female" | "others";
  dob?: Date;
  profilePicture?: string;
  address?: string;
}

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<AdminUserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const loadUser = async () => {
      try {
        const result = await fetchUserDetailsByAdminAPI(userId);
        if(result.data){
          setUser(result.data.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const getStatusColor = (isBlocked: boolean) =>
    isBlocked
      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";

  const formatDate = (date?: Date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-400">Loading user details...</div>;
  }

  if (!user) {
    return <div className="text-red-500 dark:text-red-400">User not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Profile
          </h1>
        </div>
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
            user.isBlocked
          )}`}
        >
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      </div>

      {/* Main Info */}
      <Card className="p-8">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">
              Personal Information
            </h3>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
              <p>
                <span className="font-medium">Date of Birth:</span>{" "}
                {formatDate(user.dob)}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <p>
                <span className="font-medium">Gender:</span>{" "}
                {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">
              Contact Information
            </h3>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <EnvelopeIcon className="w-5 h-5 text-gray-500" />
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <MapPinIcon className="w-5 h-5 text-gray-500" />
              <p>
                <span className="font-medium">Address:</span>{" "}
                {user.address || "-"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      {/* <Card className="p-6">
        <h3 className="font-medium text-gray-800 dark:text-white mb-4">
          Account Actions
        </h3>
        <div className="space-y-3">
          {user.isBlocked ? (
            <Button variant="success" className="w-full">
              Unblock User
            </Button>
          ) : (
            <Button variant="warning" className="w-full">
              Block User
            </Button>
          )}
        </div>
      </Card> */}
    </div>
  );
};

export default UserDetails;
