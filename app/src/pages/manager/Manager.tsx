import React, { useState } from "react";

const commonStyles = {
  text_font_size: "16px",
  text_font_weight: "400",
  button_fontSize: "14px",
  button_fontWeight: "500",
  green: "#6CC24A",
  blue: "#0367C7",
  white: "#ffffff",
};

type SubMenuItem = {
  label: string;
  onClick?: () => void;
};

type MenuItem = {
  icon: string;
  label: string;
  subItems?: SubMenuItem[];
  isProfile?: boolean;
};

export default function Management() {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const menuItems: MenuItem[] = [
    {
      icon: "📊",
      label: "Vista General",
      subItems: [
        { label: "Vista general del día" },
        { label: "Métricas en tiempo real" },
        { label: "Alertas y notificaciones" },
        { label: "Acceso rápido a acciones frecuentes" },
      ],
    },
    {
      icon: "🔧",
      label: "Mantenimiento",
      subItems: [
        { label: "Buses" },
        { label: "Conductores" },
        { label: "Rutas" },
        { label: "Asignaciones" },
        { label: "Horarios" },
        { label: "Tarifas" },
      ],
    },
    {
      icon: "⚙️",
      label: "Operaciones",
      subItems: [
        { label: "Viajes en curso" },
        { label: "Incidentes reportados" },
        { label: "Quejas/Sugerencias" },
        { label: "Mantenimiento de buses" },
        { label: "Desvíos temporales" },
      ],
    },
    {
      icon: "📋",
      label: "Consultas",
      subItems: [
        { label: "Usuarios" },
        { label: "Wallets" },
        { label: "Métodos de pago" },
        { label: "Descuentos aplicados" },
        { label: "Transacciones" },
      ],
    },
    {
      icon: "📈",
      label: "Reportes",
      subItems: [
        { label: "Reportes diarios" },
        { label: "Desempeño de conductores" },
        { label: "Análisis de pasajeros" },
        { label: "Ingresos por método de pago" },
        { label: "Métricas de eficiencia" },
        { label: "Reportes de efectivo" },
      ],
    },
    {
      icon: "🔐",
      label: "Administración",
      subItems: [
        { label: "Administradores" },
        { label: "Auditoría" },
        { label: "Notificaciones masivas" },
        { label: "Alertas de emergencia" },
        { label: "Anuncios en la app" },
      ],
    },
    {
      icon: "⚙️",
      label: "Configuración",
      subItems: [
        { label: "Ajustes del sistema" },
        { label: "Preferencias personales" },
        { label: "Cambiar contraseña" },
        { label: "Notificaciones del usuario" },
      ],
    },
  ];

  const profileMenuItems: SubMenuItem[] = [
    { label: "Mi perfil" },
    { label: "Preferencias" },
    { label: "Cambiar contraseña" },
    { label: "Ayuda/Soporte" },
    { label: "Cerrar sesión" },
  ];

  const handleMainButtonClick = (index: number) => {
    setActiveMenu(activeMenu === index ? null : index);
    setShowProfileDropdown(false);
  };

  const handleSubItemClick = (mainLabel: string, subLabel: string) => {
    console.log(`Navigating to: ${mainLabel} > ${subLabel}`);
    setActiveMenu(null);
    setShowProfileDropdown(false);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setActiveMenu(null);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* TOP BAR */}
      <header
        style={{
          height: "70px",
          background: commonStyles.blue,
          color: commonStyles.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
        }}
      >
        {/* <h2 style={{ margin: 0 }}>Bus Management System</h2> */}
      <img 
        src="/opti-via/img/logo_no_back.png" 
        alt="Opti Via" 
        style={{ 
          height: "100px", 
          width: "auto",
          display: "block",
        }} 
      />
        {/* PROFILE SECTION */}
        <div style={{ position: "relative" }}>
          <button
            onClick={handleProfileClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: commonStyles.white,
              cursor: "pointer",
              fontSize: "14px",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              if (!showProfileDropdown) {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }
            }}
          >
            <span style={{ 
              fontSize: "20px",
              backgroundColor:"white",
              borderRadius:"50%",
              }}>👤</span>
            <span>Admin</span>
            <span
              style={{
                fontSize: "10px",
                transform: showProfileDropdown
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
              ▼
            </span>
          </button>

          {/* PROFILE DROPDOWN */}
          {showProfileDropdown && (
            <>
              <div
                onClick={() => setShowProfileDropdown(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9998,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  background: commonStyles.white,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  minWidth: "200px",
                  zIndex: 9999,
                }}
              >
                {profileMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleSubItemClick("Perfil", item.label)
                    }
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px 20px",
                      border: "none",
                      background: "transparent",
                      color: item.label === "Cerrar sesión" ? "#d32f2f" : "#333",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "14px",
                      borderBottom:
                        index < profileMenuItems.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                      borderRadius:
                        index === 0
                          ? "8px 8px 0 0"
                          : index === profileMenuItems.length - 1
                          ? "0 0 8px 8px"
                          : "0",
                      transition: "all 0.15s ease",
                      fontWeight:
                        item.label === "Cerrar sesión" ? "600" : "400",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        item.label === "Cerrar sesión"
                          ? "#fff5f5"
                          : "#f0f7ff";
                      e.currentTarget.style.color =
                        item.label === "Cerrar sesión"
                          ? "#d32f2f"
                          : commonStyles.blue;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color =
                        item.label === "Cerrar sesión" ? "#d32f2f" : "#333";
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* NAVIGATION BAR */}
      <div style={{ background: commonStyles.white }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "0 10px",
            borderBottom: "2px solid #e0e0e0",
          }}
        >
          {menuItems.map((item, index) => (
            <div
              key={index}
              style={{
                position: "relative",
              }}
            >
              {/* MAIN BUTTON */}
              <button
                onClick={() => handleMainButtonClick(index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "15px 16px",
                  border: "none",
                  background:
                    activeMenu === index ? commonStyles.green : "transparent",
                  color: activeMenu === index ? commonStyles.white : "#333",
                  cursor: "pointer",
                  fontSize: commonStyles.button_fontSize,
                  fontWeight: commonStyles.button_fontWeight,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  borderBottom:
                    activeMenu === index
                      ? `3px solid ${commonStyles.green}`
                      : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== index) {
                    e.currentTarget.style.background = "#f5f5f5";
                    e.currentTarget.style.color = commonStyles.blue;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeMenu !== index) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#333";
                  }
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.subItems && (
                  <span
                    style={{
                      fontSize: "10px",
                      transform:
                        activeMenu === index
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    ▼
                  </span>
                )}
              </button>

              {/* DROPDOWN MENU */}
              {activeMenu === index && item.subItems && (
                <>
                  <div
                    onClick={() => setActiveMenu(null)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 9998,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      background: commonStyles.white,
                      border: "1px solid #ddd",
                      borderRadius: "0 0 8px 8px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      minWidth: "280px",
                      zIndex: 9999,
                    }}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() =>
                          handleSubItemClick(item.label, subItem.label)
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "12px 20px",
                          border: "none",
                          background: "transparent",
                          color: "#333",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "14px",
                          borderBottom:
                            subIndex < item.subItems!.length - 1
                              ? "1px solid #f0f0f0"
                              : "none",
                          borderRadius:
                            subIndex === 0
                              ? "0"
                              : subIndex === item.subItems!.length - 1
                              ? "0 0 8px 8px"
                              : "0",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f0f7ff";
                          e.currentTarget.style.color = commonStyles.blue;
                          e.currentTarget.style.paddingLeft = "25px";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#333";
                          e.currentTarget.style.paddingLeft = "20px";
                        }}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* EMPTY CONTENT AREA */}
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          background: "#f4f6f8",
          padding: "30px",
        }}
      >
        <p style={{ color: "#999", textAlign: "center", marginTop: "100px" }}>
          Select a menu item to get started
        </p>
      </div>
    </div>
  );
}