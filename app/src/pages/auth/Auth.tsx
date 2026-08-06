import { useState } from "react";
import { commonStyles } from "../../components/theme/default";
import Login from "../login/Login";
import SignUp from "../singup/Singup";
import "../../animation.css"

function Auth() {
  const [view, setView] = useState<"choice" | "login" | "signup">("choice");

  if (view === "login") return <Login onSwitchToSignup={() => setView("signup")} />;
  if (view === "signup") return <SignUp onSwitchToLogin={() => setView("login")} />;

  return (
    <div
     className="page-transition"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
      }}
    >
      {/* Logo / App Name */}
<div
  style={{
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    backgroundColor: commonStyles.blue,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  }}
>
  <img 
    src="/opti-via/img/logo_no_back.png" 
    alt="Opti-Vía" 
    style={{
      width: "240px",
      height: "240px",
      borderRadius: "50%",
      objectFit: "contain",
    }}
  />
</div>

      <p
        style={{
          color: commonStyles.blue,
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        Opti Vía
      </p>

      <p
        style={{
          color: commonStyles.blue,
          textAlign: "center",
          fontSize: commonStyles.text_font_size,
          opacity: 0.7,
          marginBottom: "40px",
        }}
      >
        Transporte público en tiempo real
      </p>

      {/* Buttons */}
      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <button
          onClick={() => setView("login")}
          style={{
            backgroundColor: commonStyles.blue,
            border: "none",
            width: "100%",
            borderRadius: "20px",
            padding: "14px",
            color: "white",
            fontSize: commonStyles.button_fontSize,
            fontWeight: commonStyles.button_fontWeight,
            cursor: "pointer",
          }}
        >
          Iniciar sesión
        </button>

        <button
          onClick={() => setView("signup")}
          style={{
            backgroundColor: "transparent",
            border: `2px solid ${commonStyles.green}`,
            width: "100%",  
            borderRadius: "20px",
            padding: "14px",
            color: commonStyles.blue,
            fontSize: commonStyles.button_fontSize,
            fontWeight: commonStyles.button_fontWeight,
            cursor: "pointer",
          }}
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
}

export default Auth;