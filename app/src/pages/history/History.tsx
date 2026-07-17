import { commonStyles } from "../../components/theme/default";

// Mock data — replace with actual API/state data later
const mockHistory = [
  {
    id: "trx_001",
    route_name: "La Mella → San Isidro",
    driver_name: "Carlos",
    amount: 35,
    payment_method: "Tarjeta",
    type: "viaje",
    status: "completado",
    created_at: "2026-07-08 14:30",
    start_point: "La Mella",
    end_point: "San Isidro",
  },
  {
    id: "trx_002",
    route_name: "San Isidro → La Mella",
    driver_name: "Miguel",
    amount: 35,
    payment_method: "Efectivo",
    type: "viaje",
    status: "completado",
    created_at: "2026-07-07 09:15",
    start_point: "San Isidro",
    end_point: "La Mella",
  },
 
];

function History() {
  return (
    <div style={{ padding: "20px", color: commonStyles.blue }}>
      {/* Header */}
      <h3
        style={{
          fontSize: commonStyles.button_fontSize,
          fontWeight: commonStyles.button_fontWeight,
        }}
      >
        Historial
      </h3>
      <p
        style={{
          fontSize: commonStyles.text_font_size,
          fontWeight: commonStyles.text_font_weight,
          marginBottom: "20px",
          opacity: 0.7,
        }}
      >
        Transacciones y viajes realizados
      </p>

      {/* History List */}
      {mockHistory.map((item) => (
        <div
          key={item.id}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          {/* Top Row: Route + Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              {item.route_name}
            </span>
            <span
              style={{
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "20px",
                backgroundColor:
                  item.status === "completado"
                    ? "rgba(0, 200, 100, 0.2)"
                    : "rgba(255, 80, 80, 0.2)",
                color:
                  item.status === "completado" ? "#00c864" : "#ff5050",
                fontWeight: "600",
              }}
            >
              {item.status === "completado" ? "Completado" : "Cancelado"}
            </span>
          </div>

          {/* Driver */}
          <div
            style={{
              fontSize: commonStyles.text_font_size,
              opacity: 0.7,
              marginBottom: "4px",
            }}
          >
            Conductor: {item.driver_name}
          </div>

          {/* Route Details */}
          <div
            style={{
              fontSize: commonStyles.text_font_size,
              opacity: 0.7,
              marginBottom: "8px",
            }}
          >
            {item.start_point} → {item.end_point}
          </div>

          {/* Bottom Row: Amount + Payment Method + Date */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#4fc3f7",
                }}
              >
                ${item.amount.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  marginLeft: "8px",
                  opacity: 0.5,
                }}
              >
                {item.payment_method}
              </span>
            </div>
            <span style={{ fontSize: "12px", opacity: 0.5 }}>
              {item.created_at}
            </span>
          </div>

          {/* Report Button */}
          <button
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "8px",
              backgroundColor: "rgba(255, 80, 80, 0.1)",
              color: "#ff5050",
              border: "1px solid rgba(255, 80, 80, 0.3)",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => {
              // Open fear report modal/screen for this trip
              console.log("Reportar viaje:", item.id);
            }}
          >
            ⚠ Reportar incidente
          </button>
        </div>
      ))}
    </div>
  );
}

export default History;