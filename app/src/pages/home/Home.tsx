import { Card, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useView } from "../../context/ViewContext";
import Searcher from "../searcher/Searcher"
import "../../animation.css"
// import Report from "../report/Report";
// import Settings from "../settings/Settings";
// import SignUp from "../singup/Singup";
// import Map from "../map/Map";

// import History from "../history/History";
// import Profile from "../profile/Profile";
// import Map from "../map/Map";
// import Menu from "../../components/menu/menu";
// import Cards from "../cards/Cards";


export default function Home() {
  const textArray = [
    "El transporte que necesitas al alcance de tu mano.",
    "Viaja con aire, viaja cómodo, viaja con la omza.",
    "Con múltiples funciones para hacerte la vida fácil."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const {setCurrentView} = useView();  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % textArray.length);
    }, 5000);
    setCurrentView(<Home/>);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      <div 
       className="page-transition"
      style={{ 
        padding: "16px",
        overflowY: "auto",        // ADDED
        flex: 1                   // ADDED  
      }}>
        
        <p style={{ marginTop: "16px", color: "#0162BF", display: "flex", alignItems: "center" }}>
          Viaja seguro cómodo y rápido.
        </p>
        
        <div style={{ position: "relative", width: "100%" }}>
          <Form.Control 
            type="search" 
            placeholder="Buscar ruta" 
            style={{ 
              borderRadius: "20px",
              padding: "10px 16px 10px 50px",
              border: "2px solid #6CC24A",
              backgroundColor: "#FFFFFF",
              color: "#0162BF",
              width: "100%"
            }}
            onClick={()=>setCurrentView(<Searcher/>)}
          />
          <Image 
            src="/opti-via/img/groadmap.png" 
            alt="Rutas"
            height="24"
            width="24"
            style={{ 
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)"
            }} 
          />
        </div>

        <p style={{ marginTop: "16px", color: "#0162BF", textAlign: "center" }}>
          {textArray[currentIndex]}
        </p>

        <Card style={{ marginTop: "16px", borderRadius: "12px", overflow: "hidden" }}>
          <Card.Img 
            variant="top" 
            src={`/opti-via/img/carrusel/${currentIndex + 1}.png`}
            style={{ 
                height: "340px",
                width: "340px",
                objectFit: "cover" ,
                borderRadius:"5%"
            }}
          />
        </Card>
      </div>
    </>
  );
}