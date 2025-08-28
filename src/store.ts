import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import {createLogger} from 'redux-logger'
import authReducer from './features/authentication/authSlice';
import statusReducer from './features/statusSlice'
import storage from 'redux-persist/lib/storage';

const logger = createLogger({
  collapsed: true, 
  diff: true,     
});

const rootReducer = combineReducers({ 
auth:authReducer,
status:statusReducer
});
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),

});

export const persistor = persistStore(store);
export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;
export default store;
