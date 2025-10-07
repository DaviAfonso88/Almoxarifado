import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// ================== CONEXÃO COM SUPABASE ==================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // usa a URI completa do Render
  ssl: { rejectUnauthorized: false },
  max: 10, // máximo de conexões no pool
});

// ================== FUNÇÃO DE RETRY ==================
async function connectWithRetry(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.connect();
      console.log("✅ Conectado com sucesso ao Supabase!");
      return;
    } catch (err) {
      console.error(`Tentativa ${i + 1} falhou: ${err.code || err.message}`);
      if (i < retries - 1) {
        console.log(`Tentando novamente em ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error(
          "❌ Não foi possível conectar ao banco após várias tentativas."
        );
        process.exit(1);
      }
    }
  }
}

// Executa a conexão com retry
connectWithRetry();

// ================== CRIAÇÃO DE TABELAS ==================
(async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT,
        quantity INTEGER,
        category TEXT,
        unit TEXT,
        minStock INTEGER
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE
      )
    `);
    console.log("✅ Tabelas criadas com sucesso!");
    client.release();
  } catch (err) {
    console.error("❌ Erro ao criar tabelas:", err);
  }
})();

// ================== ROTAS ==================

// Produtos
app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id");
  res.json(result.rows);
});

app.post("/products", async (req, res) => {
  const { name, quantity, category, unit, minStock } = req.body;
  const result = await pool.query(
    "INSERT INTO products (name, quantity, category, unit, minStock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, quantity, category, unit, minStock]
  );
  res.json(result.rows[0]);
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, quantity, category, unit, minStock } = req.body;
  const result = await pool.query(
    "UPDATE products SET name=$1, quantity=$2, category=$3, unit=$4, minStock=$5 WHERE id=$6 RETURNING *",
    [name, quantity, category, unit, minStock, id]
  );
  res.json(result.rows[0]);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM products WHERE id=$1", [id]);
  res.sendStatus(204);
});

// Categorias
app.get("/categories", async (req, res) => {
  const result = await pool.query("SELECT * FROM categories ORDER BY id");
  res.json(result.rows);
});

app.post("/categories", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Categoria já existe" });
  }
});

app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM categories WHERE id=$1", [id]);
  res.sendStatus(204);
});

// ================== SERVIDOR ==================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
