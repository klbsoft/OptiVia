// session/UserSessionContext.tsx
import { createContext, useState, useContext, useCallback, type ReactNode } from "react";
import { API_SYNC_USER } from "../constants/config";
import { type UserSession } from "../session/UserSession";

type UserSessionContextType = {
  session: UserSession;
  setSession: (session: UserSession) => void;
  updateSession: (updates: Partial<UserSession>) => void;
};

const emptySession: UserSession = {
  user: { id: "", name: "", last_name: "", date_of_birth: "", email: "", phone: "" },
  cards: [],
  history: [],
  settings: {} as UserSession["settings"]
};

const UserSessionContext = createContext<UserSessionContextType | undefined>(undefined);

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<UserSession>(emptySession);

  const syncToServer = async (data: UserSession) => {
    try {
      await fetch(API_SYNC_USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // onSyncFailed();
    }
  };

  const setSession = useCallback((newSession: UserSession) => {
    setSessionState(newSession);
    syncToServer(newSession);
  }, []);

  const updateSession = useCallback((updates: Partial<UserSession>) => {
    setSessionState((prev) => {
      const merged = { ...prev, ...updates };
      syncToServer(merged);
      return merged;
    });
  }, []);

  return (
    <UserSessionContext.Provider value={{ session, setSession, updateSession }}>
      {children}
    </UserSessionContext.Provider>
  );
}

export function useUserSession(): UserSessionContextType {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
}