import { ListGroup } from "react-bootstrap";

export default function Alerts() {
  const notifications = [
    {
      id: 1,
      title: "Tu ruta está por llegar",
      message: "El autobús de San Isidro llegará en 5 minutos",
      time: "Ahora",
      read: false,
      color: "#6CC24A"
    },
    {
      id: 2,
      title: "Retraso en la ruta",
      message: "Tráfico pesado en Carretera Mella. +10 min de retraso",
      time: "Hace 15 min",
      read: false,
      color: "#FF6B8A"
    },
    {
      id: 3,
      title: "Pago confirmado",
      message: "Tu recarga de RD$100 fue exitosa",
      time: "Hace 2 horas",
      read: true,
      color: "#0367C7"
    },
    {
      id: 4,
      title: "Promoción especial",
      message: "Viajes a RD$15 este fin de semana",
      time: "Ayer",
      read: true,
      color: "#FFD200"
    },
    {
      id: 5,
      title: "Nueva parada cercana",
      message: "Se agregó una parada en la Av. San Vicente",
      time: "Ayer",
      read: true,
      color: "#6CC24A"
    },
    {
      id: 6,
      title: "Recordatorio",
      message: "Tu viaje programado para mañana 8:00 AM",
      time: "Ayer",
      read: true,
      color: "#0162BF"
    }
  ];

  return (
    <div style={{ 
      padding: "16px",
      backgroundColor: "#F8F9FA",
      height: "100%",
      overflowY: "auto"
        }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 style={{ color: "#0162BF", margin: 0, fontSize: "18px" }}>
          Notificaciones
        </h5>
        <span style={{ color: "#6CC24A", fontSize: "14px", cursor: "pointer" }}>
          Marcar todas como leídas
        </span>
      </div>

      <ListGroup style={{ borderRadius: "14px", overflow: "hidden" }}>
        {notifications.map((notif) => (
          <ListGroup.Item 
            key={notif.id}
            className="d-flex align-items-start"
            style={{ 
              borderLeft: "none", 
              borderRight: "none",
              borderTop: "none",
              borderBottom: "1px solid #EEE",
              backgroundColor: notif.read ? "#FFFFFF" : "#F0F7FF",
              padding: "14px 12px",
              cursor: "pointer"
            }}
          >
            <div style={{ 
              width: "4px", 
              height: "40px", 
              backgroundColor: notif.color,
              borderRadius: "4px",
              marginRight: "12px"
            }} />
            
            <div style={{ flex: 1 }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ 
                  color: "#0162BF", 
                  fontWeight: notif.read ? 400 : 600,
                  fontSize: "14px"
                }}>
                 {notif.title + "\t\t"} 
                </span>
                <span style={{ color: "#999", fontSize: "14px" }}>
                     
                  {  notif.time  }
                </span>
              </div>
              <p style={{ 
                color: "#666", 
                fontSize: "14px", 
                margin: 0 
              }}>
                {notif.message}
              </p>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}