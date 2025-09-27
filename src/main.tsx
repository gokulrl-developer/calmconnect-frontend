import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { persistor, store } from './store.ts';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { logout } from './features/authentication/authSlice.ts';
import { setupAxiosInterceptors } from './services/axiosInstance.ts';
import { logOut } from './services/authService.ts';

setupAxiosInterceptors(async () => {
  console.log("axios instance")
  try{
    const isAuthenticated=store.getState().auth?.isAuthenticated;
    if(isAuthenticated===true){
      await logOut();
    }
     store.dispatch(logout());
  }catch(error){
    return error;
  }  
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
