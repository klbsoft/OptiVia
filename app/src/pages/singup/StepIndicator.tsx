import { commonStyles } from "../../components/theme/default";

interface StepIndicatorProps {
  currentStep: "user" | "card";
  onStepChange: (step: "user" | "card") => void;
}

function StepIndicator({ currentStep, onStepChange }: StepIndicatorProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginTop: "12px",
        marginBottom: "8px",
        width: "80%",
      }}
    >
      <button
        onClick={() => onStepChange("user")}
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "20px",
          border: `2px solid ${commonStyles.green}`,
          backgroundColor: currentStep === "user" ? commonStyles.blue : "white",
          color: currentStep === "user" ? "white" : commonStyles.blue,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        1. Datos personales
      </button>
      <button
        onClick={() => onStepChange("card")}
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "20px",
          border: `2px solid ${commonStyles.green}`,
          backgroundColor: currentStep === "card" ? commonStyles.blue : "white",
          color: currentStep === "card" ? "white" : commonStyles.blue,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        2. Tarjeta (opcional)
      </button>
    </div>
  );
}

export default StepIndicator;