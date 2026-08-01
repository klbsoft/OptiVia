import { commonStyles } from "../../components/theme/default";

interface FileUploadProps {
  file: File | null;
  preview: string | null;
  onFileSelect: (file: File, preview: string) => void;
  onFileRemove: () => void;
}

function FileUpload({ file, preview, onFileSelect, onFileRemove }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(selectedFile, reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  if (!file) {
    return (
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "16px",
          borderRadius: "12px",
          border: `2px dashed ${commonStyles.green}`,
          backgroundColor: "white",
          cursor: "pointer",
          color: commonStyles.blue,
          fontSize: "14px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f0f7ff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; }}
      >
        <span style={{ fontSize: "24px" }}>📷</span>
        <span>Subir documento</span>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      </label>
    );
  }

  return (
    <div style={{ borderRadius: "12px", border: `2px solid ${commonStyles.green}`, overflow: "hidden" }}>
      {preview && (
        <img
          src={preview}
          alt="Document preview"
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "#f8f9fa" }}>
        <span style={{ fontSize: "12px", color: commonStyles.blue, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {file.name}
        </span>
        <button onClick={onFileRemove} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", fontSize: "20px", padding: "0 4px" }}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default FileUpload;