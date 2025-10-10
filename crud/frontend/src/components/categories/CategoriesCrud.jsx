import { useEffect, useState } from "react";
import api from "../service/api";
import { Main } from "../template/Main";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash, FaList } from "react-icons/fa";

const headerProps = {
  icon: "th-list",
  title: "Categorias",
  subtitle: "Gerencie, adicione e exclua categorias",
};

export default function CategoriesCrud() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((resp) => setCategories(resp.data))
      .catch(() => toast.error("Erro ao carregar categorias"))
      .finally(() => setLoading(false));
  }, []);

  async function addCategory() {
    if (!newCategory.trim()) {
      toast.warning("Digite o nome da categoria antes de adicionar");
      return;
    }
    try {
      const { data } = await api.post("/categories", { name: newCategory });
      setCategories((prev) => [...prev, data]);
      setNewCategory("");
      toast.success("Categoria adicionada com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar categoria");
    }
  }

  async function removeCategory(id) {
    if (!window.confirm("Deseja realmente excluir esta categoria?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.info("Categoria excluída com sucesso!");
    } catch (err) {
      toast.error("Erro ao excluir categoria");
    }
  }

  return (
    <Main {...headerProps}>
      <ToastContainer theme="light" position="top-center" />

      {/* Card de nova categoria */}
      <motion.div
        className="card shadow-sm mb-4 border-0 rounded-4 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="card-header fw-semibold d-flex align-items-center gap-2 text-white"
          style={{ fontSize: "1rem", backgroundColor: "#2a5d6e" }}
        >
          <FaPlus /> Nova Categoria
        </div>
        <div className="card-body">
          <div className="input-group">
            <input
              type="text"
              className="form-control bg-white text-dark"
              placeholder="Digite o nome da categoria..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn btn-success rounded-end"
              onClick={addCategory}
            >
              <FaPlus className="me-1" /> Adicionar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Card de categorias existentes */}
      <motion.div
        className="card shadow-sm border-0 rounded-4 bg-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="card-header d-flex justify-content-between align-items-center fw-semibold text-white"
          style={{ fontSize: "1rem", backgroundColor: "#2a5d6e" }}
        >
          <span className="d-flex align-items-center gap-2">
            <FaList /> Categorias Existentes
          </span>
          <span className="badge bg-light text-primary">
            {categories.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-info" role="status"></div>
            <p className="mt-2 text-muted">Carregando categorias...</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {categories.length === 0 && (
              <li className="list-group-item fst-italic text-muted">
                Nenhuma categoria cadastrada.
              </li>
            )}
            {categories.map((c) => (
              <motion.li
                key={c.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                whileHover={{ scale: 1.02 }}
              >
                <span className="fw-medium">{c.name}</span>
                <button
                  className="btn btn-sm btn-outline-danger rounded-pill"
                  onClick={() => removeCategory(c.id)}
                >
                  <FaTrash className="me-1" /> Excluir
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </Main>
  );
}
