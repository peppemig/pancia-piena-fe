import { auth } from "@/config/firebaseConfig";
import { createContext, useState, useEffect, useContext } from "react";
import { User, onAuthStateChanged } from "firebase/auth";

type AuthState =
  | { state: "loading"; user: null }
  | { state: "loaded"; isAuthentication: true; user: User }
  | { state: "loaded"; isAuthentication: false; user: null }
  | { state: "error"; error: Error; user: null };

const AuthStateContext = createContext<AuthState | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    state: "loading",
    user: null,
  });

  const onChange = (user: User | null) => {
    if (user) {
      setAuthState({ state: "loaded", isAuthentication: true, user });
    } else {
      setAuthState({ state: "loaded", isAuthentication: false, user });
    }
  };
  const setError = (error: Error) => {
    setAuthState({ state: "error", error, user: null });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onChange, setError);
    return () => unsubscribe();
  }, []);

  return (
    <AuthStateContext.Provider value={authState}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const authState = useContext(AuthStateContext);
  if (!authState) throw new Error("AuthProvider not found");
  return authState;
};
