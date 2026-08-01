
import { commonStyles } from "../../components/theme/default";
import type { SignUpFormData } from "./Singup";
import UserTypeSection from "./UserTypeSection";

interface PersonalDataFormProps {
  formData: SignUpFormData;
  setFormData: (data: SignUpFormData) => void;
}

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

function PersonalDataForm({ formData, setFormData }: PersonalDataFormProps) {
  const updateField = (field: keyof SignUpFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <>
      <div>
        <div style={labelStyle}>Nombre *</div>
        <input
          style={inputStyle}
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <div style={labelStyle}>Apellido *</div>
        <input
          style={inputStyle}
          value={formData.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          placeholder="Tu apellido"
        />
      </div>

      <div>
        <div style={labelStyle}>Fecha de nacimiento</div>
        <input
          type="date"
          style={inputStyle}
          value={formData.dateOfBirth}
          onChange={(e) => updateField("dateOfBirth", e.target.value)}
        />
      </div>

      <div>
        <div style={labelStyle}>Correo electrónico *</div>
        <input
          type="email"
          style={inputStyle}
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <div style={labelStyle}>Teléfono</div>
        <input
          type="tel"
          style={inputStyle}
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="(809) 000-0000"
        />
      </div>

      <UserTypeSection formData={formData} setFormData={setFormData} />

      <div>
        <div style={labelStyle}>Contraseña *</div>
        <input
          type="password"
          style={inputStyle}
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div>
        <div style={labelStyle}>Confirmar contraseña *</div>
        <input
          type="password"
          style={inputStyle}
          value={formData.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          placeholder="Repite tu contraseña"
        />
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>
            Las contraseñas no coinciden
          </p>
        )}
      </div>
    </>
  );
}

export default PersonalDataForm;