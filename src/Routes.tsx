import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorWatcher from "./components/ErrorWatcher";
import UserLayout from "./components/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import BookSession from "./pages/user/PsychologistListing";
import PsychologistDetails from "./pages/user/PsychologistDetails";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApplications from "./pages/admin/Applications";
import AdminApplicationDetails from "./pages/admin/ApplicationDetails";
import AdminUsers from "./pages/admin/Users";
import AdminUserDetails from "./pages/admin/UserDetails";
import AdminPsychologists from "./pages/admin/Psychologists";
import AdminPsychologistDetails from "./pages/admin/PsychologistDetails";

import PsychologistLayout from "./components/PsychologistLayout";
import PsychologistDashboard from "./pages/psychologist/Dashboard";
import PsychologistApplication from "./pages/psychologist/Application";
import Availability from "./pages/psychologist/Availability";
import PsychologistProfile from "./pages/psychologist/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import GoogleCallback from "./pages/GoogleCallBack";
import Unauthorised from "./pages/Unauthorised";
import ForgotPassword from "./pages/ForgotPassword";
import UserProfile from "./pages/user/Profile";
import DailyAvailability from "./pages/psychologist/DailyAvailability";
import AdminSessions from "./pages/admin/AdminSessions";
import UserSessions from "./pages/user/UserSessions";
import PsychSessions from "./pages/psychologist/PsychSessions";
import { UserVideoRoom } from "./pages/user/UserVideoRoom";
import { PsychVideoRoom } from "./pages/psychologist/PsychVideoRoom";
import { NotificationProvider } from "./contexts/NotificationContext";
import PsychNotifications from "./pages/psychologist/Notifications"
import UserNotifications from "./pages/user/Notifications"
import AdminNotifications from "./pages/admin/Notifications"
import AdminTransactions from "./pages/admin/Transactions"
import PsychTransactions from "./pages/psychologist/Transactions"
import UserTransactions from "./pages/user/Transactions"
import UserComplaints from "./pages/user/UserComplaints";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminComplaintDetails from "./pages/admin/AdminComplaintDetails";
import { CallProvider } from "./contexts/CallContext";

function AppRoutes() {
  return (
    <>
        <Toaster position="top-right" richColors closeButton />
        <ErrorWatcher />

            <NotificationProvider>
            <CallProvider>
        <Routes>
          {/* Common Routes */}
          <Route path="/unauthorised" element={<Unauthorised />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          {/* Guest Only Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/user/login" element={<Login role="user" />} />
            <Route
              path="/psychologist/login"
              element={<Login role="psychologist" />}
              />
            <Route path="/admin/login" element={<Login role="admin" />} />
            <Route path="/user/sign-up" element={<SignUp />} />
            <Route path="/psychologist/sign-up" element={<SignUp />} />
            <Route
              path="/psychologist/forgot-password"
              element={<ForgotPassword role="psychologist" />}
              />
            <Route
              path="/user/forgot-password"
              element={<ForgotPassword role="user" />}
              />
          </Route>


          {/* User Routes */}
          <Route
            element={
              <ProtectedRoute allowedRole="user" isVerifiedPsychRoute={false} />
            }
          >
            <Route element={<UserLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/user/psychologists" element={<BookSession />} />
              <Route
                path="/user/psychologist-details"
                element={<PsychologistDetails />}
              />
              <Route path="/user/sessions" element={<UserSessions />} />
              <Route path="/user/notifications" element={<UserNotifications />} />
              <Route path="/user/transactions" element={<UserTransactions />} />
              <Route path="/user/complaints" element={<UserComplaints />} />
              <Route
                path="/user/sessions/:sessionId/video"
                element={<UserVideoRoom />}
              />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRole="admin"
                isVerifiedPsychRoute={false}
              />
            }
          >
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin/applications"
                element={<AdminApplications />}
              />
              <Route
                path="/admin/application-details/:applicationId"
                element={<AdminApplicationDetails />}
              />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route
                path="/admin/user-details/:userId"
                element={<AdminUserDetails />}
              />
              <Route
                path="/admin/psychologists"
                element={<AdminPsychologists />}
              />
              <Route
                path="/admin/psychologist-details/:psychId"
                element={<AdminPsychologistDetails />}
              />
              <Route path="/admin/sessions" element={<AdminSessions />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/complaints/:complaintId" element={<AdminComplaintDetails />} />
            </Route>
          </Route>

          {/* Unverified Psychologist Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRole="psychologist"
                isVerifiedPsychRoute={false}
              />
            }
          >
            <Route
              path="/psychologist/application"
              element={<PsychologistApplication />}
            />
          </Route>

          {/* Verified Psychologist Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRole="psychologist"
                isVerifiedPsychRoute={true}
              />
            }
          >
            <Route element={<PsychologistLayout />}>
              <Route
                path="/psychologist/dashboard"
                element={<PsychologistDashboard />}
              />
              <Route
                path="/psychologist/availability"
                element={<Availability />}
              />
              <Route
                path="/psychologist/sessions"
                element={<PsychSessions />}
              />
              <Route
                path="/psychologist/daily-availability"
                element={<DailyAvailability />}
              />
              <Route
                path="/psychologist/profile"
                element={<PsychologistProfile />}
              />
              <Route
                path="/psychologist/notifications"
                element={<PsychNotifications />}
              />
              <Route
                path="/psychologist/transactions"
                element={<PsychTransactions />}
              />
              <Route
                path="/psychologist/sessions/:sessionId/video"
                element={<PsychVideoRoom />}
              />
            </Route>
          </Route>
        </Routes>
        </CallProvider>
      </NotificationProvider>
    </>
  );
}

export default AppRoutes;
