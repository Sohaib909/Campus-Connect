import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    
    markNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.isRead = true;
      });
    },
  },
});


export const { addNotification, markNotificationsAsRead } = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.notifications;

export default notificationsSlice.reducer;
