import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the authenticated user from your backend or local storage
    const fetchUser = async () => {
      // Example logic: fetch user from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    fetchUser();
  }, []);

  const login = async (userData) => {
    // Example logic: save user data on login
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    router.push("/generate");
  };

  const logout = () => {
    // Example logic: remove user data on logout
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
