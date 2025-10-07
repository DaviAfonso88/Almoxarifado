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

// registrar os componentes
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
  title: "Dashboard Produtos",
  subtitle: "Resumo, Exportação e Gráficos de Produtos",
};

export default function DashboardProducts() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/products").then((resp) => setList(resp.data));
  }, []);

  const totalProducts = list.length;
  const lowStockProducts = list.filter((p) => p.quantity <= p.minstock);
  const lowStockCount = lowStockProducts.length;

  const chartData = {
    labels: list.map((p) => p.name),
    datasets: [
      {
        label: "Quantidade",
        data: list.map((p) => p.quantity),
        backgroundColor: list.map((p) =>
          p.quantity <= p.minstock ? "#dc3545" : "#3c8a7f"
        ),
      },
      {
        label: "Estoque mínimo",
        data: list.map((p) => p.minstock),
        backgroundColor: "#32dac3",
      },
    ],
  };

  function exportCSV() {
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
  }

  function exportPDF() {
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
        ["ID", "Nome", "Unidade", "Categoria", "Quantidade", "Estoque mínimo"],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [89, 172, 191] },
      didParseCell: function (data) {
        if (data.section === "body" && data.column.index === 4) {
          const quantity = Number(data.cell.text[0]);
          const minStock = Number(list[data.row.index].minstock);
          if (quantity <= minStock) data.cell.styles.textColor = [211, 40, 40];
        }
      },
    });
    doc.save("produtos.pdf");
  }

  return (
    <Main {...headerProps}>
      {/* Cards de resumo */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-3 bg-white rounded">
            <h6 className="fw-semibold">Total de Produtos</h6>
            <p className="fs-4 mb-0">{totalProducts}</p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-3 bg-white rounded border border-danger">
            <h6 className="fw-semibold text-danger">
              Produtos abaixo do estoque mínimo
            </h6>
            <p className="fs-4 mb-0 text-danger">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Lista detalhada dos produtos em alerta */}
      {lowStockCount > 0 && (
        <div className="mb-4">
          <h6 className="fw-semibold mb-2 text-danger">
            Atenção: Produtos com estoque baixo
          </h6>
          <ul className="list-group shadow-sm">
            {lowStockProducts.map((p) => (
              <li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center text-danger fw-semibold"
              >
                {p.name} (Qtd: {p.quantity} / Min: {p.minstock})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botões Export */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button
          className="btn btn-outline-success shadow-sm"
          onClick={exportCSV}
        >
          Exportar CSV
        </button>
        <button
          className="btn btn-outline-primary shadow-sm"
          onClick={exportPDF}
        >
          Exportar PDF
        </button>
      </div>

      {/* Gráfico */}
      <div className="mb-4 shadow rounded p-3 bg-white">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    </Main>
  );
}
