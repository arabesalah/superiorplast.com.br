const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS products`);
  db.run(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price TEXT,
      image TEXT,
      description TEXT,
      features TEXT
    )
  `);

  const stmt = db.prepare(`INSERT INTO products (name, price, image, description, features) VALUES (?, ?, ?, ?, ?)`);

  stmt.run(
    'Cadeira Bistro Plastica',
    'R$ 44,90 à vista',
    'assets/images/cadeira1.jpg',
    'Cadeira econômica e resistente',
    'Duas cores: Preto ou Branco; Capacidade de Resistencia de até 182kg; Leve; Fácil de empilhar; Aprovada pelo INMETRO'
  );

  stmt.run(
    'Poltrona Plastica',
    'R$ 54,90 à vista',
    'assets/images/cadeira2.jpg',
    'Poltrona com braços de apoio e maior conforto.',
    'Duas cores: Preto ou Branco; Maior conforto; Resistencia até 182kg; Braços de apoio; Aprovada pelo INMETRO'
  );

  stmt.run(
    'Poltrona XL Plastica',
    'R$ 64,90 à vista',
    'assets/images/cadeira3.jpg',
    'Versão XL com conforto extra.',
    'Duas cores: Preto ou Branco; Maior conforto; Resistencia até 182kg; Braços de apoio; Aprovada pelo INMETRO'
  );

  stmt.run(
    'Mesa Monobloco',
    'R$ 104,90 à vista',
    'assets/images/Mesa Monobloco Preta.jpg',
    'Mesa Monobloco Formato Quadrado e Empilhável.',
    'Duas cores: Preto ou Branco; Resistente; Leve; Fácil de empilhar; Aprovada pelo INMETRO'
  );

  stmt.finalize();
});

db.close(() => {
  console.log('Banco de dados inicializado em', dbPath);
});
