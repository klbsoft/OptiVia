// FooterContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";
import { commonStyles } from "../components/theme/default";

type FooterContextType = {
  leftBorder: string;
  rightBorder: string;
  isEnabled: boolean;
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

  const setDefault = () => {
    setLeft(`${size} solid ${commonStyles.blue}`);
    setRight(`${size} solid ${commonStyles.green}`);
  };

  const setLeftView = () => {
    setLeft(`${size} solid ${commonStyles.blue}`);
    setRight(`${size} solid ${commonStyles.blue}`);
  };

  const setRightView = () => {
    setLeft(`${size} solid ${commonStyles.green}`);
    setRight(`${size} solid ${commonStyles.green}`);
  };

  return (
    <FooterContext.Provider value={{ 
      leftBorder, 
      rightBorder, 
      isEnabled, 
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