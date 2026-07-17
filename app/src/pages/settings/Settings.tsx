import { useState } from "react";
import { commonStyles } from "../../components/theme/default";
import { useView } from "../../context/ViewContext";
import Report from "../report/Report";

function Settings() {
  const { setCurrentView } = useView();
  const [notifications, setNotifications] = useState({
    trip_updates: true,
    payment_reminders: true,
    security_alerts: true,
    promotions: false,
  });
  const [language, setLanguage] = useState("es");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" },
  ];

const handleToggle = (key: keyof typeof notifications) => {
  setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
};

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "600",  
    color: commonStyles.blue,
    marginBottom: "6px",
    opacity: 0.7,
  };

  const toggleRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  };

  const toggleSwitchStyle = (active: boolean): React.CSSProperties => ({
    width: "48px",
    height: "26px",
    borderRadius: "13px",
    backgroundColor: active ? commonStyles.green : "#CCCCCC",
    position: "relative",
    cursor: "pointer",
    transition: "background-color 0.2s",
  });

  const toggleCircleStyle = (active: boolean): React.CSSProperties => ({
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "white",
    position: "absolute",
    top: "2px",
    left: active ? "24px" : "2px",
    transition: "left 0.2s",
  });

  return (
    <div
      style={{
        padding: "16px",
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
        Configuración
      </p>

      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        {/* Notifications Section */}
        <div style={{ marginBottom: "16px" }}>
          <div style={labelStyle}>Notificaciones</div>
          
          <div style={toggleRowStyle}>
            <span style={{ color: commonStyles.blue, fontSize: commonStyles.text_font_size }}>
              Actualizaciones de viaje
            </span>
            <div
              style={toggleSwitchStyle(notifications.trip_updates)}
              onClick={() => handleToggle("trip_updates")}
            >
              <div style={toggleCircleStyle(notifications.trip_updates)} />
            </div>
          </div>

          <div style={toggleRowStyle}>
            <span style={{ color: commonStyles.blue, fontSize: commonStyles.text_font_size }}>
              Recordatorios de pago
            </span>
            <div
              style={toggleSwitchStyle(notifications.payment_reminders)}
              onClick={() => handleToggle("payment_reminders")}
            >
              <div style={toggleCircleStyle(notifications.payment_reminders)} />
            </div>
          </div>

          <div style={toggleRowStyle}>
            <span style={{ color: commonStyles.blue, fontSize: commonStyles.text_font_size }}>
              Alertas de seguridad
            </span>
            <div
              style={toggleSwitchStyle(notifications.security_alerts)}
              onClick={() => handleToggle("security_alerts")}
            >
              <div style={toggleCircleStyle(notifications.security_alerts)} />
            </div>
          </div>

          <div style={toggleRowStyle}>
            <span style={{ color: commonStyles.blue, fontSize: commonStyles.text_font_size }}>
              Promociones
            </span>
            <div
              style={toggleSwitchStyle(notifications.promotions)}
              onClick={() => handleToggle("promotions")}
            >
              <div style={toggleCircleStyle(notifications.promotions)} />
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div style={{ marginBottom: "16px" }}>
          <div style={labelStyle}>Idioma</div>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              style={{
                borderRadius: "20px",
                padding: "12px 16px",
                border: `2px solid ${commonStyles.green}`,
                backgroundColor: "#FFFFFF",
                color: commonStyles.blue,
                width: "100%",
                outline: "none",
                fontSize: commonStyles.text_font_size,
                boxSizing: "border-box",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{languages.find(l => l.value === language)?.label}</span>
              <span style={{ color: commonStyles.green }}>▼</span>
            </div>

            {showLanguageDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                  borderRadius: "12px",
                  marginTop: "4px",
                  zIndex: 1000,
                }}
              >
                {languages.map((lang) => (
                  <div
                    key={lang.value}
                    onClick={() => {
                      setLanguage(lang.value);
                      setShowLanguageDropdown(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      color: commonStyles.blue,
                      backgroundColor:
                        language === lang.value ? "rgba(108, 194, 74, 0.1)" : "white",
                    }}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Issue Button */}
      <button
        onClick={() => setCurrentView(<Report />)}
        style={{
          backgroundColor: "#ff4444",
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
        Reportar un problema
      </button>
    </div>
  );
}

export default Settings;