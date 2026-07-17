import { AuthProvider } from "../../context/AuthContext";
// import SignUp from "../../pages/singup/Singup";
import Body from "../body/Body";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { useAuth } from "../../context/AuthContext";
// import Home from "../../pages/home/Home";
import Auth from "../../pages/auth/Auth";

function Box() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

function Container() {
  return (
    <AuthProvider>
      <Box />
    </AuthProvider>
  );
}

export default Container;