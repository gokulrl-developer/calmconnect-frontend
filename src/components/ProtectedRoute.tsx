import React from 'react'
import { useAppSelector } from '../hooks/customReduxHooks'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({allowedRole,isVerifiedPsychRoute}:{allowedRole:string,isVerifiedPsychRoute:boolean}) => {
  const {role,isAuthenticated,isVerified}=useAppSelector((state)=>state.auth);
    if(isAuthenticated===true){
    if(role===allowedRole){
       if(role !=="psychologist" || isVerifiedPsychRoute===isVerified){
           return <Outlet/>
       }else{
         console.log("navigating to unauthorised");
           return <Navigate to="/unauthorised" replace/>
        }
       }else{
      return <Navigate to="/unauthorised" replace/>
    }
  }else{
    return <Navigate to="/" replace/>
  }
}

export default ProtectedRoute
