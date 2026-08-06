import type { SignUpFormData } from "./Singup";
import FileUpload from "./FileUpload";
import { commonStyles } from "../../components/theme/default";

interface UserTypeSectionProps {
  formData: SignUpFormData;
  setFormData: (data: SignUpFormData) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: commonStyles.blue,
  marginBottom: "6px",
  opacity: 0.7,
};

function UserTypeSection({ formData, setFormData }: UserTypeSectionProps) {
  const updateField = (field: keyof SignUpFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      style={{
        marginTop: "8px",
        padding: "12px",
        borderRadius: "12px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #e0e0e0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <span style={{ color: commonStyles.blue, fontSize: "14px" }}>
          ¿Eres servidor público o estudiante?
        </span>
        <div
          onClick={() => {
            const newValue = !formData.isSpecialUser;
            updateField("isSpecialUser", newValue);
            if (!newValue) {
              updateField("userType", "");
              updateField("verificationDoc", null);
              updateField("docPreview", null);
            }
          }}
          style={{
            width: "48px",
            height: "26px",
            borderRadius: "13px",
            backgroundColor: formData.isSpecialUser ? commonStyles.green : "#CCCCCC",
            position: "relative",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: "white",
              position: "absolute",
              top: "2px",
              left: formData.isSpecialUser ? "24px" : "2px",
              transition: "left 0.2s",
            }}
          />
        </div>
      </div>

      {formData.isSpecialUser && (
        <>
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e0e0e0" }}>
            <div style={labelStyle}>Tipo de beneficio *</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  if (formData.userType === "gov") {
                    updateField("userType", "");
                    updateField("verificationDoc", null);
                    updateField("docPreview", null);
                  } else {
                    updateField("userType", "gov");
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  border: `2px solid ${commonStyles.green}`,
                  backgroundColor: formData.userType === "gov" ? commonStyles.green : "white",
                  color: formData.userType === "gov" ? "white" : commonStyles.blue,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                🏛️ Servidor Público
              </button>
              <button
                onClick={() => {
                  if (formData.userType === "student") {
                    updateField("userType", "");
                    updateField("verificationDoc", null);
                    updateField("docPreview", null);
                  } else {
                    updateField("userType", "student");
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  border: `2px solid ${commonStyles.green}`,
                  backgroundColor: formData.userType === "student" ? commonStyles.green : "white",
                  color: formData.userType === "student" ? "white" : commonStyles.blue,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                🎓 Estudiante
              </button>
            </div>
          </div>

          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e0e0e0" }}>
            <div style={labelStyle}>
              Documento de verificación *
              <span style={{ fontSize: "11px", opacity: 0.7, marginLeft: "4px" }}>
                ({formData.userType === "student" ? "Carnet estudiantil" : "Carnet oficial o ID"})
              </span>
            </div>

            <FileUpload
              file={formData.verificationDoc}
              preview={formData.docPreview}
              onFileSelect={(file, preview) => {
                updateField("verificationDoc", file);
                updateField("docPreview", preview);
              }}
              onFileRemove={() => {
                updateField("verificationDoc", null);
                updateField("docPreview", null);
              }}
            />

            <p style={{ fontSize: "11px", color: commonStyles.blue, opacity: 0.6, marginTop: "6px" }}>
              Tu documento será revisado para verificar tu identidad. Los descuentos se aplicarán una vez verificada tu cuenta.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default UserTypeSection;