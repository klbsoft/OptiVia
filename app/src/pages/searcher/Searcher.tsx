import {  Image, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useView } from "../../context/ViewContext";
import Map from "../map/Map"
import { useFooter } from "../../context/FooterContext";
import "../../animation.css"
export default function Searcher() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [showOrigen, setShowOrigen] = useState(false);
  const [showDestino, setShowDestino] = useState(false);
  const { setCurrentView } = useView();
  const {setRightView,setLeftView} = useFooter();

  const lugares = ["Autopista de San Isidro", "Carretera Mella"];

  const handleBuscar = () => {
    //alert(`${showDestino} ${showOrigen}`);
     if (!showDestino && !showOrigen){
        setRightView();
        setCurrentView(<Map/>)
     }
  };
useEffect(() => {
  setLeftView();
}, []);
  return (
    <>
      <div style={{ padding: "16px",paddingTop:"16px" }}>
        
        <p style={{ marginTop: "16px", color: "#0162BF" }}>
          Solo necesitamos un poquito más de información.
        </p>
        
        {/* Origen */}
        <div style={{ position: "relative", width: "100%", marginBottom: "16px" }}>
          <div 
            onClick={() => {
              setShowOrigen(!showOrigen);

            }}
            style={{ 
              borderRadius: "20px",
              padding: "12px 16px 12px 50px",
              border: "2px solid #6CC24A",
              backgroundColor: "#FFFFFF",
              color: origen ? "#0162BF" : "#999",
              width: "80%",
              cursor: "pointer",
              position: "relative"
            }}
          >
            {origen || "Lugar de partida"}
            <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#6CC24A" }}>▼</span>
          </div>
          
          {showOrigen && (
            <div style={{ 
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
              overflowY: "auto"
            }}>
              {lugares.map((lugar) => (
                <div 
                  key={lugar}
                  onClick={() => { setOrigen(lugar); setShowOrigen(false); }}
                  style={{ 
                    padding: "12px 16px", 
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                    color: "#0162BF"
                  }}
                >
                  {lugar}
                </div>
              ))}
            </div>
          )}
          
          <Image 
            src="/opti-via/img/groadmap.png" 
            alt="Rutas"
            height="24"
            width="24"
            style={{ 
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none"
            }} 
          />
        </div>

        {/* Destino */}
        <div style={{ position: "relative", width: "100%", marginBottom: "16px" }}>
          <div 
            onClick={() => setShowDestino(!showDestino)}
            style={{ 
              borderRadius: "20px",
              padding: "12px 16px 12px 50px",
              border: "2px solid #6CC24A",
              backgroundColor: "#FFFFFF",
              color: destino ? "#0162BF" : "#999",
              width: "80%",
              cursor: "pointer",
              position: "relative"
            }}
          >
            {destino || "Lugar de llegada"}
            <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#6CC24A" }}>▼</span>
          </div>
          
          {showDestino && (
            <div style={{ 
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
              overflowY: "auto"
            }}>
              {lugares.map((lugar) => (
                <div 
                  key={lugar}
                  onClick={() => { setDestino(lugar); setShowDestino(false); }}
                  style={{ 
                    padding: "12px 16px", 
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                    color: "#0162BF"
                  }}
                >
                  {lugar}
                </div>
              ))}
            </div>
          )}
          
          <Image 
            src="/opti-via/img/groadmap.png" 
            alt="Rutas"
            height="24"
            width="24"
            style={{ 
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none"
            }} 
          />
        </div>

        <Button 
          style={{ 
            backgroundColor: "#0367C7", 
            border: "none",
            width: "100%",
            borderRadius: "20px",
            padding: "12px",
            color: "white",
            marginTop: "16px"
          }}
          onClick={handleBuscar}
          disabled={!origen || !destino}
        >
          Buscar ruta
        </Button>
      </div>
    </>
  );
}