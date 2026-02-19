import { useEffect } from "react";
import { useAuthStore } from "../context/authStore";

const AuthProvider = ({ children }) => {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return children;
};

export default AuthProvider;
