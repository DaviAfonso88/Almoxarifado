import { useEffect, useState } from "react";
import api from "../service/api";
import { Main } from "../template/Main";
import { Bar, Doughnut } from "react-chartjs-2";
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
  ArcElement,
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
import logo from "../../assets/imgs/logo.png";

// === Registro dos módulos ===
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// === Padronização global de estilo dos gráficos ===
ChartJS.defaults.font.family = "Inter, sans-serif";
ChartJS.defaults.font.size = 13;
ChartJS.defaults.color = "#444";
ChartJS.defaults.borderColor = "rgba(0,0,0,0.05)";
ChartJS.defaults.plugins.legend.labels.font = {
  family: "Inter, sans-serif",
  size: 13,
};
ChartJS.defaults.plugins.tooltip.bodyFont = {
  family: "Inter, sans-serif",
  size: 13,
};
ChartJS.defaults.plugins.title.font = {
  family: "Inter, sans-serif",
  size: 18,
  weight: "bold",
};

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
      .then((resp) => setList(resp.data))
      .catch(() => toast.error("Erro ao carregar dados!"))
      .finally(() => setLoading(false));
  }, []);

  const totalProducts = list.length;
  const lowStockProducts = list.filter((p) => p.quantity <= p.minstock);
  const lowStockCount = lowStockProducts.length;
  const lowStockPercent = totalProducts
    ? ((lowStockCount / totalProducts) * 100).toFixed(1)
    : 0;

  // 🎨 Paleta de cores moderna
  const colors = {
    primary: "rgba(60,138,127,0.85)",
    secondary: "rgba(23,162,184,0.85)",
    warning: "rgba(255,193,7,0.85)",
    danger: "rgba(220,53,69,0.85)",
    neutral: "rgba(180,180,180,0.4)",
  };

  // === Gráfico principal: Quantidade x Estoque mínimo ===
  const chartData = {
    labels: list.map((p) => p.name),
    datasets: [
      {
        label: "Quantidade atual",
        data: list.map((p) => p.quantity),
        backgroundColor: list.map((p) =>
          p.quantity <= p.minstock ? colors.danger : colors.primary
        ),
        borderRadius: 8,
        hoverBackgroundColor: list.map((p) =>
          p.quantity <= p.minstock ? "rgba(220,53,69,1)" : "rgba(60,138,127,1)"
        ),
      },
      {
        label: "Estoque mínimo",
        data: list.map((p) => p.minstock),
        backgroundColor: colors.neutral,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#444",
          boxWidth: 15,
        },
      },
      title: {
        display: true,
        text: "Comparativo de Estoque",
        color: "#2c3e50",
        padding: { top: 10, bottom: 30 },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: "#555" },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      y: {
        ticks: { color: "#555" },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  // === Gráfico de pizza: Distribuição por categoria ===
  const categoryCounts = list.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Tipos de produtos",
        data: Object.values(categoryCounts),
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.warning,
          colors.danger,
          "rgba(108,117,125,0.85)",
        ],
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 12,
      },
    ],
  };

  const categoryOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.85)",
        cornerRadius: 8,
      },
    },
  };

  // === Gráfico de barras: Quantidade total por categoria ===
  const quantityByCategory = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Quantidade total",
        data: Object.keys(categoryCounts).map((cat) =>
          list
            .filter((p) => p.category === cat)
            .reduce((sum, p) => sum + Number(p.quantity || 0), 0)
        ),
        backgroundColor: colors.secondary,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(23,162,184,1)",
      },
    ],
  };

  const quantityOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: "Quantidade Total por Categoria",
        color: "#2c3e50",
        padding: { bottom: 30 },
      },
    },
  };

  // === Exportar CSV ===
  function exportCSV() {
    try {
      if (!list || !list.length) {
        toast.error("Não há dados para exportar!");
        return;
      }

      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Nome" },
        { key: "unit", label: "Unidade" },
        { key: "category", label: "Categoria" },
        { key: "quantity", label: "Quantidade" },
        { key: "minstock", label: "Estoque mínimo" },
      ];

      const rows = list.map((item) =>
        columns.map((col) => item[col.key] ?? "")
      );

      const csvContent = [columns.map((col) => col.label), ...rows]
        .map((r) => r.join(";"))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "produtos.csv");
      toast.success("CSV exportado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao exportar CSV!");
    }
  }

  // === Exportar PDF ===
  function exportPDF() {
    try {
      const doc = new jsPDF("p", "mm", "a4");

      doc.setFillColor(106, 197, 214);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");

      const imgWidth = 25;
      const imgHeight = 25;
      const marginLeft = 14;
      const marginTop = 3;
      doc.addImage(logo, "PNG", marginLeft, marginTop, imgWidth, imgHeight);

      // Cabeçalho
      doc.setFontSize(16);
      doc.setTextColor(255);
      doc.setFont("helvetica", "bold");
      doc.text("Relatório de Produtos do Almoxarifado PIBLS", 50, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Controle completo do estoque da igreja", 50, 24);

      // Preparando os dados
      const tableData = list.map((p) => [
        p.id,
        p.name,
        p.unit,
        p.category,
        p.quantity,
        p.minstock,
      ]);

      autoTable(doc, {
        startY: 35,
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
        styles: { fontSize: 9 },
        headStyles: { fillColor: [106, 197, 214] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 4) {
            const quantity = Number(data.cell.text[0]);
            const minStock = Number(list[data.row.index].minstock);
            if (quantity <= minStock) {
              data.cell.styles.textColor = [211, 40, 40];
              data.cell.styles.fontStyle = "bold";
            }
          }
        },
        margin: { top: 10, bottom: 25 },
        didDrawPage: function (data) {
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          // Rodapé
          doc.setFontSize(8);
          doc.setTextColor(100);
          const today = new Date();
          const dateStr = today.toLocaleDateString();
          doc.text(
            `Emitido em: ${dateStr} | PIBLS - Primeira Igreja Batista em Lagoa Santa | site: pibls.com`,
            14,
            pageHeight - 10
          );

          // Numeração de páginas
          const pageCount = doc.internal.getNumberOfPages();
          doc.text(
            `Página ${data.pageNumber} de ${pageCount}`,
            pageWidth - 25,
            pageHeight - 10
          );
        },
      });

      doc.save("produtos_relatorio.pdf");
      toast.success("PDF exportado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao exportar PDF!");
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
      <ToastContainer theme="light" position="top-center" />

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

      {/* Lista de produtos com estoque crítico */}
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

      {/* Botões */}
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

      {/* Gráfico principal */}
      <motion.div
        className="shadow-lg p-4 rounded-4 bg-white mb-4"
        style={{
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          height: "420px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Bar data={chartData} options={chartOptions} />
      </motion.div>

      {/* Gráficos lado a lado */}
      <motion.div
        className="row g-4 justify-content-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="col-12 col-lg-6">
          <div
            className="shadow-lg p-4 rounded-4 bg-white"
            style={{ width: "100%", height: "370px" }}
          >
            <h6 className="fw-semibold mb-3 text-center text-secondary">
              Distribuição de Produtos por Categoria
            </h6>
            <Doughnut data={categoryData} options={categoryOptions} />
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div
            className="shadow-lg p-4 rounded-4 bg-white"
            style={{ width: "100%", height: "370px" }}
          >
            <Bar data={quantityByCategory} options={quantityOptions} />
          </div>
        </div>
      </motion.div>
    </Main>
  );
}
