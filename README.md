# Superior Plast - Site Institucional

## Descrição
Site institucional e catálogo de produtos da Superior Plast, com foco em cadeiras e mesas plásticas para eventos, bares, restaurantes e áreas externas. O projeto é otimizado para SEO, acessibilidade, PWA e performance.

## Estrutura do Projeto
- `index.html` — Página principal, otimizada para SEO e acessibilidade.
- `manifest.json` — Configuração PWA.
- `sw.js` — Service Worker para navegação offline.
- `offline.html` — Página exibida quando offline.
- `assets/`
  - `css/` — Estilos.
  - `js/` — Scripts organizados em módulos (`utils.js`, `combos.js`, `navbarFrases.js`, etc).
  - `images/` — Imagens otimizadas (WebP e JPEG).
  - `data/` — Dados de produtos.
- `backend/` — Backend Node.js para API e banco de dados.
- `scripts/` — Scripts utilitários (ex: conversão de imagens).

## Principais Funcionalidades
- Catálogo de produtos com integração ao WhatsApp.
- PWA: instalação no dispositivo, navegação offline.
- SEO avançado: meta tags, Open Graph, dados estruturados.
- Acessibilidade: ARIA, navegação por teclado, textos alternativos.
- Performance: lazy loading, imagens otimizadas, minificação de CSS/JS.

## Como rodar
1. Instale as dependências do backend (`cd backend && npm install`).
2. Inicie o servidor backend (`node server.js`).
3. Abra o `index.html` em um navegador moderno.

## Melhorias futuras
- Adicionar testes automatizados.
- Melhorar filtros e busca de produtos.
- Implementar autenticação para área administrativa.
- Integrar com sistemas de pagamento.

## Contato
- Email: plastsuperior@gmail.com
- WhatsApp: (51) 99184-2811
- Instagram: @superiorplast
- Facebook: /superiorplastt
