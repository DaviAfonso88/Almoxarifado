import { useEffect, useState } from "react";
import api from "../service/api";
import { Main } from "../template/Main";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaFileCsv,
  FaFilePdf,
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const headerProps = {
  icon: "bar-chart",
  title: "Dashboard de Produtos",
  subtitle: "Resumo, exportação e gráficos do almoxarifado",
};

export default function DashboardProducts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then((resp) => {
        setList(resp.data);
        toast.success("Dados carregados com sucesso!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      })
      .catch(() => {
        toast.error("Erro ao carregar dados!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const totalProducts = list.length;
  const lowStockProducts = list.filter((p) => p.quantity <= p.minstock);
  const lowStockCount = lowStockProducts.length;
  const lowStockPercent = totalProducts
    ? ((lowStockCount / totalProducts) * 100).toFixed(1)
    : 0;

  const chartData = {
    labels: list.map((p) => p.name),
    datasets: [
      {
        label: "Quantidade atual",
        data: list.map((p) => p.quantity),
        backgroundColor: list.map((p) =>
          p.quantity <= p.minstock
            ? "rgba(220, 53, 69, 0.8)"
            : "rgba(60, 138, 127, 0.8)"
        ),
        borderRadius: 8,
      },
      {
        label: "Estoque mínimo",
        data: list.map((p) => p.minstock),
        backgroundColor: "rgba(180, 180, 180, 0.4)",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Comparativo de Estoque",
        font: { size: 16, weight: "bold" },
      },
    },
  };

  function exportCSV() {
    try {
      const csv = [
        ["ID", "Nome", "Unidade", "Categoria", "Quantidade", "Estoque mínimo"],
        ...list.map((p) => [
          p.id,
          p.name,
          p.unit,
          p.category,
          p.quantity,
          p.minstock,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "produtos.csv");

      toast.success("Arquivo CSV exportado com sucesso!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch {
      toast.error("Erro ao exportar CSV!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  }

  function exportPDF() {
    try {
      const doc = new jsPDF();
      doc.text("Relatório de Produtos do Almoxarifado PIBLS", 14, 20);
      const tableData = list.map((p) => [
        p.id,
        p.name,
        p.unit,
        p.category,
        p.quantity,
        p.minstock,
      ]);
      autoTable(doc, {
        head: [
          [
            "ID",
            "Nome",
            "Unidade",
            "Categoria",
            "Quantidade",
            "Estoque mínimo",
          ],
        ],
        body: tableData,
        startY: 30,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [60, 138, 127] },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 4) {
            const quantity = Number(data.cell.text[0]);
            const minStock = Number(list[data.row.index].minstock);
            if (quantity <= minStock)
              data.cell.styles.textColor = [211, 40, 40];
          }
        },
      });
      doc.save("produtos.pdf");

      toast.success("PDF exportado com sucesso!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch {
      toast.error("Erro ao exportar PDF!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  }

  if (loading)
    return (
      <Main {...headerProps}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Carregando dados...</p>
        </div>
      </Main>
    );

  return (
    <Main {...headerProps}>
      <ToastContainer />

      {/* Cards de resumo */}
      <motion.div
        className="row g-3 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="col-12 col-md-6 col-lg-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="card shadow-sm border-0 p-3 rounded-4 bg-light"
          >
            <div className="d-flex align-items-center gap-2">
              <FaBoxOpen size={22} className="text-success" />
              <h6 className="fw-semibold mb-0">Total de Produtos</h6>
            </div>
            <p className="fs-4 mt-2 mb-0">{totalProducts}</p>
          </motion.div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="card shadow-sm border-0 p-3 rounded-4 bg-light"
          >
            <div className="d-flex align-items-center gap-2 text-danger">
              <FaExclamationTriangle size={20} />
              <h6 className="fw-semibold mb-0">Abaixo do estoque mínimo</h6>
            </div>
            <p className="fs-4 mt-2 mb-0 text-danger">
              {lowStockCount} ({lowStockPercent}%)
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Lista de produtos com estoque baixo */}
      {lowStockCount > 0 && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h6 className="fw-semibold mb-2 text-danger">
            Produtos com estoque crítico
          </h6>
          <ul className="list-group shadow-sm rounded-4">
            {lowStockProducts.map((p) => (
              <motion.li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center text-danger fw-semibold"
                whileHover={{ scale: 1.02 }}
              >
                {p.name} (Qtd: {p.quantity} / Min: {p.minstock})
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Botões de exportação */}
      <motion.div
        className="mb-4 d-flex gap-3 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          className="btn btn-success d-flex align-items-center gap-2 shadow-sm rounded-pill"
          whileHover={{ scale: 1.05 }}
          onClick={exportCSV}
        >
          <FaFileCsv /> Exportar CSV
        </motion.button>

        <motion.button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-pill"
          whileHover={{ scale: 1.05 }}
          onClick={exportPDF}
        >
          <FaFilePdf /> Exportar PDF
        </motion.button>
      </motion.div>

      {/* Gráfico */}
      <motion.div
        className="shadow p-3 rounded-4 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Bar data={chartData} options={chartOptions} />
      </motion.div>
    </Main>
  );
}
