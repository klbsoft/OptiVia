// Body.tsx
import { useView } from "../../context/ViewContext";
import Home from "../../pages/home/Home";

function Body() {
  const { currentView } = useView();

  return (
    <div style={{

      flex: 1,                    // Takes all remaining space
      minHeight: 0,               // Critical for overflow to work
      overflow: "hidden",         // "auto" if you need scrolling
      display: "flex",
      flexDirection: "column",
  
      
    //  maxWidth: "480px",
    //   margin: "0 auto",
    //   width: "100%",
    //   flex: 1,
    //   minHeight: 0,
    //   overflow: "hidden",              // Change to "auto" if you need scrolling
    //   display: "flex",
    //   flexDirection: "column",
    //   position: "relative"   
      
      
      /*
      maxWidth: "480px",
      margin: "0 auto",
      width: "100%",
      paddingTop:"10px",
      height: "90vh",
      //paddingTop:"10%",
      // paddingBottom:"10%",
      //height: "calc(100vh - 120px)",  // Subtract header + footer height
      overflow: "hidden",              // Contain the map
      display: "flex",
      flexDirection: "column"
      */
      /*
      paddingTop:"20%",
      marginTop:"20%",
      maxWidth: "480px",
      margin: "0 auto",
      width: "100%",
      overflowY: "auto",      // Scroll only if content overflows
      marginRight:"10%",
      */
      }}>
      {currentView ?? <Home />}
    </div>
  );
}

export default Body; 