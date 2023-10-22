import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("authTokenSportsCenter");
    localStorage.removeItem("userDataSportsCenter");
  }, []);

  return <Navigate to="/home" />;
};

export default Logout;
