import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks/customReduxHooks";
import {
  googleAuthPsyThunk,
  googleAuthUserThunk,
} from "../features/authentication/authThunk";
import { setError } from "../features/statusSlice";
import Card from '../components/UI/Card';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function handleAuth() {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const role = params.get("state");
      if (!code) {
        navigate("/login");
        return;
      }     
      try {
        if (role === "user") {
          await dispatch(googleAuthUserThunk({ code })).unwrap();
          navigate("/user/dashboard");
        } else if (role === "psychologist") {
          const result = await dispatch(googleAuthPsyThunk({ code })).unwrap();
          if(result.psych.isVerified===false){
            navigate("/psychologist/application");
          }else{
            navigate("/psychologist/dashboard")
          }
        }
      } catch (error) {
        console.log("error on authentication",error)
        dispatch(setError("error occured"));
        navigate("/");
      }
    }
    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <Card className="p-8 shadow-xl text-center max-w-md">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-primary-500 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Logging you in...</h2>
          <p className="text-gray-600">Please wait while we authenticate your account.</p>
        </div>
      </Card>
    </div>
  );
};

export default GoogleCallback;
