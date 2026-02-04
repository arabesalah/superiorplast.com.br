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
      category TEXT,
      features TEXT,
      caracteristicas TEXT
    )
  `);

  const stmt = db.prepare(`INSERT INTO products (name, price, image, description, category, features, caracteristicas) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const produtos = [
    {
      name: 'Cadeira Bistro Plastica',
      price: 'R$ 44,90 à vista',
      image: 'assets/images/Cadeira Bistrô Preta.jpg',
      description: 'Cadeira econômica e resistente',
      category: 'cadeira',
      features: 'Duas cores: Preto ou Branco; Capacidade de Resistencia de até 182kg; Leve; Fácil de empilhar; Aprovada pelo INMETRO',
      caracteristicas: [
        'Duas cores: Preto ou Branco',
        'Capacidade de Resistencia de até 182kg',
        'Leve',
        'Fácil de empilhar',
        'Aprovada pelo INMETRO'
      ]
    },
    {
      name: 'Poltrona Plastica',
      price: 'R$ 54,90 à vista',
      image: 'assets/images/Cadeira Poltrona Preta.jpg',
      description: 'Poltrona com braços de apoio e maior conforto.',
      category: 'poltrona',
      features: 'Duas cores: Preto ou Branco; Maior conforto; Resistencia até 182kg; Braços de apoio; Aprovada pelo INMETRO',
      caracteristicas: [
        'Duas cores: Preto ou Branco',
        'Resistente',
        'Braços de apoio',
        'Aprovada pelo INMETRO'
      ]
    },
    {
      name: 'Poltrona XL Plastica',
      price: 'R$ 64,90 à vista',
      image: 'assets/images/Cadeira Robusta XL Preta.jpg',
      description: 'Versão XL com conforto extra.',
      category: 'poltrona',
      features: 'Duas cores: Preto ou Branco; Maior conforto; Resistencia até 182kg; Braços de apoio; Aprovada pelo INMETRO',
      caracteristicas: [
        'Duas cores: Preto ou Branco',
        'Capacidade de Resistencia de até 182kg',
        'Maior conforto',
        'Braços de apoio',
        'Aprovada pelo INMETRO'
      ]
    },
    {
      name: 'Mesa Monobloco',
      price: 'R$ 104,90 à vista',
      image: 'assets/images/Mesa Monobloco Preta.jpg',
      description: 'Mesa Monobloco Formato Quadrado e Empilhável.',
      category: 'mesa',
      features: 'Duas cores: Preto ou Branco; Leve; Fácil de empilhar; Aprovada pelo INMETRO',
      caracteristicas: [
        'Duas cores: Preto ou Branco',
        'Leve',
        'Fácil de empilhar',
        'Aprovada pelo INMETRO'
      ]
    }
  ];

  produtos.forEach(item => {
    stmt.run(item.name, item.price, item.image, item.description, item.category, item.features, JSON.stringify(item.caracteristicas));
  });

  stmt.finalize();
});

db.close(() => {
  console.log('Banco de dados inicializado em', dbPath);
});
