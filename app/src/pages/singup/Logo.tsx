import { commonStyles } from "../../components/theme/default";

function Logo() {
  return (
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
  );
}

export default Logo;