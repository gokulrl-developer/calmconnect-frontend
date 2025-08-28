import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import { useAuth } from '@/contexts/AuthContext';
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { loginUserAsync } from "../features/authentication/authThunk";
import { loginPsychologistAsync } from "../features/authentication/authThunk";
import { loginAdminAsync } from "../features/authentication/authThunk";
import { useAppDispatch, useAppSelector } from "../hooks/customReduxHooks";
import { setRole, removeRole } from "../features/authentication/authSlice";

interface LoginProps {
  role: string;
}

const Login: React.FC<LoginProps> = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  //const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  //const userType = (searchParams.get('type') as 'user' | 'psychologist') || 'user';

  //const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      if (role === "user") {
        const result = await dispatch(
          loginUserAsync({ email, password })
        ).unwrap();
        if (result.user) {
          navigate("/user/dashboard");
        }
      } else if (role === "psychologist") {
        const result = await dispatch(
          loginPsychologistAsync({ email, password })
        ).unwrap();
        if (result.psych) {
          if (result.psych.isVerified === true) {
            navigate("/psychologist/dashboard");
          } else {
            navigate("/psychologist/application");
          }
        }
      } else {
        const result = await dispatch(
          loginAdminAsync({ email, password })
        ).unwrap();
        if (result.success) {
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      const errMessage =
        error instanceof Error
          ? error.message
          : "Invalid credentials. Please try again.";
      setErrors({ general: errMessage });
    }
  };

  const handleGoogleAuth = () => {
    const GOOGLE_CLIENT_ID =
      "234773295146-iq4gpjmfq765v1rojtuqjft46d3tqar4.apps.googleusercontent.com";

    // Build Google OAuth URL with state = role
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: "http://localhost:5173/auth/google/callback",
      response_type: "code",
      scope: "openid email profile",
      prompt: "consent",
      state: role,
    });

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

    window.location.href = googleOAuthUrl;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 animate-fade-in shadow-xl">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
          >
            CalmConnect
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in as{" "}
            {role === "user"
              ? "User"
              : role === "psychologist"
              ? "Psychologist"
              : "Admin"}
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">📧</span>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔒</span>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>
        {role !== "admin" ? (
          <div className="text-center mt-3 cursor-pointer">
            <div
              onClick={() => handleGoogleAuth()}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors duration-300"
            >
              <span>
                <svg
                  className="h-6 w-6 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="-0.5 0 48 48"
                  version="1.1"
                >
                  <g
                    id="Icons"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g
                      id="Color-"
                      transform="translate(-401.000000, -860.000000)"
                    >
                      <g
                        id="Google"
                        transform="translate(401.000000, 860.000000)"
                      >
                        <path
                          d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                          id="Fill-1"
                          fill="#FBBC05"
                        >
                          {" "}
                        </path>
                        <path
                          d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                          id="Fill-2"
                          fill="#EB4335"
                        >
                          {" "}
                        </path>
                        <path
                          d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                          id="Fill-3"
                          fill="#34A853"
                        >
                          {" "}
                        </path>
                        <path
                          d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                          id="Fill-4"
                          fill="#4285F4"
                        >
                          {" "}
                        </path>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span>Continue with Google</span>
            </div>
          </div>
        ) : null}
        <div className="my-3 text-center space-y-4">
        {role==="user" || role==="psychologist"?(
            <p className="text-sm text-gray-600">
              <Link
                to={role === "user" ? "/user/forgot-password" : "/psychologist/forgot-password"}
                className="text-primary-600 hover:underline font-medium"
              >
                Forgot Password ? 
              </Link>
            </p>
            ):null}
          {role !== "admin" ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to={role === "user" ? "/user/sign-up" : "/psychologist/sign-up"}
                className="text-primary-600 hover:underline font-medium"
              >
                {role === "user"
                  ? "Sign up as User"
                  : "Sign up as Psychologist"}
              </Link>
            </p>
          ) : null}
          <div className="pt-4 border-t border-gray-300">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
