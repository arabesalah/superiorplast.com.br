// ...
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const products = [
  {
    id: "cadeira-bistro",
    name: "Cadeira Bistro",
    price: 44.9,
    currency: "BRL",
    description: "Leve, elegante e perfeita para ambientes internos e externos.",
    tag: "Mais econômica",
    images: [
      { cor: "Branca", src: "images/Cadeira-Bistro-Branca.jpg" },
      { cor: "Preta", src: "images/Cadeira-Bistro-Preta.jpg" }
    ]
  },
  {
    id: "cadeira-poltrona",
    name: "Cadeira Poltrona",
    price: 54.9,
    currency: "BRL",
    description: "Conforto e design moderno para o dia a dia.",
    tag: "Conforto",
    images: [
      { cor: "Branca", src: "images/Cadeira-Poltrona-Branca.jpg" },
      { cor: "Preta", src: "images/Cadeira-Poltrona-Preta.jpg" }
    ]
  },
  {
    id: "cadeira-poltrona-robusta-xl",
    name: "Cadeira Poltrona Robusta XL",
    price: 64.9,
    currency: "BRL",
    description: "Estrutura reforçada e acabamento premium.",
    tag: "Robusta",
    images: [
      { cor: "Branca", src: "images/Cadeira-Robusta-XL-Branca.jpg" },
      { cor: "Preta", src: "images/Cadeira-Robusta-XL-Preta.jpg" }
    ]
  },
  {
    id: "mesa",
    name: "Mesa",
    price: 104.9,
    currency: "BRL",
    description: "Mesa resistente, ideal para ambientes internos e externos.",
    tag: "Versátil",
    images: [
      { cor: "Branca", src: "images/Mesa-Branca.jpg" },
      { cor: "Preta", src: "images/Mesa-Preta.jpg" }
    ]
  }
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", (req, res) => {
  res.json({
    brand: "Superiorplast",
    updatedAt: new Date().toISOString(),
    items: products
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }
  return res.json(product);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Superiorplast rodando em http://localhost:${PORT}`);
});
