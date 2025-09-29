import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorWatcher from "./components/ErrorWatcher";
import UserLayout from "./components/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import AdminLayout from "./components/AdminLayout";
import AdminApplicationDetails from "./pages/admin/ApplicationDetails";
import AdminApplications from "./pages/admin/Applications";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPsychologists from "./pages/admin/Psychologists";
import AdminPsychologistDetails from "./pages/admin/PsychologistDetails";
import AdminUserDetails from "./pages/admin/UserDetails";
import AdminUsers from "./pages/admin/Users";
import PsychologistLayout from "./components/PsychologistLayout";
import PsychologistDashboard from "./pages/psychologist/Dashboard";
import PsychologistApplication from "./pages/psychologist/Application";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import GoogleCallback from "./pages/GoogleCallBack";
import Unauthorised from "./pages/Unauthorised";
import ForgotPassword from "./pages/ForgotPassword";
import CreateRule from "./pages/psychologist/CreateRule";
import Availability from "./pages/psychologist/Availability";
import BookSession from "./pages/user/PsychologistListing";
import PsychologistDetails from "./pages/user/PsychologistDetails";

function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <ErrorWatcher />

      {/* Routes */}
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
          <Route path="/psychologist/forgot-password" element={<ForgotPassword role="psychologist" />} />
          <Route path="/user/forgot-password" element={<ForgotPassword role="user" />} />
        </Route>

        {/* User Routes */}
        <Route
          element={
            <ProtectedRoute allowedRole={"user"} isVerifiedPsychRoute={false} />
          }
        >
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>
          <Route element={<UserLayout />}>
            <Route path="/user/psychologists" element={<BookSession />} />
          </Route>
          <Route element={<UserLayout />}>
            <Route path="/user/psychologist-details" element={<PsychologistDetails />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRole={"admin"}
              isVerifiedPsychRoute={false}
            />
          }
        >
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route
              path="/admin/application-details/:applicationId"
              element={<AdminApplicationDetails />}
            />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/user-details" element={<AdminUserDetails />} />
            <Route
              path="/admin/psychologists"
              element={<AdminPsychologists />}
            />
            <Route
              path="/admin/psychologist-details"
              element={<AdminPsychologistDetails />}
            />
          </Route>
        </Route>

        {/* Psychologist Routes */}

        {/* Unverified Psychologist Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRole={"psychologist"}
              isVerifiedPsychRoute={false}
            />
          }
        >
          <Route
            path="/psychologist/application"
            element={<PsychologistApplication />}
          />
        </Route>

        {/* Verrified Psychologist Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRole={"psychologist"}
              isVerifiedPsychRoute={true}
            />
          }
        >
          <Route element={<PsychologistLayout />}>
            <Route
              path="/psychologist/dashboard"
              element={<PsychologistDashboard />}
            />
          </Route>
           <Route element={<PsychologistLayout />}>
            <Route
              path="/psychologist/availability"
              element={<Availability />}
            />
          </Route>
          <Route element={<PsychologistLayout />}>
            <Route
              path="/psychologist/create-rule"
              element={<CreateRule />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;
