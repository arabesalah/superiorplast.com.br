
// Importa dados de combos e funções utilitárias
import { combos } from './combos.js';
import { getWhatsAppLink, preferWebp } from './utils.js';

// Módulo principal de produtos
document.addEventListener('DOMContentLoaded', () => {
  const waNumber = '551991842811'; // (51) 99184-2811
  const waGreeting = 'Olá, Tenho Interesse e queria mais Informações, por favor.'; // saudação padrão

  const preferWebp = (src) => src || '';

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
  const combosGrid = document.getElementById('combos-grid');
  if (!grid) return;

  const combos = [
    {
      id: 101,
      name: 'Conjunto Cadeira Bistrô',
      price: 'R$ 279,90 à vista',
      image: 'assets/images/Conjunto Cadeira Bistrô Branca.jpg',
      description: 'Kit pronto com cadeiras Bistrô para equipar ambientes com praticidade.',
      features: [
        'Duas cores: Preto ou Branco',
        'Capacidade de Resistencia de até 182kg',
        'Leve',
        'Fácil de empilhar',
        'Aprovada pelo INMETRO'
      ]
    },
    {
      id: 102,
      name: 'Conjunto Cadeira Poltrona',
      price: 'R$ 319,90 à vista',
      image: 'assets/images/Conjunto Cadeira Poltrona Branca.jpg',
      description: 'Kit de poltronas com braços de apoio, perfeito para receber com conforto.',
      features: [
        'Duas cores: Preto ou Branco',
        'Capacidade de Resistencia de até 182kg',
        'Braços de apoio',
        'Aprovada pelo INMETRO'
      ]
    },
    {
      id: 103,
      name: 'Conjunto Cadeira Poltrona XL',
      price: 'R$ 359,90 à vista',
      image: 'assets/images/Conjunto Cadeira Robusta XL Branca.jpg',
      description: 'Kit XL com conforto extra para áreas de grande circulação.',
      features: [
        'Duas cores: Preto ou Branco',
        'Capacidade de Resistencia de até 182kg',
        'Braços de apoio',
        'Maior conforto',
        'Aprovada pelo INMETRO'
      ]
    }
  ];

  const filterDefinitions = [
    { id: 'all', label: 'Todos os produtos' },
    { id: 'cadeira', label: 'Bistrô' },
    { id: 'poltrona', label: 'Poltronas' },
    { id: 'mesa', label: 'Mesas' }
  ];
  const filtersContainer = document.getElementById('products-filters');
  const searchInput = document.getElementById('products-search');
  const searchHints = document.getElementById('products-search-hints');
  const clearSearchBtn = document.getElementById('products-search-clear');
  let activeFilter = 'all';
  let searchTerm = '';
  let allProducts = [];
  let hasLoadedProducts = false;

  async function loadProducts() {
    // tenta API primeiro
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) throw new Error('API não disponível');
      const products = await res.json();
      allProducts = Array.isArray(products) ? products : [];
      hasLoadedProducts = true;
      renderProducts(filterProductsList());
      updateSearchHints();
      return;
    } catch (err) {
      console.warn('Falha ao obter produtos da API, usando fallback local:', err.message);
    }

    // fallback para JSON local
    try {
      const resLocal = await fetch('assets/data/products.json');
      const productsLocal = await resLocal.json();
      allProducts = Array.isArray(productsLocal) ? productsLocal : [];
      hasLoadedProducts = true;
      renderProducts(filterProductsList());
      updateSearchHints();
    } catch (err) {
      console.error('Falha ao carregar fallback local:', err);
      grid.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
    }
  }

  function applyMobileDescriptionToggle(descEl) {
    if (!descEl) return;
    if (!window.matchMedia('(max-width: 600px)').matches) return;
    const textLength = descEl.textContent?.trim().length || 0;
    if (textLength < 140) return;
    descEl.classList.add('descricao-mobile', 'is-collapsed');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'descricao-toggle';
    toggle.textContent = 'Ver mais';
    toggle.addEventListener('click', () => {
      const isCollapsed = descEl.classList.toggle('is-collapsed');
      toggle.textContent = isCollapsed ? 'Ver mais' : 'Ver menos';
    });
    descEl.parentElement?.appendChild(toggle);
  }

  function renderProducts(productsList) {
    const dataset = Array.isArray(productsList) ? productsList : [];
    grid.innerHTML = '';
    if (dataset.length === 0) {
      grid.innerHTML = hasLoadedProducts ? '<p class="produtos-empty">Nenhum produto encontrado para este filtro.</p>' : '';
      return;
    }
    dataset.forEach(p => {
      const card = document.createElement('div');
      card.className = 'produto-card';
      card.dataset.id = p.id;

      const imgDiv = document.createElement('div');
      imgDiv.className = 'produto-imagem';
      const picture = document.createElement('picture');
      const webpSrc = preferWebp(p.image);
      const img = document.createElement('img');
      img.src = p.image && p.image !== 'assets/images/img.logosuperiorplast.jpg' ? p.image : '';
      img.alt = p.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 320;
      img.height = 180;
      img.sizes = '(max-width: 768px) 90vw, 320px';
      img.dataset.imagemPadrao = p.image || '';
      img.dataset.imagemPadraoWebp = webpSrc || '';
      img.onerror = function() {
        this.style.display = 'block';
        this.src = 'assets/images/img.logosuperiorplast.jpg';
      };
      if (!img.src) {
        img.src = 'assets/images/img.logosuperiorplast.jpg';
      }
      picture.appendChild(img);
      imgDiv.appendChild(picture);

      const title = document.createElement('h4');
      title.innerHTML = highlightText(p.name);

      const price = document.createElement('p');
      price.className = 'preco';
      price.textContent = p.price;

      const paymentInfo = document.createElement('p');
      paymentInfo.style.cssText = 'font-size:0.9rem;color:var(--text-light);margin-top:0.5rem;margin-bottom:1rem;font-style:italic;';
      paymentInfo.textContent = 'Para mais informações e condições de pagamento entre em contato conosco';

      const desc = document.createElement('p');
      desc.className = 'descricao';
      let descHtml = '';
      if (p.description) descHtml += `<strong>Descrição:</strong><br>${highlightText(p.description)}<br>`;
      // Botão de cores acima da descrição
      let corBtnHtml = '';
      if (p.features) {
        let features = p.features;
        if (typeof features === 'string') {
          features = features.split(/;\s*/);
        }
        features.forEach(feature => {
          const trimmed = feature.trim();
          if (trimmed.toLowerCase().includes('preto') && trimmed.toLowerCase().includes('branco')) {
            corBtnHtml += '<div style=\"display:flex;gap:0.8rem;margin:0.8rem 0;\">';
            ['Preto', 'Branco'].forEach(cor => {
              corBtnHtml += `<span class=\"cor-hover\" data-cor=\"${cor}\" data-produto-id=\"${p.id}\" style=\"cursor:pointer;padding:0.5rem 1rem;background:#f0f0f0;border-radius:6px;border:2px solid #ddd;font-size:0.95rem;user-select:none;transition:all 0.2s;\">${cor}</span>`;
            });
            corBtnHtml += '</div>';
          }
        });
      }
      if (p.caracteristicas && Array.isArray(p.caracteristicas)) {
        p.caracteristicas.forEach(carac => {
          const trimmed = carac.trim();
          if (trimmed.toLowerCase().includes('preto') && trimmed.toLowerCase().includes('branco')) {
            corBtnHtml += '<div style=\"display:flex;gap:0.8rem;margin:0.8rem 0;\">';
            ['Preto', 'Branco'].forEach(cor => {
              corBtnHtml += `<span class=\"cor-hover\" data-cor=\"${cor}\" data-produto-id=\"${p.id}\" style=\"cursor:pointer;padding:0.5rem 1rem;background:#f0f0f0;border-radius:6px;border:2px solid #ddd;font-size:0.95rem;user-select:none;transition:all 0.2s;\">${cor}</span>`;
            });
            corBtnHtml += '</div>';
          }
        });
      }
      if (corBtnHtml) descHtml += corBtnHtml;

      // Descrição e características
      if (p.features) {
        let features = p.features;
        if (typeof features === 'string') {
          features = features.split(/;\s*/);
        }
        features.forEach(feature => {
          const trimmed = feature.trim();
          if (trimmed.toLowerCase().includes('resistencia')) {
            descHtml += `<div class="feature-resistencia">${highlightText(trimmed)}</div>`;
          } else if (!(trimmed.toLowerCase().includes('preto') && trimmed.toLowerCase().includes('branco'))) {
            descHtml += `<div>${highlightText(trimmed)}</div>`;
          }
        });
      }
      if (p.caracteristicas && Array.isArray(p.caracteristicas) && p.caracteristicas.length > 0) {
        descHtml += `<strong>Características:</strong><br>`;
        p.caracteristicas.forEach(carac => {
          const trimmed = carac.trim();
          if (!(trimmed.toLowerCase().includes('preto') && trimmed.toLowerCase().includes('branco'))) {
            descHtml += `<div>${highlightText(trimmed)}</div>`;
          }
        });
      }

      desc.innerHTML = descHtml;
      applyMobileDescriptionToggle(desc);

      const actions = document.createElement('div');
      actions.className = 'produto-actions';

      const detalhes = document.createElement('a');
      detalhes.className = 'btn-ghost';
      detalhes.href = `product.html?id=${p.id}`;
      detalhes.textContent = 'Ver detalhes';

      const a = document.createElement('a');
      a.className = 'btn btn-whatsapp';
      a.target = '_blank';
      const message = `${waGreeting} Tenho interesse no ${p.name} ${p.price}. Como faço para comprar?`;
      a.href = getWhatsAppLink(message);
      a.setAttribute('aria-label', `Comprar ${p.name} via WhatsApp`);
      const icon = document.createElement('i');
      icon.className = 'fab fa-whatsapp';
      const span = document.createElement('span');
      span.textContent = 'Comprar via WhatsApp';
      a.appendChild(icon);
      a.appendChild(span);

      actions.appendChild(detalhes);
      actions.appendChild(a);

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-whatsapp') || e.target.closest('.btn-ghost')) return;
        window.location.href = `product.html?id=${p.id}`;
      });

      card.appendChild(imgDiv);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(paymentInfo);
      card.appendChild(desc);
      card.appendChild(actions);

      grid.appendChild(card);
    });

    // Adicionar event listeners para cores após renderizar tudo
    setTimeout(() => {
      grid.querySelectorAll('.cor-hover').forEach(corSpan => {
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

  function escapeHtml(value) {
    const str = String(value || '');
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegExp(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightText(value) {
    const safeText = escapeHtml(value);
    if (!searchTerm) return safeText;
    const pattern = escapeRegExp(searchTerm);
    try {
      return safeText.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
    } catch (error) {
      return safeText;
    }
  }

  function setSearchTerm(value) {
    const normalized = value ?? '';
    if (searchInput) {
      searchInput.value = normalized;
    }
    searchTerm = normalized.trim();
    renderProducts(filterProductsList());
    updateSearchHints();
    toggleClearButton();
  }

  function toggleClearButton() {
    if (!clearSearchBtn) return;
    clearSearchBtn.classList.toggle('visible', Boolean(searchTerm));
  }

  function handleSuggestionClick(suggestion) {
    if (suggestion.type === 'category') {
      activeFilter = suggestion.value;
      highlightFilterButtons();
      renderProducts(filterProductsList());
      filtersContainer?.querySelector(`[data-filter="${suggestion.value}"]`)?.focus();
      return;
    }
    if (suggestion.type === 'product') {
      setSearchTerm(suggestion.value);
      searchInput?.focus();
      return;
    }
    searchInput?.focus();
  }

  function updateSearchHints() {
    if (!searchHints) return;
    searchHints.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const suggestions = [];
    const term = searchTerm.toLowerCase();
    const availableProducts = Array.isArray(allProducts) ? allProducts : [];
    if (searchTerm) {
      const matches = availableProducts.filter(product => {
        const haystack = `${product.name || ''} ${product.description || ''}`.toLowerCase();
        return haystack.includes(term);
      });
      matches.slice(0, 4).forEach(product => {
        suggestions.push({
          type: 'product',
          value: product.name || '',
          label: product.name || 'Produto',
          subtext: product.category ? `Categoria: ${product.category}` : (product.description || '')
        });
      });
      if (!matches.length) {
        suggestions.push({
          type: 'empty',
          value: '',
          label: `Nenhum produto encontrado para "${searchTerm}"`,
          subtext: 'Tente outra palavra ou categoria'
        });
      }
    } else {
      filterDefinitions.filter(def => def.id !== 'all').forEach(def => {
        suggestions.push({
          type: 'category',
          value: def.id,
          label: def.label,
          subtext: `Explorar ${def.label.toLowerCase()} disponíveis`
        });
      });
    }
    suggestions.slice(0, 4).forEach(suggestion => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-hint-btn';
      button.dataset.suggestionType = suggestion.type;
      button.dataset.suggestionValue = suggestion.value;
      button.setAttribute('aria-label', suggestion.subtext ? `${suggestion.label} - ${suggestion.subtext}` : suggestion.label);
      const labelSpan = document.createElement('span');
      labelSpan.textContent = suggestion.label;
      button.appendChild(labelSpan);
      if (suggestion.subtext) {
        const subtext = document.createElement('span');
        subtext.className = 'search-hint-subtext';
        subtext.textContent = suggestion.subtext;
        button.appendChild(subtext);
      }
      button.addEventListener('click', () => handleSuggestionClick(suggestion));
      li.appendChild(button);
      fragment.appendChild(li);
    });
    searchHints.appendChild(fragment);
  }

  function renderFilterButtons() {
    if (!filtersContainer) return;
    filtersContainer.innerHTML = '';
    filterDefinitions.forEach(def => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn';
      btn.dataset.filter = def.id;
      btn.setAttribute('aria-pressed', def.id === activeFilter ? 'true' : 'false');
      btn.textContent = def.label;
      btn.addEventListener('click', () => {
        if (activeFilter === def.id) return;
        activeFilter = def.id;
        highlightFilterButtons();
        renderProducts(filterProductsList());
      });
      filtersContainer.appendChild(btn);
    });
    highlightFilterButtons();
  }

  function highlightFilterButtons() {
    if (!filtersContainer) return;
    filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
      const isActive = btn.dataset.filter === activeFilter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function filterProductsList() {
    let filtered = Array.isArray(allProducts) ? [...allProducts] : [];
    if (activeFilter !== 'all') {
      filtered = filtered.filter(product => (product.category || '').toLowerCase() === activeFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        const source = [
          product.name,
          product.description,
          ...(Array.isArray(product.features) ? product.features : (typeof product.features === 'string' ? product.features.split(/;\s*/g) : [])),
          ...(Array.isArray(product.caracteristicas) ? product.caracteristicas : [])
        ].join(' ');
        return source.toLowerCase().includes(term);
      });
    }
    return filtered;
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      setSearchTerm(event.target.value || '');
    });
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', (event) => {
      event.preventDefault();
      setSearchTerm('');
      searchInput?.focus();
    });
  }

  function renderCombos(list) {
    if (!combosGrid) return;
    combosGrid.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'produto-card combo-card';
      card.dataset.id = p.id;

      const imgDiv = document.createElement('div');
      imgDiv.className = 'produto-imagem';
      const badge = document.createElement('span');
      badge.className = 'kit-badge';
      badge.textContent = 'Kit';
      const picture = document.createElement('picture');
      const webpSrc = preferWebp(p.image);
      const img = document.createElement('img');
      img.src = p.image && p.image !== 'assets/images/img.logosuperiorplast.jpg' ? p.image : '';
      img.alt = p.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 320;
      img.height = 180;
      img.sizes = '(max-width: 768px) 90vw, 320px';
      img.dataset.imagemPadrao = p.image || '';
      img.dataset.imagemPadraoWebp = webpSrc || '';
      img.onerror = function() {
        this.style.display = 'block';
        this.src = 'assets/images/img.logosuperiorplast.jpg';
      };
      if (!img.src) {
        img.src = 'assets/images/img.logosuperiorplast.jpg';
      }
      picture.appendChild(img);
      imgDiv.appendChild(badge);
      imgDiv.appendChild(picture);

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

      // Se tiver cores, exibir botões
      let corBtnHtml = '';
      if (p.features) {
        let features = p.features;
        if (typeof features === 'string') {
          features = features.split(/;\s*/);
        }
        features.forEach(feature => {
          const trimmed = feature.trim();
          if (trimmed.toLowerCase().includes('preto') && trimmed.toLowerCase().includes('branco')) {
            corBtnHtml += '<div style="display:flex;gap:0.8rem;margin:0.8rem 0;">';
            ['Preto', 'Branco'].forEach(cor => {
              corBtnHtml += `<span class="cor-hover" data-cor="${cor}" data-produto-id="${p.id}" style="cursor:pointer;padding:0.5rem 1rem;background:#f0f0f0;border-radius:6px;border:2px solid #ddd;font-size:0.95rem;user-select:none;transition:all 0.2s;">${cor}</span>`;
            });
            corBtnHtml += '</div>';
          }
        });
      }
      if (corBtnHtml) desc.innerHTML += corBtnHtml;

      if (p.features) {
        let features = p.features;
        if (typeof features === 'string') {
          features = features.split(/;\s*/);
        }
        features.forEach(feature => {
          const trimmed = feature.trim();
          if (trimmed.toLowerCase().includes('resistencia')) {
            desc.innerHTML += `<div class="feature-resistencia">${trimmed}</div>`;
          } else if (!(trimmed.toLowerCase().includes('preto') && trimmed.toLowerCase().includes('branco'))) {
            desc.innerHTML += `<div>${trimmed}</div>`;
          }
        });
      }

      const actions = document.createElement('div');
      actions.className = 'produto-actions';

      const a = document.createElement('a');
      a.className = 'btn btn-whatsapp';
      a.target = '_blank';
      const message = `${waGreeting} Tenho interesse no ${p.name} ${p.price}. Como faço para comprar?`;
      a.href = getWhatsAppLink(message);
      a.setAttribute('aria-label', `Comprar ${p.name} via WhatsApp`);
      const icon = document.createElement('i');
      icon.className = 'fab fa-whatsapp';
      const span = document.createElement('span');
      span.textContent = 'Comprar via WhatsApp';
      a.appendChild(icon);
      a.appendChild(span);

      actions.appendChild(a);

      card.appendChild(imgDiv);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(paymentInfo);
      card.appendChild(desc);
      card.appendChild(actions);

      combosGrid.appendChild(card);
      applyMobileDescriptionToggle(desc);
    });

    // Eventos de cor para combos
    setTimeout(() => {
      combosGrid.querySelectorAll('.cor-hover').forEach(corSpan => {
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
      4: { 'Preto': 'assets/images/Mesa Monobloco Preta.jpg', 'Branco': 'assets/images/Mesa Monobloco Branca.jpg' },
      101: { 'Preto': 'assets/images/Conjunto Cadeira Bistrô Preta.jpg', 'Branco': 'assets/images/Conjunto Cadeira Bistrô Branca.jpg' },
      102: { 'Preto': 'assets/images/Conjunto Cadeira Poltrona Preta.jpg', 'Branco': 'assets/images/Conjunto Cadeira Poltrona Branca.jpg' },
      103: { 'Preto': 'assets/images/Conjunto Cadeira Robusta XL Preta.jpg', 'Branco': 'assets/images/Conjunto Cadeira Robusta XL Branca.jpg' }
    };
    return imagensPorCor[produtoId]?.[cor] || '';
  }

  renderFilterButtons();
  updateSearchHints();
  toggleClearButton();
  loadProducts();
  renderCombos(combos);
});
