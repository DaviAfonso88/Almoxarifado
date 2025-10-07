import { useEffect, useState } from "react";
import api from "../service/api";
import { Main } from "../template/Main";

const headerProps = {
  icon: "th-list",
  title: "Categorias",
  subtitle: "Gerenciar categorias: Adicionar e Excluir",
};

export default function CategoriesCrud() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    api.get("/categories").then((resp) => setCategories(resp.data));
  }, []);

  async function addCategory() {
    if (!newCategory.trim()) return;
    try {
      const { data } = await api.post("/categories", { name: newCategory });
      setCategories((prev) => [...prev, data]);
      setNewCategory("");
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao criar categoria");
    }
  }

  async function removeCategory(id) {
    if (!window.confirm("Deseja realmente excluir esta categoria?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Main {...headerProps}>
      {/* Card de nova categoria */}
      <div className="card shadow-sm mb-4 rounded-3">
        <div
          className="card-header text-white fw-semibold"
          style={{ backgroundColor: "#00879d" }}
        >
          Nova Categoria
        </div>
        <div className="card-body">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Digite o nome da categoria..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className="btn btn-success" onClick={addCategory}>
              <i className="fa fa-plus me-1"></i> Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Card de categorias existentes */}
      <div className="card shadow-sm rounded-3">
        <div
          className="card-header d-flex justify-content-between align-items-center text-white fw-semibold"
          style={{ backgroundColor: "#00879d" }}
        >
          <span>Categorias Existentes</span>
          <span className="badge bg-light text-primary">
            {categories.length}
          </span>
        </div>
        <ul className="list-group list-group-flush">
          {categories.length === 0 && (
            <li className="list-group-item text-muted fst-italic">
              Nenhuma categoria cadastrada.
            </li>
          )}
          {categories.map((c) => (
            <li
              key={c.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span className="fw-medium">{c.name}</span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeCategory(c.id)}
              >
                <i className="fa fa-trash me-1"></i> Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Main>
  );
}
