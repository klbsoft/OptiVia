import Container from "./components/container/Container";
import { ViewProvider } from "./context/ViewContext";

export default function App() {
  return (
    <div style={{ 
      maxWidth: "480px",
      width: "100%",
      margin: "0 auto",
      height: "100dvh",//"100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      boxShadow: "0 0 20px rgba(0,0,0,0.05)",
      overflow: "hidden",
      // border:"solid black",
      
      // maxWidth: "480px",
      // width: "100%",
      // margin: "0 auto",
      // minHeight: "100vh",
      // position: "relative",
      // backgroundColor: "#FFFFFF",
      // boxShadow: "0 0 20px rgba(0,0,0,0.05)",
      // border:"solid black"
    }}>
      <ViewProvider>
        <Container />
      </ViewProvider>
    </div>
  );
}