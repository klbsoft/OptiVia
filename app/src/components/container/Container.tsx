import { AuthProvider } from "../../context/AuthContext";
// import SignUp from "../../pages/singup/Singup";
import Body from "../body/Body";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { useAuth } from "../../context/AuthContext";
// import Home from "../../pages/home/Home";
import Auth from "../../pages/auth/Auth";
// import { useState } from "react";
import { FooterProvider } from "../../context/FooterContext";
// import SignUp from "../../pages/singup/Singup";
// import Login from "../../pages/login/Login";
import { UserSessionProvider } from "../../context/UserSessionContext";
import "../../animation.css"
function Box() {
  const { isAuthenticated } = useAuth();
 
  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div 
      className="page-transition"
      style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,          
      minHeight: 0, 
      // border:'5px solid black',
      margin:'0px',
      padding:"0px",
    }}>
      <FooterProvider>
        <Header />
        <Body />
        <Footer />
      </FooterProvider>
    </div>
  );
}

function Container() {
  
  return (
    <AuthProvider>
      <UserSessionProvider>        
        <Box />
    </UserSessionProvider>
    </AuthProvider>
  );
}

export default Container;