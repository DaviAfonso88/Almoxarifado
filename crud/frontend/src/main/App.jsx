import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";

import { RoutesLinks } from "./Routes";
import { Footer } from "../components/template/Footer";
import { Nav } from "../components/template/Nav";
import { Logo } from "../components/template/Logo";
import { Login } from "../components/home/Login";

const App = () => {
  const [Authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") setAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuthenticated(false);
  };

  return (
    <BrowserRouter>
      {Authenticated ? (
        <div className="app">
          <Logo />
          <Nav
            iconHome="home"
            iconProducts="tags"
            iconCategories="th-list"
            iconDashboards="bar-chart"
          />

          <div className="logout-btn">
            <button
              onClick={handleLogout}
              className="btn btn-danger position-absolute top-0 end-0 m-3"
            >
              Sair
            </button>
          </div>

          <RoutesLinks />
          <Footer />
        </div>
      ) : (
        <Login onLogin={setAuthenticated} />
      )}
    </BrowserRouter>
  );
};

export { App };
