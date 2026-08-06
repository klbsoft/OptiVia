// FooterContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";
import { commonStyles } from "../components/theme/default";

type FooterContextType = {
  leftBorder: string;
  rightBorder: string;
  isEnabled: boolean;
  activeView: number;
  setEnabled: (enabled: boolean) => void;
  setDefault: () => void;
  setLeftView: () => void;
  setRightView: () => void;
};

const FooterContext = createContext<FooterContextType | undefined>(undefined);
const size = "10px";
export function FooterProvider({ children }: { children: ReactNode }) {
  const [leftBorder, setLeft] = useState(`${size} solid ${commonStyles.blue}`);
  const [rightBorder, setRight] = useState(`${size} solid ${commonStyles.green}`);
  const [isEnabled, setEnabled] = useState(true);
  const [activeView, setActiveView] = useState(0);

  const setDefault = () => {
    setLeft(`${size} solid ${commonStyles.blue}`);
    setRight(`${size} solid ${commonStyles.green}`);
    setActiveView(0);
  };

  const setLeftView = () => {
    setLeft(`${size} solid ${commonStyles.blue}`);
    setRight(`${size} solid ${commonStyles.blue}`);
    setActiveView(1);
  };

  const setRightView = () => {
    setLeft(`${size} solid ${commonStyles.green}`);
    setRight(`${size} solid ${commonStyles.green}`);
    setActiveView(2);
  };

  return (
    <FooterContext.Provider value={{ 
      leftBorder, 
      rightBorder, 
      isEnabled, 
      activeView,
      setEnabled, 
      setDefault, 
      setLeftView, 
      setRightView 
    }}>
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter(): FooterContextType {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error("useFooter must be used within a FooterProvider");
  }
  return context;
}