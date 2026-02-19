// src/context/AuthProvider.jsx
import { useEffect } from "react";
import { useAuthStore } from "./authStore";

const AuthProvider = ({ children }) => {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    console.log("AuthProvider mounted, fetching user...");
    fetchMe();
  }, [fetchMe]);

  return children;
};

export default AuthProvider;
