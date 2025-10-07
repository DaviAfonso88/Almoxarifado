import { useEffect, useState, useMemo } from "react";
import api from "../service/api";
import { Main } from "../template/Main";
import "../template/Modal.css";
import "../../main/App.css";

const headerProps = {
  icon: "tags",
  title: "Almoxarifado PIBLS",
  subtitle: "Cadastro de produtos: Incluir, Listar, Alterar e Excluir",
};

const initialProduct = {
  name: "",
  quantity: "",
  category: "",
  unit: "",
  minStock: "",
};

const units = ["Unidade", "Caixa", "Pacote", "Litro", "Kilo"];

export default function ProductCrud() {
  const [product, setProduct] = useState(initialProduct);
  const [list, setList] = useState([]);
  const [errors, setErrors] = useState(initialProduct);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products").then((resp) => {
      const products = resp.data.map((p) => ({
        ...p,
        minStock: p.minstock,
      }));
      setList(products);
    });

    api.get("/categories").then((resp) => setCategories(resp.data));
  }, []);

  function load(product) {
    setProduct(product);
  }

  function clear() {
    setProduct(initialProduct);
  }

  function confirmRemove(product) {
    setShowConfirm(true);
    setProductToDelete(product);
  }

  function updateField(e) {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = { ...initialProduct };

    if (!product.name.trim()) newErrors.name = "O nome é obrigatório";
    if (!product.category.trim())
      newErrors.category = "A categoria é obrigatória";
    if (!product.unit.trim()) newErrors.unit = "A unidade é obrigatória";

    if (product.quantity === "" || product.quantity === null)
      newErrors.quantity = "A quantidade é obrigatória";
    else if (isNaN(product.quantity) || product.quantity <= 0)
      newErrors.quantity = "A quantidade deve ser >= 0";

    if (product.minStock === "" || product.minStock === null)
      newErrors.minStock = "O estoque mínimo é obrigatório";
    else if (isNaN(product.minStock) || product.minStock < 0)
      newErrors.minStock = "O estoque mínimo deve ser >= 0";

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  }

  async function save() {
    if (!validate()) return;

    try {
      if (product.id) {
        const { data } = await api.put(`/products/${product.id}`, product);
        setList((resp) => [data, ...resp.filter((p) => p.id !== product.id)]);
      } else {
        const { data } = await api.post("/products", product);
        setList((resp) => [data, ...resp]);
      }
      clear();
    } catch (err) {
      console.error("Erro:", err);
    }
  }

  async function removeConfirmed() {
    try {
      await api.delete(`/products/${productToDelete.id}`);
      setList((resp) => resp.filter((p) => p.id !== productToDelete.id));
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setShowConfirm(false);
      setProductToDelete(null);
    }
  }

  const filteredList = useMemo(() => {
    const q = String(search || "")
      .trim()
      .toLowerCase();
    return list.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const qty = String(p.quantity ?? "");
      const category = String(p.category || "").toLowerCase();
      const uni = String(p.unit || "").toLowerCase();
      return (
        name.includes(q) ||
        qty.includes(q) ||
        category.includes(q) ||
        uni.includes(q)
      );
    });
  }, [list, search]);

  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = String(text).split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} style={{ fontWeight: "600", color: "#32dac3" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  function renderForm() {
    return (
      <div
        className="card p-4 mb-4 shadow-sm"
        style={{ borderRadius: "12px", background: "#fff" }}
      >
        <h5
          className="mb-4"
          style={{
            fontWeight: "600",
            background: "linear-gradient(90deg, #07a7e3, #32dac3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Cadastro de Produto
        </h5>
        <div className="row g-3">
          {/* Nome */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Nome</label>
            <input
              type="text"
              className={`form-control form-control-lg ${
                errors.name ? "is-invalid" : ""
              }`}
              name="name"
              value={product.name}
              onChange={updateField}
              placeholder="Digite o nome do produto..."
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          {/* Quantidade */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Quantidade</label>
            <input
              type="number"
              className={`form-control form-control-lg ${
                errors.quantity ? "is-invalid" : ""
              }`}
              name="quantity"
              value={product.quantity}
              onChange={updateField}
              placeholder="Digite a quantidade..."
            />
            {errors.quantity && (
              <div className="invalid-feedback">{errors.quantity}</div>
            )}
          </div>

          {/* Categoria */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Categoria</label>
            <select
              className={`form-control form-control-lg ${
                errors.category ? "is-invalid" : ""
              }`}
              name="category"
              value={product.category}
              onChange={updateField}
            >
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category}</div>
            )}
          </div>

          {/* Unidade */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Unidade</label>
            <select
              className={`form-control form-control-lg ${
                errors.unit ? "is-invalid" : ""
              }`}
              name="unit"
              value={product.unit}
              onChange={updateField}
            >
              <option value="">Selecione...</option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {errors.unit && (
              <div className="invalid-feedback">{errors.unit}</div>
            )}
          </div>

          {/* Estoque mínimo */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Estoque mínimo</label>
            <input
              type="number"
              className={`form-control form-control-lg ${
                errors.minStock ? "is-invalid" : ""
              }`}
              name="minStock"
              value={product.minStock}
              onChange={updateField}
              placeholder="Digite o estoque mínimo..."
            />
            {errors.minStock && (
              <div className="invalid-feedback">{errors.minStock}</div>
            )}
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-end gap-2">
          <button className="btn btn-primary btn-lg" onClick={save}>
            Salvar
          </button>
          <button className="btn btn-outline-secondary btn-lg" onClick={clear}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  function renderTable() {
    return (
      <>
        {/* Pesquisa */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control shadow-sm rounded-pill"
            placeholder="Pesquisar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "0.75rem 1.5rem" }}
          />
        </div>

        {/* Tabela */}
        <div className="table-responsive shadow rounded">
          <table className="table align-middle table-hover mb-0">
            <thead
              style={{
                backgroundColor: "#3c8a7f",
                color: "#fff",
                textTransform: "uppercase",
                fontSize: "0.85rem",
              }}
            >
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Unidade</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Estoque mínimo</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((p, index) => (
                <tr
                  key={p.id}
                  className={index % 2 === 0 ? "bg-light" : "bg-white"}
                  style={{ transition: "all 0.2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e6f7f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#f8f9fa" : "#fff")
                  }
                >
                  <td>{p.id}</td>
                  <td>{highlightText(p.name, search)}</td>
                  <td>{highlightText(p.unit, search)}</td>
                  <td>{highlightText(p.category, search)}</td>
                  <td
                    style={{
                      color: p.quantity <= p.minStock ? "#dc3545" : "#212529",
                      fontWeight: p.quantity <= p.minStock ? "600" : "400",
                    }}
                  >
                    {highlightText(p.quantity, search)}
                  </td>
                  <td>{highlightText(p.minStock, search)}</td>
                  <td className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-sm btn-info shadow-sm"
                      onClick={() => load(p)}
                      title="Editar"
                    >
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger shadow-sm"
                      onClick={() => confirmRemove(p)}
                      title="Excluir"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function ConfirmModal() {
    if (!showConfirm) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <h5>Confirmação</h5>
          <p>Deseja realmente excluir o produto "{productToDelete.name}"?</p>
          <div className="modal-actions">
            <button className="btn btn-danger" onClick={removeConfirmed}>
              Excluir
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirm(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Main {...headerProps}>
      {renderForm()}
      {renderTable()}
      <ConfirmModal />
    </Main>
  );
}
