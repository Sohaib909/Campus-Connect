export const isAuthenticated = () => {
  // Check if the user is authenticated based on your token logic.
  // You can use localStorage, sessionStorage, or cookies to store and retrieve the token.
  const token = localStorage.getItem("token"); // Change 'token' to your actual token key
  return token !== null; // Return true if the token exists, otherwise false.
};
