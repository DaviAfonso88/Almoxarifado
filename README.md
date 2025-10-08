# 🏷️ Sistema de Almoxarifado PIBLS

O **Sistema de Almoxarifado da Primeira Igreja Batista em Lagoa Santa (PIBLS)** foi desenvolvido para otimizar o controle de produtos, categorias e relatórios de estoque da instituição.  
A aplicação permite **cadastro, edição, exclusão e listagem** de produtos e categorias, além de uma área de **dashboard com gráficos e exportação de relatórios em CSV e PDF**.

---

## 📑 Sumário
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🗃️ Banco de Dados](#️-banco-de-dados)
- [📊 Aba de Relatórios (Dashboard)](#-aba-de-relatórios-dashboard)
- [⚙️ Rotas da API](#️-rotas-da-api)
- [📦 Funcionalidades Principais](#️-funcionalidades-principais)
- [🌐 Deploy](#-deploy)
- [👨‍💻 Autor](#-autor)

---

## 🚀 Tecnologias Utilizadas

### **Back-End**
- **Node.js** com **Express**
- **PostgreSQL** (hospedado no **Supabase**)
- **pg** para conexão com o banco de dados
- **dotenv** para variáveis de ambiente
- **CORS** para comunicação com o front-end

### **Front-End**
- **React.js** com Hooks (`useState`, `useEffect`)
- **Chart.js** e **react-chartjs-2** para gráficos
- **Framer Motion** para animações
- **React Toastify** para notificações
- **jsPDF** e **jspdf-autotable** para geração de relatórios PDF
- **file-saver** para exportação de arquivos CSV
- **Bootstrap** e **React Icons** para estilização

---

## 🗃️ Banco de Dados

O banco de dados é composto por **duas tabelas principais**:

### **1. products**
Armazena os dados dos produtos cadastrados no almoxarifado.

| Campo       | Tipo     | Descrição                          |
|--------------|----------|------------------------------------|
| id           | SERIAL   | Identificador único do produto     |
| name         | TEXT     | Nome do produto                    |
| quantity     | INTEGER  | Quantidade atual em estoque        |
| category     | TEXT     | Categoria do produto               |
| unit         | TEXT     | Unidade de medida (ex: caixa, kg)  |
| minStock     | INTEGER  | Estoque mínimo recomendado         |

### **2. categories**
Controla as categorias disponíveis para os produtos.

| Campo | Tipo   | Descrição              |
|--------|--------|------------------------|
| id     | SERIAL | Identificador único    |
| name   | TEXT   | Nome da categoria (único) |

A conexão é feita por meio de um **pool de conexões Singleton** para evitar sobrecarga em ambientes **serverless (como Vercel)**:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});
```

## 📊 Aba de Relatórios (Dashboard)

A seção **Dashboard de Produtos** fornece uma visão geral do almoxarifado com **gráficos, estatísticas e exportações**.

### **Funcionalidades principais**
- Exibição do **total de produtos cadastrados**
- Identificação dos produtos **abaixo do estoque mínimo**
- **Gráfico de barras** comparando quantidade atual x estoque mínimo
- **Exportação de relatórios**:
  - **CSV** (para planilhas)
  - **PDF** (com destaque em vermelho para produtos críticos)
- **Animações suaves** e **notificações visuais**
- **Interface responsiva e moderna**, feita com **Bootstrap + Framer Motion**

### **Exemplo de dados exportados (CSV ou PDF):**

| ID | Nome | Unidade | Categoria | Quantidade | Estoque Mínimo |
|----|------|----------|------------|-------------|----------------|
| 1 | Papel A4 | Caixa | Escritório | 10 | 5 |
| 2 | Copos Plásticos | Unidade | Cozinha | 3 | 5 |

### **Interface do Dashboard:**
<img width="1900" height="851" alt="image" src="https://github.com/user-attachments/assets/362214a9-3c28-40d7-ba2e-e67ba22bd11d" />

---

## ⚙️ Rotas da API

### **Produtos**
| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/products` | Lista todos os produtos |
| `POST` | `/products` | Cadastra um novo produto |
| `PUT` | `/products/:id` | Atualiza um produto existente |
| `DELETE` | `/products/:id` | Remove um produto |

### **Categorias**
| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/categories` | Lista todas as categorias |
| `POST` | `/categories` | Cadastra uma nova categoria |
| `DELETE` | `/categories/:id` | Remove uma categoria |

---

## 📦 Funcionalidades Principais

- ✅ Cadastro, edição e exclusão de produtos
- 📊 Controle de estoque e quantidades mínimas
- 📁 Geração de relatórios de movimentações
- 🔍 Busca de produtos por nome ou categoria
- 📦 Registro de entradas e saídas
- 🧾 Exportação de relatórios

---


## 🌐 Deploy

- **Front-End:** hospedado na [Vercel](https://vercel.com)  
- **Back-End:** hospedado na [Vercel](https://render.com)  
- **Banco de Dados:** hospedado no [Supabase](https://supabase.com)

---

## 👨‍💻 Autor

**Desenvolvido por [Davi Afonso](https://portfolio-davi-afonso.netlify.app/)**  
💼 Desenvolvedor Full Stack | 💡 Entusiasta em soluções para igrejas e comunidades  

🌐 **Portfólio:** [https://portfolio-davi-afonso.netlify.app/](https://portfolio-davi-afonso.netlify.app/)  
📍 **Projeto desenvolvido para:** Primeira Igreja Batista em Lagoa Santa (PIBLS)

