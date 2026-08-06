import { useView } from "../../context/ViewContext";
import { commonStyles } from "../theme/default";
import Profile from "../../pages/profile/Profile";
import Cards from "../../pages/cards/Cards";
import History from "../../pages/history/History";
// import Report from "../../pages/report/Report";
import Settings from "../../pages/settings/Settings";
import { useAuth } from "../../context/AuthContext";
import "../../animation.css"

function Menu({ onSelected }: { onSelected: () => void }) {

  const { setCurrentView } = useView();
  const {logout} = useAuth(); 
  
  const menuItems = [
    { label: "Mi Perfil", view: <Profile /> },
    { label: "Mis Tarjetas", view: <Cards /> },
    { label: "Historial", view: <History /> },
    // { label: "Reportar", view: <Report /> },
    { label: "Configuración", view: <Settings /> },
    { label: "Cerrar Sesión", view: null }
  ];

  return (
    <div 
     className="page-transition"
      style={{ 
      maxWidth: "480px",
      width: "100%",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      height: "99%",
      boxSizing: "border-box",
      backgroundColor:commonStyles.blue,
      paddingTop:"5px",
    }}>
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
              if (item.view) {
                setCurrentView(item.view);
              } else {
                // console.log("not valid");
                logout(); // your specific function
                window.location.reload();
              }
              //  console.log("hit");    
              onSelected(); 
            }}
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontSize: commonStyles.button_fontSize,
            fontWeight: commonStyles.button_fontWeight,
            color: "white",
            // paddingTop:
            padding: "20px",
            // borderBottom: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer",
            backgroundColor: commonStyles.blue,
            border:"1px solid white",
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default Menu;