 import { Button,Image} from "react-bootstrap";
 import { useView } from "../../context/ViewContext";
 import Searcher  from "../../pages/searcher/Searcher";
 import Map from "../../pages/map/Map"
 import {commonStyles} from "../theme/default";
 import { useFooter } from "../../context/FooterContext";
 import "../../animation.css"
function Footer(){
  const {setCurrentView} = useView();
  const { isEnabled,leftBorder,rightBorder,setLeftView,setRightView} = useFooter();

 
 
  return (
    <div 
     className="page-transition"
    style={{ 
      display: isEnabled?"flex":"none",
      flexShrink: 0,
      width: "100%",
      maxWidth: "480px",
      alignSelf: "center"
      // position: "fixed", 
      // bottom: 0, 
      // left: 0, 
      // right: 0, 
      // maxWidth: "480px",
      // margin: "0 auto",
      // display: "flex"
    }}>
      <Button 
        style={{ 
          backgroundColor: commonStyles.blue, 
          border: "none",
          borderRadius: 0,
          flex: 1,
          color: "white",
          padding: "16px 0",
          fontSize: commonStyles.button_fontSize,
          fontWeight: commonStyles.button_fontWeight,
          borderTop: `${leftBorder}`
        }}
        onClick={()=>{
          setCurrentView(<Searcher/>); 
          setLeftView();
        }}
      >
        Rutas
        <Image src= "/opti-via/img/wroadmap.png" 
          alt="Rutas"
          height="34"
          width="34"
          style={{marginLeft:"10px"}} 
        />
      </Button>
      <Button 
        style={{ 
          backgroundColor: commonStyles.green, 
          border: "none",
          borderRadius: 0,
          flex: 1,
          color: "white",
          padding: "10px 0",
          fontSize: commonStyles.button_fontSize,
          fontWeight: commonStyles.button_fontWeight,
          borderTop: `${rightBorder}`,
        }}
        onClick={()=>{
          setCurrentView(<Map/>);
          setRightView(); 
        }}
      >
        Mapa
        <Image src="/opti-via/img/wmap.png" 
          alt="Mapa" 
          height="34" 
          width="34"
          style={{marginLeft:"10px"}} 
        />
      </Button>
    </div>
  );
}

export default Footer;

/*
 <Row>
        <Col xs={6} className="pe-1">
          <Button 
            style={{ 
              backgroundColor: "#0367C7", 
              border: "none",
              width: "100%"
            }}
          >
            <Image src="../../../public/img/wroadmap.png" alt="Rutas" height="20" width="20" />
            Rutas
          </Button>
        </Col>
        <Col xs={6} className="ps-1">
          <Button 
            style={{ 
              backgroundColor: "#6CC24A", 
              border: "none",
              width: "100%"
            }}
          >
            <Image src="../../../public/img/wmap.png" alt="Mapa" height="20" width="20" />
            Mapa
          </Button>
        </Col>
      </Row>

*/