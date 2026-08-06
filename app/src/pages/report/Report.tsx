import { useState, useEffect } from "react";
import { commonStyles } from "../../components/theme/default";
import { useView } from "../../context/ViewContext";
import Home from "../home/Home";
import "../../animation.css"

const reportTypes = [
  { value: "fear", label: "Miedo / Inseguridad" },
  { value: "reckless_driving", label: "Conducción temeraria" },
  { value: "harassment", label: "Acoso / Intimidación" },
  { value: "theft", label: "Robo / Asalto" },
  { value: "unsafe_conditions", label: "Condiciones inseguras" },
  { value: "overcrowding", label: "Aglomeración excesiva" },
  { value: "technical_malfunction", label: "Falla técnica / Mecánica" },
  { value: "other", label: "Otro" },
];

const referenceTypes = [
  { value: "bus", label: "Autobús" },
  { value: "trip", label: "Viaje" },
  { value: "route", label: "Ruta" },
  { value: "station", label: "Estación" },
  { value: "driver", label: "Conductor" },
  { value: "passenger", label: "Pasajero" },
  { value: "other", label: "Otro" },
];

function Report() {
  const { setCurrentView } = useView();
  const [reportType, setReportType] = useState("");
  const [showReportTypeDropdown, setShowReportTypeDropdown] = useState(false);
  const [referenceType, setReferenceType] = useState("");
  const [showReferenceTypeDropdown, setShowReferenceTypeDropdown] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!reportType) return;
    
    const newReport = {
      id: `rpt_${Date.now()}`,
      user_id: "usr_1a2b3c4d", // Replace with actual user ID
      report_type: reportType,
      description: description,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      reference_id: referenceId || undefined,
      reference_type: referenceType || undefined,
      metadata: {
        report_type_label: reportTypes.find(t => t.value === reportType)?.label,
        reference_type_label: referenceTypes.find(t => t.value === referenceType)?.label,
      },
      reviewed_by: null,
      reviewed_at: null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSent(true);
    console.log("Report submitted:", newReport);
    // API call here later
  };

  // Auto-redirect to Home after 1.5 seconds
  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        setCurrentView(<Home />);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [sent, setCurrentView]);

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

  // If sent, show confirmation only
  if (sent) {
    return (
      <div
          className="page-transition"
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
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
        <p
          style={{
            color: commonStyles.green,
            fontSize: commonStyles.button_fontSize,
            fontWeight: commonStyles.button_fontWeight,
            textAlign: "center",
          }}
        >
          Reporte enviado
        </p>
        <p
          style={{
            color: commonStyles.blue,
            fontSize: commonStyles.text_font_size,
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          Regresando al menú...
        </p>
      </div>
    );
  }

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
        Reportar un incidente o situación
      </p>

      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "8px",
        }}
      >
        {/* Report Type Dropdown */}
        <div>
          <div style={labelStyle}>Tipo de Reporte</div>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowReportTypeDropdown(!showReportTypeDropdown)}
              style={{
                ...inputStyle,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ opacity: reportType ? 1 : 0.5 }}>
                {reportTypes.find(t => t.value === reportType)?.label || "Seleccionar tipo de reporte"}
              </span>
              <span style={{ color: commonStyles.green }}>▼</span>
            </div>

            {showReportTypeDropdown && (
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
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {reportTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => {
                      setReportType(type.value);
                      setShowReportTypeDropdown(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      color: commonStyles.blue,
                      backgroundColor:
                        reportType === type.value ? "rgba(108, 194, 74, 0.1)" : "white",
                    }}
                  >
                    {type.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reference Type Dropdown */}
        <div>
          <div style={labelStyle}>Tipo de Referencia (Opcional)</div>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowReferenceTypeDropdown(!showReferenceTypeDropdown)}
              style={{
                ...inputStyle,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ opacity: referenceType ? 1 : 0.5 }}>
                {referenceTypes.find(t => t.value === referenceType)?.label || "Seleccionar tipo de referencia"}
              </span>
              <span style={{ color: commonStyles.green }}>▼</span>
            </div>

            {showReferenceTypeDropdown && (
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
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {referenceTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => {
                      setReferenceType(type.value);
                      setShowReferenceTypeDropdown(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      color: commonStyles.blue,
                      backgroundColor:
                        referenceType === type.value ? "rgba(108, 194, 74, 0.1)" : "white",
                    }}
                  >
                    {type.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reference ID Input */}
        <div>
          <div style={labelStyle}>ID de Referencia (Opcional)</div>
          <input
            type="text"
            placeholder="Número de autobús, ruta, etc."
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Location Fields */}
        <div style={{ display: "none", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Latitud (Opcional)</div>
            <input
              type="text"
              placeholder="Ej: 18.4861"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Longitud (Opcional)</div>
            <input
              type="text"
              placeholder="Ej: -69.9312"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <div style={labelStyle}>Descripción</div>
          <textarea
            placeholder="Describe lo sucedido..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "100px",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          width: "80%",
          display: "flex",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => setCurrentView(<Home />)}
          style={{
            flex: 1,
            backgroundColor: "transparent",
            border: `2px solid ${commonStyles.blue}`,
            borderRadius: "20px",
            padding: "12px",
            color: commonStyles.blue,
            fontSize: commonStyles.button_fontSize,
            fontWeight: commonStyles.button_fontWeight,
            cursor: "pointer",
          }}
        >
          ← Volver
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!reportType}
          style={{
            flex: 1,
            backgroundColor: reportType ? commonStyles.blue : "#CCCCCC",
            border: "none",
            borderRadius: "20px",
            padding: "12px",
            color: "white",
            fontSize: commonStyles.button_fontSize,
            fontWeight: commonStyles.button_fontWeight,
            cursor: reportType ? "pointer" : "not-allowed",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Report;