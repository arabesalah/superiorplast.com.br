document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const waNumber = '551991842811';
  const waGreeting = 'Olá, Tenho Interesse e queria mais Informações, por favor.';

  const container = document.getElementById('product-detail');
  if (!id || !container) {
    container.innerHTML = '<p>Produto não especificado.</p>';
    return;
  }

  async function fetchProduct() {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`);
      if (res.ok) return await res.json();
      throw new Error('API não disponível');
    } catch (err) {
      // fallback local
      try {
        const fallback = await fetch('assets/data/products.json');
        const list = await fallback.json();
        return list.find(p => String(p.id) === String(id));
      } catch (e) {
        return null;
      }
    }
  }

  function getWhatsAppLink(message) {
    const encoded = encodeURIComponent(message);
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    if (isMobile) return `https://wa.me/${waNumber}?text=${encoded}`;
    return `https://web.whatsapp.com/send?phone=${waNumber}&text=${encoded}`;
  }

  fetchProduct().then(p => {
    if (!p) {
      container.innerHTML = '<p>Produto não encontrado.</p>';
      return;
    }

    // Mapear imagens por cor para cada produto
    const imagensPorCor = {
      1: { 'Preto': 'assets/images/Cadeira Bistrô Preta.jpg', 'Branco': 'assets/images/Cadeira Bistrô Branca.jpg' },
      2: { 'Preto': 'assets/images/Cadeira Poltrona Preta.jpg', 'Branco': 'assets/images/Cadeira Poltrona Branca.jpg' },
      3: { 'Preto': 'assets/images/Cadeira Robusta XL Preta.jpg', 'Branco': 'assets/images/Cadeira Robusta XL Branca.jpg' },
      4: { 'Preto': 'assets/images/Mesa Monobloco Preta.jpg', 'Branco': 'assets/images/Mesa Monobloco Preta.jpg' }
    };

    container.innerHTML = `
      <div class="produto-card" style="display:flex;gap:3rem;align-items:flex-start;padding:2rem;">
        <div class="produto-imagem" style="flex:1;min-width:360px;height:360px;border-radius:12px;overflow:hidden;">
          <img id="produto-img" src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;"/>
        </div>
        <div style="flex:1.3;display:flex;flex-direction:column;justify-content:flex-start;">
          <h2 style="color:var(--primary-color);font-size:2.2rem;margin-bottom:0.8rem;line-height:1.3;">${p.name}</h2>
          <p class="preco" style="font-size:2.2rem;font-weight:900;margin:0.5rem 0 0.3rem 0;color:#25D366;">${p.price}</p>
          <p style="font-size:0.95rem;color:var(--text-light);margin:0 0 1.5rem 0;font-style:italic;">Para mais informações e condições de pagamento entre em contato conosco</p>
          
          <div style="margin-bottom:1.5rem;padding:1.2rem;background:#f8f8f8;border-radius:8px;border-left:4px solid var(--secondary-color);">
            <p style="font-size:1.2rem;color:var(--text-dark);line-height:1.7;margin:0;">${p.description || ''}</p>
          </div>
          
          <div style="margin-bottom:2rem;">
            <p style="font-size:1.3rem;font-weight:700;color:var(--primary-color);margin-bottom:1rem;">Características:</p>
            <div style="font-size:1.1rem;color:var(--text-dark);line-height:2;padding-left:1rem;">
              ${(p.features||'').split(';').map(f => f.trim()).filter(f => f).map(f => `<div style="margin-bottom:0.5rem;">✓ ${f}</div>`).join('')}
            </div>
          </div>

          <!-- Seletor de Cor -->
          <div style="margin:2rem 0;padding:1.5rem;background:#f0f0f0;border-radius:8px;">
            <label style="display:block;font-size:1.1rem;font-weight:700;color:var(--primary-color);margin-bottom:1rem;">Selecione a Cor:</label>
            <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
              <label style="display:flex;align-items:center;cursor:pointer;gap:0.8rem;padding:0.8rem 1.2rem;background:white;border:2px solid #ddd;border-radius:8px;transition:all 0.3s;user-select:none;">
                <input type="radio" name="cor" value="Preto" style="cursor:pointer;width:18px;height:18px;"/>
                <div style="display:flex;align-items:center;gap:0.6rem;">
                  <div style="width:24px;height:24px;background:#000;border-radius:50%;border:2px solid #ccc;"></div>
                  <span style="font-weight:600;color:var(--text-dark);">Preto</span>
                </div>
              </label>
              <label style="display:flex;align-items:center;cursor:pointer;gap:0.8rem;padding:0.8rem 1.2rem;background:white;border:2px solid #ddd;border-radius:8px;transition:all 0.3s;user-select:none;">
                <input type="radio" name="cor" value="Branco" style="cursor:pointer;width:18px;height:18px;"/>
                <div style="display:flex;align-items:center;gap:0.6rem;">
                  <div style="width:24px;height:24px;background:#fff;border-radius:50%;border:2px solid #999;"></div>
                  <span style="font-weight:600;color:var(--text-dark);">Branco</span>
                </div>
              </label>
            </div>
          </div>
          
          <div style="margin-top:2rem;">
            <a id="whatsapp-btn" class="btn btn-whatsapp" href="#" target="_blank" style="padding:14px 24px;font-size:1.1rem;border-radius:12px;cursor:pointer;">
              <i class="fab fa-whatsapp"></i>
              <span>Comprar via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // Atualizar o link do WhatsApp quando selecionar cor
    const corRadios = document.querySelectorAll('input[name="cor"]');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const produtoImg = document.getElementById('produto-img');

    function updateWhatsAppLink() {
      const cor = document.querySelector('input[name="cor"]:checked')?.value || '';
      let mensagem = waGreeting + ' Tenho interesse no ' + p.name + ' ' + p.price;
      if (cor) mensagem += ' (Cor: ' + cor + ')';
      mensagem += '. Como faço para comprar?';
      whatsappBtn.href = getWhatsAppLink(mensagem);
      
      // Atualizar imagem quando cor muda
      if (cor && imagensPorCor[p.id] && imagensPorCor[p.id][cor]) {
        produtoImg.src = imagensPorCor[p.id][cor];
      }
    }

    corRadios.forEach(radio => {
      radio.addEventListener('change', updateWhatsAppLink);
    });
  });
});
