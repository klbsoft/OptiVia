import { useState } from "react";
import { commonStyles } from "../../components/theme/default";
import { useAuth } from "../../context/AuthContext";
import { API_LOGIN, API_SESSION } from "../../constants/config";
import type { UserSession } from "../../session/UserSession";
import { useUserSession } from "../../context/UserSessionContext";
import "../../animation.css"
function Login({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {  const { login } = useAuth();
  const [email, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {setSession} = useUserSession(); 
 

  const handleLogin = async() => {
    if (!email || !password) {
      setError("Todos los campos son requeridos");
      return;
    }

    // Mock login - replace with API call
    console.log("Login:", { email, password });

  if (!email || !password) {
    setError("Todos los campos son requeridos");
    return;
  }

    try {
     
      let response = await fetch(API_LOGIN ,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email:email, password:password }),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }
      let text = await response.text();
      const split = text.split(':');
      const result = split[0];
      const info = split[1];  
      console.log(text);  
      if (result === "OK"){
          response = await fetch(API_SESSION, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id:info}),
          });
          text = await response.text();
          const parsed: UserSession = await JSON.parse(text);
          
          console.log(parsed);
          setSession(parsed)
          login();
          return; 
      }
     alert(`No se pudo iniciar la sesión: ${info}`)
      // login();
    } catch {
      alert("No se pudo verificar el usuario o contraseña. Intente de nuevo.");
    }
    
    // Simulate successful login
    // login();
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: "20px",
    padding: "12px 16px",
    border: `2px solid ${commonStyles.green}`,
    backgroundColor: "#FFFFFF",
    color: commonStyles.blue,
    width: "100%",
    outline: "none",
    fontSize: commonStyles.text_font_size,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "600",
    color: commonStyles.blue,
    marginBottom: "6px",
    opacity: 0.7,
  };

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
    width: "140px",
    height: "140px",
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
      width: "130px",
      height: "130px",
      borderRadius: "50%",
      objectFit: "contain",
    }}
  />
</div>
      <p
        style={{
          marginTop: "16px",
          color: commonStyles.blue,
          textAlign: "center",
          fontSize: commonStyles.text_font_size,
        }}
      >
        Iniciar sesión
      </p>

      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {/* Phone */}
        <div>
          <div style={labelStyle}>Correo electrónico </div>
          <input
            type="email"
            maxLength={100}
            style={inputStyle}
            value={email}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
            placeholder="correo@ejemplo.com"
          />
        </div>

        {/* Password */}
        <div>
          <div style={labelStyle}>Contraseña</div>
          <input
            type="password"
            maxLength={10}
            style={inputStyle}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Tu contraseña"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p
            style={{
              color: "#ff4444",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={!email || !password}
        style={{
          backgroundColor: email && password ? commonStyles.blue : "#CCCCCC",
          border: "none",
          width: "80%",
          borderRadius: "20px",
          padding: "12px",
          color: "white",
          marginTop: "24px",
          fontSize: commonStyles.button_fontSize,
          fontWeight: commonStyles.button_fontWeight,
          cursor: email && password ? "pointer" : "not-allowed",
        }}
      >
        Entrar
      </button>

      {/* Link to Sign Up */}
      <p
        style={{
          marginTop: "16px",
          color: commonStyles.blue,
          fontSize: "14px",
          opacity: 0.7,
        }}
      >
        ¿No tienes cuenta?{" "}
        <span
          style={{
            color: commonStyles.green,
            fontWeight: "600",
            cursor: "pointer",
          }}
          onClick={onSwitchToSignup}
        >
          Crear una
        </span>
      </p>
    </div>
  );
}

export default Login;