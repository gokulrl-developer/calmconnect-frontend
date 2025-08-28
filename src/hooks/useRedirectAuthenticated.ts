import { useEffect } from 'react';
import { useAppSelector } from './customReduxHooks';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store'; 

const useRedirectAuthenticated = () => {
  const { isAuthenticated, role } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  console.log(isAuthenticated,role)
  useEffect(() => {
    if (isAuthenticated) {
      switch (role) {
        case 'user':
          navigate('/user/dashboard', { replace: true });
          break;
        case 'psychologist':
          navigate('/psychologist/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
      }
    }
  }, [isAuthenticated, role, navigate]);
};

export default useRedirectAuthenticated;
