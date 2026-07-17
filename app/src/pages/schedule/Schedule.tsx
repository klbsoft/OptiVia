import { ListGroup } from "react-bootstrap";

export default function Schedule() {
  // Solo horarios principales - menos cantidad
  const departureTimes = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  
  const getArrivalTime = (departure: string) => {
    const [hour, minute] = departure.split(':').map(Number);
    let arrivalMinute = minute + 25;
    let arrivalHour = hour;
    if (arrivalMinute >= 60) {
      arrivalMinute -= 60;
      arrivalHour += 1;
    }
    return `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
  };

  // Simular algunos retrasos aleatorios para el demo
  const isDelayed = (time: string) => {
    // Solo para demostración - algunos horarios aparecen con retraso
    return time === "08:00" || time === "14:00" || time === "18:00";
  };

  return (
    <div style={{ padding: "16px" }}>
      <h5 style={{ color: "#0162BF", marginBottom: "16px", fontSize: "16px" }}>
        San Isidro → La Mella
      </h5>
      
      <ListGroup style={{ borderRadius: "12px", overflow: "hidden" }}>
        {departureTimes.map((time, index) => {
          const delayed = isDelayed(time);
          return (
            <ListGroup.Item 
              key={index}
              className="d-flex align-items-center"
              style={{ 
                borderLeft: "none", 
                borderRight: "none",
                borderTop: index === 0 ? "none" : "1px solid #EEE",
                borderBottom: index === departureTimes.length - 1 ? "none" : "1px solid #EEE",
                backgroundColor: "#FFFFFF",
                padding: "12px 16px"
              }}
            >
              {/* Barra indicadora */}
              <div style={{ 
                width: "4px", 
                height: "30px", 
                backgroundColor: delayed ? "#FF6B8A" : "#6CC24A",
                borderRadius: "4px",
                marginRight: "12px"
              }} />
              
              {/* Hora de salida */}
              <div style={{ width: "70px" }}>
                <span style={{ 
                  color: delayed ? "#FF6B8A" : "#0162BF",
                  fontWeight: 600,
                  fontSize: "16px"
                }}>
                  {time}
                </span>
                {delayed && (
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#FF6B8A", 
                    marginLeft: "4px" 
                  }}>
                    +5
                  </span>
                )}
              </div>
              
              {/* Flecha */}
              <span style={{ color: "#CCC", margin: "0 12px" }}>→</span>
              
              {/* Hora de llegada */}
              <div style={{ flex: 1 }}>
                <span style={{ 
                  color: delayed ? "#FF6B8A" : "#0162BF",
                  fontSize: "16px"
                }}>
                  {getArrivalTime(time)}
                </span>
                <span style={{ 
                  color: "#999", 
                  fontSize: "14px", 
                  marginLeft: "8px" 
                }}>
                  llegada
                </span>
              </div>            
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}