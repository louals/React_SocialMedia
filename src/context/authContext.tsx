import { getCurrentUser } from "@/lib/appwrite/api";
import { IContextType, IUser } from "@/Types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: true, // Start as true to handle initial load
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(true); // Start loading
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      
      if (!currentAccount) {
        console.error("No user returned from getCurrentUser()");
        return false;
      }

      setUser({
        id: currentAccount.$id,
        name: currentAccount.name,
        username: currentAccount.username,
        email: currentAccount.email,
        imageUrl: currentAccount.imageUrl,
        bio: currentAccount.bio,
      });

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    
    // Immediately redirect if no session cookie exists
    if (!cookieFallback || cookieFallback === "[]") {
      navigate("/sign-in");
      setIsLoading(false);
      return;
    }

    // Check auth only if we have a cookie
    checkAuthUser().then((isAuth) => {
      if (!isAuth) {
        navigate("/sign-in");
      }
    });
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);