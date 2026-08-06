import { useState } from "react";
import { commonStyles } from "../../components/theme/default";
import { useUserSession } from "../../context/UserSessionContext";
import "../../animation.css"
const mockUser = {
  id:"not-known",
  name: "Ana",
  last_name: "García",
  date_of_birth: "1024-01-01",
  email: "not@real.email",
  phone: "(255) 255-1024",
};

function Profile() {
  const {session,updateSession} = useUserSession();
  const [user, setUser] = useState(session?.user||mockUser);
  const [saved, setSaved] = useState(false);

const handleChange = (field: string, value: string) => {
  setUser((prev) => ({ ...prev, [field]: value } as typeof prev));
  setSaved(false);
};

  const handleSave = () => {
   updateSession({ user: user });
   setSaved(true);
  console.log("Guardado:", user);
    // API call here later
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
        paddingTop: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p
        style={{
          marginTop: "16px",
          color: commonStyles.blue,
          textAlign: "center",
          fontSize: commonStyles.text_font_size,
        }}
      >
        Información personal
      </p>

      {/* Avatar */}
      {/* <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: commonStyles.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "16px 0 24px 0",
          fontSize: "32px",
          fontWeight: "700",
          color: "white",
        }}
      >
        {user.name.charAt(0)}
        {user.last_name.charAt(0)}
      </div> */}

      {/* Fields */}
      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Name */}
        <div>
          <div style={labelStyle}>Nombre</div>
          <input
            style={inputStyle}
            value={user.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div>
          <div style={labelStyle}>Apellido</div>
          <input
            style={inputStyle}
            value={user.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <div style={labelStyle}>Fecha de nacimiento</div>
          <input
            type="date"
            style={inputStyle}
            value={user.date_of_birth}
            onChange={(e) => handleChange("date_of_birth", e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <div style={labelStyle}>Correo electrónico</div>
          <input
            type="email"
            style={inputStyle}
            value={user.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* Phone */}
        <div>
          <div style={labelStyle}>Teléfono</div>
          <input
            type="tel"
            style={inputStyle}
            value={user.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          backgroundColor: saved ? commonStyles.green : commonStyles.blue,
          border: "none",
          width: "80%",
          borderRadius: "20px",
          padding: "12px",
          color: "white",
          marginTop: "24px",
          fontSize: commonStyles.button_fontSize,
          fontWeight: commonStyles.button_fontWeight,
          cursor: "pointer",
        }}
      >
        {saved ? "✓ Guardado" : "Guardar"}
      </button>
    </div>
  );
}

export default Profile;