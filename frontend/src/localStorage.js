// localStorageUtils.js

// Function to save the authentication token to local storage
export const saveTokenToLocalStorage = (token) => {
  localStorage.setItem("authToken", token);
  const expirationTime = new Date().getTime() + 15 * 60 * 1000; // 15 minutes
  localStorage.setItem("authTokenExpires", expirationTime);
};

// Function to save the user role to local storage
export const saveUserRoleToLocalStorage = (userRole) => {
  localStorage.setItem("userRole", userRole);
};

// Function to clear the authentication token from local storage
export const clearTokenFromLocalStorage = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authTokenExpires");
};
