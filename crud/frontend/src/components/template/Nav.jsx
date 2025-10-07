import "./Nav.css";
import { NavLink } from "react-router-dom";

const Nav = (props) => (
  <aside className="menu-area">
    <nav className="menu">
      <NavLink to="/" className="nav-link">
        <i className={`fa fa-${props.iconHome}`}></i> Início
      </NavLink>
      <NavLink to="/products" className="nav-link">
        <i className={`fa fa-${props.iconProducts}`}></i> Produtos
      </NavLink>
      <NavLink to="/categories" className="nav-link">
        <i className={`fa fa-${props.iconCategories}`}></i> Categorias
      </NavLink>
      <NavLink to="/dashboards" className="nav-link">
        <i className={`fa fa-${props.iconDashboards}`}></i> Relatórios
      </NavLink>
    </nav>
  </aside>
);

export { Nav };
