import {getCurrentUser} from "@/services/AuthService";
import {Iuser} from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface IUserProviderValues {
  user: Iuser | null;
  isLoading: boolean;
  setUser: (user: Iuser | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<Iuser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch authenticated user
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser as Iuser | null);
    } catch (error) {
      setUser(null);
    }
  }, []);

  // Initial authentication check
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};

export default UserProvider;
