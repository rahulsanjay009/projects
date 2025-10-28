import { useState, useEffect } from "react";

const isAuthenticated = () => {
  return localStorage.getItem("adminToken") === "true";
};

const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(isAuthenticated());

  const login = () => {
    localStorage.setItem("adminToken", "true");
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  useEffect(() => {
    setIsAdmin(isAuthenticated());
  }, []);

  return { isAdmin, login, logout };
};

// ✅ Recommended export style
export { useAuth, isAuthenticated };
