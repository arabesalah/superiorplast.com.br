const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Para parsing de JSON
app.use(express.static(path.join(__dirname, '..')));

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error('Erro ao abrir DB:', err.message);
});

ensureDatabaseReady();

function ensureDatabaseReady() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price TEXT,
        image TEXT,
        description TEXT,
        category TEXT,
        features TEXT,
        caracteristicas TEXT
      )`
    );

    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('Erro ao verificar tabela products:', err.message);
        return;
      }
      if (row && row.count > 0) return;
      seedProductsFromJson();
    });
  });
}

function seedProductsFromJson() {
  const seedPath = path.join(__dirname, '..', 'assets', 'data', 'products.json');
  if (!fs.existsSync(seedPath)) return;
  try {
    const raw = fs.readFileSync(seedPath, 'utf-8');
    const items = JSON.parse(raw);
    if (!Array.isArray(items) || items.length === 0) return;

    const stmt = db.prepare(
      'INSERT INTO products (name, price, image, description, category, features, caracteristicas) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    items.forEach(item => {
      const featuresValue = Array.isArray(item.features) ? item.features.join('; ') : (item.features || '');
      const caracteristicasValue = Array.isArray(item.caracteristicas) ? JSON.stringify(item.caracteristicas) : (item.caracteristicas ? JSON.stringify(item.caracteristicas) : '');
      stmt.run(
        item.name || '',
        item.price || '',
        item.image || '',
        item.description || '',
        item.category || '',
        featuresValue,
        caracteristicasValue
      );
    });

    stmt.finalize();
    console.log('Banco de dados populado com products.json');
  } catch (err) {
    console.error('Erro ao popular banco:', err.message);
  }
}

// Rota para listar todos os produtos
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(normalizeProduct));
  });
});

// Rota para buscar produto por ID
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(normalizeProduct(row));
  });
});

// Rota para criar novo produto
app.post('/api/products', (req, res) => {
  const { name, price, image, description, category, features, caracteristicas } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
  const featuresValue = Array.isArray(features) ? features.join('; ') : (features || '');
  const caracteristicasValue = Array.isArray(caracteristicas) ? JSON.stringify(caracteristicas) : (caracteristicas ? JSON.stringify(caracteristicas) : '');
  db.run('INSERT INTO products (name, price, image, description, category, features, caracteristicas) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, price, image, description, category, featuresValue, caracteristicasValue], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// Rota para atualizar produto
app.put('/api/products/:id', (req, res) => {
  const { name, price, image, description, category, features, caracteristicas } = req.body;
  const featuresValue = Array.isArray(features) ? features.join('; ') : (features || '');
  const caracteristicasValue = Array.isArray(caracteristicas) ? JSON.stringify(caracteristicas) : (caracteristicas ? JSON.stringify(caracteristicas) : '');
  db.run('UPDATE products SET name = ?, price = ?, image = ?, description = ?, category = ?, features = ?, caracteristicas = ? WHERE id = ?',
    [name, price, image, description, category, featuresValue, caracteristicasValue, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
      res.json({ message: 'Produto atualizado' });
    });
});

// Rota para deletar produto
app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado' });
  });
});

function normalizeProduct(row) {
  if (!row) return row;
  const features = (row.features || '').split(';').map(f => f.trim()).filter(Boolean);
  let caracteristicas = [];
  if (row.caracteristicas) {
    try {
      caracteristicas = JSON.parse(row.caracteristicas);
    } catch (err) {
      caracteristicas = (String(row.caracteristicas) || '').split(';').map(f => f.trim()).filter(Boolean);
    }
  }
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    image: row.image,
    description: row.description,
    category: row.category,
    features,
    caracteristicas
  };
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
