import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './Components/notificationSlice.js';


const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    // Add other reducers here if you have more slices
  },
});


export default store;
