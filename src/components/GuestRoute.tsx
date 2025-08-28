import { useAppSelector } from '../hooks/customReduxHooks'
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
  const {isAuthenticated,role,isVerified}=useAppSelector((state)=>state.auth);
  if(isAuthenticated===false){
    return <Outlet/>
  }else{
    if(role !=="psychologist" || isVerified===true){
        return <Navigate to={`/${role}/dashboard`}/>
    }else{
     return <Navigate to="/psychologist/application"/>
    }
  }
}

export default GuestRoute;
