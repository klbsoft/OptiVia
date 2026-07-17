  import { Image } from "react-bootstrap";
  import { useState } from "react";
  import { useView } from "../../context/ViewContext";
  import Alerts from "../../pages/alerts/Alerts"  
  // import Home from "../../pages/home/Home";
import { commonStyles } from "../theme/default";
import Menu from "../menu/Menu";
    function Header() {
    const [notification,setNotification] = useState(true);
    const {setCurrentView} = useView();
    return (
      <>
         <div style={{ 
   maxWidth: "480px",
  width: "100%",
  flexShrink: 0,
  backgroundColor: commonStyles.blue,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "50px",
  padding: "0 10px",
  boxSizing: "border-box"
    }}>

         <Image
            src={`/opti-via/img/${notification==false?"wmenu.png":"wmenu.png"}`} 
 
            // src={`/img/${notification==false?"wbell.png":"wbell_active.png"}`} 
            alt="Notifications" 
            style={{ 
              // default
              height: "38px",
              width: "38px",

              /*
              // condition based 
              height: "30px",
              width: "30px",
              cursor: "pointer",
              padding:"2px",
              border: "1px solid white"  
              */
              padding:"1px",

              border: "1px solid white"  

              
              // position: "absolute",
              // top: "40%",
              // right: "2px",
              // transform: "translateY(-50%)",
              // height: "38px",
              // width: "38px",            
              // borderRad  ius: "25%",
              // backgroundColor: "black"
            }}
            onClick={() => { setCurrentView(<Menu />) }}
            // onDoubleClick={()=>{setNotification(notification?false:true)}}
          />
          
      <Image
        src={`/opti-via/img/${notification ? "wbell_active.png" : "wbell.png"}`}
        alt="Notifications"
        style={{ 
          height: "32px",
          width: "32px",
          cursor: "pointer"
        }}
        onClick={() => { setCurrentView(<Alerts />) }}
        onDoubleClick={() => { setNotification(!notification) }}
      />
      </div>  
      </>
    );
  }
  
  export default Header;
