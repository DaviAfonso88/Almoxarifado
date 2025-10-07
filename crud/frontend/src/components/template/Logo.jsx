import "./Logo.css";
import logo from "../../assets/imgs/logo.png";
import { NavLink } from "react-router-dom";

const Logo = (props) => (
  <aside className="logo">
    <NavLink to="/" className="logo">
      <img src={logo} alt="logo" />
    </NavLink>
  </aside>
);

export { Logo };
