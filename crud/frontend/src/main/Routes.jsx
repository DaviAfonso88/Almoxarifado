import { Routes, Route } from "react-router-dom";
import { Home } from "../components/home/Home";
import ProductCrud from "../components/product/ProductCrud";
import CategoriesCrud from "../components/categories/CategoriesCrud";
import Dashboards from "../components/dashboard/Dashboard";

const RoutesLinks = (props) => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="products" element={<ProductCrud />} />
    <Route path="/categories" element={<CategoriesCrud />} />
    <Route path="*" element={<Home />} />
    <Route path="/dashboards" element={<Dashboards />} />
  </Routes>
);

export { RoutesLinks };
