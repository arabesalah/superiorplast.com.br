document.addEventListener('DOMContentLoaded', () => {
  const waNumber = '551991842811'; // (51) 99184-2811
  const waGreeting = 'Olá, Tenho Interesse e queria mais Informações, por favor.'; // saudação padrão

  function getWhatsAppLink(message) {
    const encoded = encodeURIComponent(message);
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    if (isMobile) {
      // mobile: open in app or redirect to app
      return `https://wa.me/${waNumber}?text=${encoded}`;
    }
    // desktop: open WhatsApp Web
    return `https://web.whatsapp.com/send?phone=${waNumber}&text=${encoded}`;
  }
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  async function loadProducts() {
    // tenta API primeiro
    try {
      const res = await fetch('http://localhost:3000/api/products', { cache: 'no-store' });
      if (!res.ok) throw new Error('API não disponível');
      const products = await res.json();
      renderProducts(products);
      return;
    } catch (err) {
      console.warn('Falha ao obter produtos da API, usando fallback local:', err.message);
    }

    // fallback para JSON local
    try {
      const resLocal = await fetch('assets/data/products.json');
      const productsLocal = await resLocal.json();
      renderProducts(productsLocal);
    } catch (err) {
      console.error('Falha ao carregar fallback local:', err);
      grid.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
    }
  }

  function renderProducts(products) {
    grid.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'produto-card';
      card.dataset.id = p.id;

      const imgDiv = document.createElement('div');
      imgDiv.className = 'produto-imagem';
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name;
      img.dataset.imagemPadrao = p.image;
      imgDiv.appendChild(img);

      const title = document.createElement('h4');
      title.textContent = p.name;

      const price = document.createElement('p');
      price.className = 'preco';
      price.textContent = p.price;

      const paymentInfo = document.createElement('p');
      paymentInfo.style.cssText = 'font-size:0.9rem;color:var(--text-light);margin-top:0.5rem;margin-bottom:1rem;font-style:italic;';
      paymentInfo.textContent = 'Para mais informações e condições de pagamento entre em contato conosco';

      const desc = document.createElement('p');
      desc.className = 'descricao';
      desc.innerHTML = '';
      if (p.description) desc.innerHTML += `<strong>Descrição:</strong><br>${p.description}<br>`;
      if (p.features) {
        desc.innerHTML += `<strong>Características:</strong><br>`;
        const features = p.features.split(/;\s*/);
        features.forEach(f => {
          const trimmed = f.trim();
          if (trimmed.includes('Preto') && trimmed.includes('Branco')) {
            // Esta é a linha de cores, criar botões hover
            desc.innerHTML += '<div style="display:flex;gap:0.8rem;margin:0.8rem 0;">';
            ['Preto', 'Branco'].forEach(cor => {
              desc.innerHTML += `<span class="cor-hover" data-cor="${cor}" data-produto-id="${p.id}" style="cursor:pointer;padding:0.5rem 1rem;background:#f0f0f0;border-radius:6px;border:2px solid #ddd;font-size:0.95rem;user-select:none;transition:all 0.2s;">${cor}</span>`;
            });
            desc.innerHTML += '</div>';
          } else {
            desc.innerHTML += trimmed + '<br>';
          }
        });
      }

      const actionP = document.createElement('p');
      const a = document.createElement('a');
      a.className = 'btn btn-whatsapp';
      a.target = '_blank';
      const message = `${waGreeting} Tenho interesse no ${p.name} ${p.price}. Como faço para comprar?`;
      a.href = getWhatsAppLink(message);
      const icon = document.createElement('i');
      icon.className = 'fab fa-whatsapp';
      const span = document.createElement('span');
      span.textContent = 'Comprar via WhatsApp';
      a.appendChild(icon);
      a.appendChild(span);
      actionP.appendChild(a);

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-whatsapp')) return;
        window.location.href = `product.html?id=${p.id}`;
      });

      card.appendChild(imgDiv);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(paymentInfo);
      card.appendChild(desc);
      card.appendChild(actionP);

      grid.appendChild(card);
    });

    // Adicionar event listeners para cores após renderizar tudo
    setTimeout(() => {
      document.querySelectorAll('.cor-hover').forEach(corSpan => {
        corSpan.addEventListener('mouseenter', function() {
          const produtoId = this.dataset.produtoId;
          const cor = this.dataset.cor;
          const imagemCor = getImagemPorCor(produtoId, cor);
          const card = document.querySelector(`.produto-card[data-id="${produtoId}"]`);
          if (card && imagemCor) {
            const img = card.querySelector('.produto-imagem img');
            if (img) img.src = imagemCor;
          }
          this.style.background = 'var(--secondary-color)';
          this.style.color = '#fff';
          this.style.borderColor = 'var(--secondary-color)';
        });
        corSpan.addEventListener('mouseleave', function() {
          const produtoId = this.dataset.produtoId;
          const card = document.querySelector(`.produto-card[data-id="${produtoId}"]`);
          if (card) {
            const img = card.querySelector('.produto-imagem img');
            if (img) img.src = img.dataset.imagemPadrao;
          }
          this.style.background = '#f0f0f0';
          this.style.color = 'var(--text-dark)';
          this.style.borderColor = '#ddd';
        });
      });
    }, 0);
  }

  function getImagemPorCor(produtoId, cor) {
    const imagensPorCor = {
      1: { 'Preto': 'assets/images/Cadeira Bistrô Preta.jpg', 'Branco': 'assets/images/Cadeira Bistrô Branca.jpg' },
      2: { 'Preto': 'assets/images/Cadeira Poltrona Preta.jpg', 'Branco': 'assets/images/Cadeira Poltrona Branca.jpg' },
      3: { 'Preto': 'assets/images/Cadeira Robusta XL Preta.jpg', 'Branco': 'assets/images/Cadeira Robusta XL Branca.jpg' },
      4: { 'Preto': 'assets/images/Mesa Monobloco Preta.jpg', 'Branco': 'assets/images/Mesa Monobloco Branca.jpg' }
    };
    return imagensPorCor[produtoId]?.[cor] || '';
  }

  loadProducts();
});
