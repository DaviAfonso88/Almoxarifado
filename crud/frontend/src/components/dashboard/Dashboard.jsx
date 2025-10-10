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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
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
      })
      .catch(() => {
        toast.error("Erro ao carregar dados!");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalProducts = list.length;
  const lowStockProducts = list.filter((p) => p.quantity <= p.minstock);
  const lowStockCount = lowStockProducts.length;
  const lowStockPercent = totalProducts
    ? ((lowStockCount / totalProducts) * 100).toFixed(1)
    : 0;

  // === Gráfico principal: Quantidade x Estoque mínimo ===
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
          "rgba(60,138,127,0.8)",
          "rgba(23,162,184,0.8)",
          "rgba(255,193,7,0.8)",
          "rgba(220,53,69,0.8)",
          "rgba(108,117,125,0.8)",
        ],
      },
    ],
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
        backgroundColor: "rgba(60,138,127,0.8)",
        borderRadius: 8,
      },
    ],
  };

  function exportCSV(options = {}) {
    try {
      if (!list || !list.length) {
        toast.error("Não há dados para exportar!");
        return;
      }

      // Configurações opcionais
      const {
        columns = [
          { key: "id", label: "ID" },
          { key: "name", label: "Nome" },
          { key: "unit", label: "Unidade" },
          { key: "category", label: "Categoria" },
          { key: "quantity", label: "Quantidade" },
          { key: "minstock", label: "Estoque mínimo" },
        ],
        filename = "produtos.csv",
      } = options;

      const escapeCSV = (value) => {
        if (value === null || value === undefined) return "";
        let stringValue;

        if (typeof value === "number") {
          stringValue = value.toLocaleString("pt-BR");
        } else if (value instanceof Date) {
          stringValue = value.toLocaleDateString("pt-BR");
        } else {
          stringValue = value.toString();
        }

        return /[;"\n]/.test(stringValue)
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      };

      const rows = list.map((item) =>
        columns.map((col) => {
          if (col.key === "createdAt")
            return item.createdAt ? new Date(item.createdAt) : "";
          return item[col.key];
        })
      );

      const totalQuantity = list.reduce(
        (acc, item) => acc + (item.quantity || 0),
        0
      );
      const totalMinStock = list.reduce(
        (acc, item) => acc + (item.minstock || 0),
        0
      );
      const summaryRow = columns.map((col) => {
        if (col.key === "quantity") return totalQuantity;
        if (col.key === "minstock") return totalMinStock;
        return "";
      });

      // Montar CSV final
      const csvContent = [
        columns.map((col) => col.label), // cabeçalho
        ...rows,
        summaryRow, // resumo no final
      ]
        .map((row) => row.map(escapeCSV).join(";"))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(blob, filename);

      toast.success("Arquivo CSV exportado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar CSV!");
    }
  }

  function exportPDF() {
    try {
      const doc = new jsPDF("p", "mm", "a4");

      // Cabeçalho
      doc.setFillColor(4, 53, 70);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
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
        headStyles: { fillColor: [4, 53, 70] },
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

      {/* Gráfico principal */}
      <motion.div
        className="shadow p-3 rounded-4 bg-white mb-4"
        style={{
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          height: "400px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Bar
          data={chartData}
          options={{ ...chartOptions, maintainAspectRatio: false }}
        />
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
            className="shadow p-4 rounded-4 bg-white"
            style={{ width: "100%", height: "350px" }}
          >
            <h6 className="fw-semibold mb-3 text-center">
              Distribuição de Produtos por Categoria
            </h6>
            <Doughnut
              data={categoryData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div
            className="shadow p-3 rounded-4 bg-white"
            style={{ width: "100%", height: "350px" }}
          >
            <h6 className="fw-semibold mb-3 text-center">
              Quantidade Total por Categoria
            </h6>
            <Bar
              data={quantityByCategory}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </motion.div>
    </Main>
  );
}
