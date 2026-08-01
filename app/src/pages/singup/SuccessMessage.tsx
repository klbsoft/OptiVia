import { commonStyles } from "../../components/theme/default";

interface SuccessMessageProps {
  userType: string;
}

function SuccessMessage({ userType }: SuccessMessageProps) {
  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: commonStyles.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          fontSize: "40px",
          color: "white",
        }}
      >
        ✓
      </div>
      <p style={{ color: commonStyles.green, fontSize: commonStyles.button_fontSize, fontWeight: commonStyles.button_fontWeight, textAlign: "center" }}>
        ¡Cuenta creada!
      </p>
      <p style={{ color: commonStyles.blue, fontSize: commonStyles.text_font_size, textAlign: "center", opacity: 0.7 }}>
        {userType !== "regular"
          ? "Tu cuenta será verificada pronto."
          : "Redirigiendo al inicio..."}
      </p>
    </div>
  );
}

export default SuccessMessage;