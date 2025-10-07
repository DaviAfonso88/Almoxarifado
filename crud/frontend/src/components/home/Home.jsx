import { Main } from "../template/Main";

const Home = () => (
  <Main icon="home" title="Início" subtitle="Almoxarifado PIBLS">
    {/* Cabeçalho */}
    <div className="display-4 fw-bold mb-3">
      👋 Bem-vindo ao Sistema do Almoxarifado da PIBLS!
    </div>
    <hr className="mb-4" />

    <p className="lead text-secondary mb-5">
      Este sistema foi desenvolvido para gerenciar o cadastro e controle de
      produtos do <strong>almoxarifado da PIBLS</strong>. Aqui você pode
      cadastrar, atualizar, consultar, controlar estoque, visualizar gráficos e
      exportar relatórios.
    </p>

    {/* Cards principais */}
    <div className="row g-4">
      <div className="col-md-4">
        <div
          className="card h-100 shadow-sm border-0 rounded-4 p-4 text-center"
          style={{
            background: "#f0f9f8",
            color: "#043546",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          <div className="display-6 mb-3">🚀</div>
          <h5 className="fw-bold mb-3">Tecnologias</h5>
          <p className="mb-0">
            React, Axios, Bootstrap, Chart.js, jsPDF, FileSaver e API REST para
            gerenciamento de dados.
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div
          className="card h-100 shadow-sm border-0 rounded-4 p-4"
          style={{
            background: "#f0f9f8",
            color: "#043546",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          <div className="display-6 mb-3">🧑‍💻</div>
          <h5 className="fw-bold mb-3">Funcionalidades</h5>
          <ul className="list-unstyled mb-0">
            <li>📦 Cadastro de produtos</li>
            <li>📊 Dashboard com gráficos de estoque</li>
            <li>📉 Controle de estoque e alerta de mínimo</li>
            <li>📝 Cadastro e gerenciamento de categorias</li>
            <li>✏️ Atualização e exclusão com confirmação</li>
            <li>🔍 Pesquisa por nome, categoria, unidade ou quantidade</li>
            <li>💾 Exportação de dados em CSV e PDF</li>
            <li className="text-danger">
              ⚠ Produtos abaixo do estoque mínimo destacados
            </li>
          </ul>
        </div>
      </div>

      <div className="col-md-4">
        <div
          className="card h-100 shadow-sm border-0 rounded-4 p-4"
          style={{
            background: "#f0f9f8",
            color: "#043546",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          <div className="display-6 mb-3">📌</div>
          <h5 className="fw-bold mb-3">Navegação</h5>
          <p className="mb-0">
            Use o menu lateral para acessar cadastro de produtos, categorias,
            dashboard e exportação de relatórios. Gerencie o almoxarifado de
            forma prática e segura.
          </p>
        </div>
      </div>
    </div>

    {/* Card de dicas sobre categorias */}
    <div className="row g-4 mt-4">
      <div className="col-12">
        <div className="alert alert-warning shadow-sm rounded-4 p-4">
          <h5 className="fw-bold mb-3">💡 Dicas sobre categorias</h5>
          <ul style={{ paddingLeft: "1.2rem", listStyle: "disc" }}>
            <li>
              📂 Organize produtos em categorias para facilitar buscas e
              relatórios.
            </li>
            <li>
              🔹 Categorias ajudam a identificar rapidamente produtos similares.
            </li>
            <li>
              📊 Melhore o dashboard: gráficos por categoria mostram melhor o
              estoque.
            </li>
            <li>
              ⚡ Reduza erros ao cadastrar produtos duplicados sem categoria.
            </li>
            <li>
              🛠 Planeje categorias pensando em futuras expansões do
              almoxarifado.
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Alertas e dicas */}
    <div className="alert alert-info mt-4 shadow-sm rounded-4 d-flex align-items-center">
      <span className="me-2">💡</span>
      <span>
        Sempre atualize o sistema após entradas e saídas de produtos. Produtos
        em <strong className="text-danger">vermelho</strong> estão abaixo do
        estoque mínimo. Para ajustes adicionais, fale com{" "}
        <strong>Davi Afonso</strong>.
      </span>
    </div>
  </Main>
);

export { Home };
