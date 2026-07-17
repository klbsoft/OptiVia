// ViewContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";

type ViewContextType = {
  currentView: ReactNode | null;
  setCurrentView: (view: ReactNode | null) => void;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ReactNode | null>(null);

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView(): ViewContextType {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}