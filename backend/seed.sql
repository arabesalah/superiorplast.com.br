PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  price TEXT,
  image TEXT,
  description TEXT,
  category TEXT,
  features TEXT,
  caracteristicas TEXT
);

INSERT INTO products (name, price, image, description, category, features, caracteristicas) VALUES
  ('Cadeira Bistro Plastica','R$ 44,90','assets/images/cadeira1.jpg','Cadeira econômica e resistente, ideal para uso interno e externo.','cadeira','Duas cores: preto ou branco; Resiste até 182kg; Leve; Fácil de empilhar; Aprovada pelo INMETRO',json_array('Duas cores: preto ou branco','Resiste até 182kg','Leve','Fácil de empilhar','Aprovada pelo INMETRO')),
  ('Poltrona Plastica','R$ 54,90','assets/images/cadeira2.jpg','Poltrona com braços de apoio e maior conforto.','poltrona','Duas cores: preto ou branco; Maior conforto; Resiste até 182kg; Braços de apoio; Aprovada pelo INMETRO',json_array('Duas cores: preto ou branco','Maior conforto','Resiste até 182kg','Braços de apoio','Aprovada pelo INMETRO')),
  ('Poltrona XL Plastica','R$ 64,90','assets/images/cadeira3.jpg','Versão XL com conforto extra.','poltrona','Duas cores: preto ou branco; Conforto extra; Resiste até 182kg; Braços de apoio; Aprovada pelo INMETRO',json_array('Duas cores: preto ou branco','Conforto extra','Resiste até 182kg','Braços de apoio','Aprovada pelo INMETRO')),
  ('Mesa Monobloco','R$ 104,90','assets/images/mesa1.jpg','Mesa monobloco empilhável.','mesa','Duas cores: preto ou branco; Leve; Fácil de empilhar; Aprovada pelo INMETRO',json_array('Duas cores: preto ou branco','Leve','Fácil de empilhar','Aprovada pelo INMETRO'));

COMMIT;
