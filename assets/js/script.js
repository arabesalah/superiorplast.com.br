
// Importa frases do módulo navbarFrases.js
import { navbarFrases } from './navbarFrases.js';







const FRASES_SIMULTANEAS = 4;
// Prioridade de posições para as frases (esquerda/direita/cantos, centro por último)
const preferencia = [0, 1, 2, 3];
const FRASES_POSICOES = 10;
const FRASE_VISIVEL = 5000; // frase visível por mais tempo
const FRASE_FADE = 3000;    // fade mais lento
let frasesPosTimers = [];
let frasesPosIndices = [];

function iniciarFrasesNavbarIndependentes() {
    console.log('Função iniciarFrasesNavbarIndependentes chamada - mudanças aplicadas');
    const container = document.getElementById('navbar-frases-container');
    const navbar = document.getElementById('carousel-navbar');
    console.log('iniciarFrasesNavbarIndependentes chamada', container, navbar);
    if (!container || !navbar) return;
    container.innerHTML = '';
    const navbarRect = navbar.getBoundingClientRect();
    const isMobile = window.innerWidth <= 600;
    const fraseWidth = isMobile ? 180 : 320;
    const fraseHeight = isMobile ? 36 : 48;
    const padding = isMobile ? 6 : 16;
    const sideInset = isMobile ? 6 : 60;
    const centerBuffer = isMobile ? 10 : 120;
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
    const top1 = clamp(navbarRect.height * 0.2 - fraseHeight / 2, padding, navbarRect.height - fraseHeight - padding);
    const top2 = clamp(navbarRect.height * 0.8 - fraseHeight / 2, padding, navbarRect.height - fraseHeight - padding);
    const leftL = padding + sideInset / 2;
    const leftR = Math.max(padding, navbarRect.width - fraseWidth - padding - sideInset - centerBuffer);
    const posicoes = [
        {left: leftL, top: top1}, // Esquerda 1
        {left: leftL, top: top2}, // Esquerda 2
        {left: leftR, top: top1}, // Direita 1
        {left: leftR, top: top2}  // Direita 2
    ];
    // Limpa timers antigos
    frasesPosTimers.forEach(t => clearTimeout(t));
    frasesPosTimers = [];
    frasesPosIndices = [];
    // Seleciona frases e posições sem repetir
    let frasesUsadas = [];
    let posUsadas = [];
    let posicoesPrincipais = [0, 1, 2, 3]; // esquerda topo, direita topo, esquerda base, direita base
    for (let i = 0; i < FRASES_SIMULTANEAS; i++) {
        let fraseIdx;
        do {
            fraseIdx = Math.floor(Math.random() * navbarFrases.length);
        } while (frasesUsadas.includes(fraseIdx) && frasesUsadas.length < navbarFrases.length);
        frasesUsadas.push(fraseIdx);
        let posIdx = posicoesPrincipais[i % posicoesPrincipais.length];
        frasesPosIndices.push({fraseIdx, posIdx});
    }
    for (let i = 0; i < FRASES_SIMULTANEAS; i++) {
        exibirFrasePosicaoIndependente(i, container, posicoes);
    }
}

function exibirFrasePosicaoIndependente(i, container, posicoes) {
    // Remove frase anterior
    const oldDiv = container.querySelector(`.navbar-frase-destaque[data-pos='${i}']`);
    if (oldDiv) container.removeChild(oldDiv);
    // Exibe nova frase
    const {fraseIdx, posIdx} = frasesPosIndices[i];
    const frase = navbarFrases[fraseIdx];
    const pos = posicoes[posIdx];
    const div = document.createElement('div');
    div.className = 'navbar-frase-destaque';
    div.setAttribute('data-pos', i);
    div.textContent = frase;
    div.style.left = `${pos.left}px`;
    div.style.top = `${pos.top}px`;
    div.style.opacity = 0;
    div.style.transition = `opacity ${FRASE_FADE/1000}s`;
    setTimeout(() => {
        div.style.opacity = 1;
    }, 50);
    console.log('Adicionando frase ao DOM:', frase, pos);
    container.appendChild(div);
    // Timer para fade out e troca
    frasesPosTimers[i] = setTimeout(() => {
        div.style.transition = `opacity ${FRASE_FADE/1000}s`;
        div.style.opacity = 0;
        setTimeout(() => {
            // Sorteia nova frase e nova posição (sem sobrepor)
            let novaFraseIdx, novaPosIdx;
            let tent = 0;
            do {
                novaFraseIdx = Math.floor(Math.random() * navbarFrases.length);
            } while ((frasesPosIndices.some((f, idx) => idx !== i && f.fraseIdx === novaFraseIdx)) && tent++ < 20);
            tent = 0;
            // Prioriza lados, centro só se necessário
            novaPosIdx = preferencia[i % preferencia.length];
            // Garante que a nova posição não está sendo usada por outra frase
            frasesPosIndices[i] = {fraseIdx: novaFraseIdx, posIdx: novaPosIdx};
            exibirFrasePosicaoIndependente(i, container, posicoes);
        }, FRASE_FADE);
    }, FRASE_VISIVEL + i * 200);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(iniciarFrasesNavbarIndependentes, 500);

    // Efeito de shrink no topo ao rolar
    window.addEventListener('scroll', function() {
        var header = document.querySelector('header.header-topo');
        var navbar = document.querySelector('.navbar');
        var produtos = document.getElementById('produtos');
        if (!header || !navbar || !produtos) return;
        var produtosTop = produtos.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY > 40 && window.scrollY < produtosTop - 60) {
            header.classList.add('shrink');
        } else if (window.scrollY < 10) {
            header.classList.remove('shrink');
        }
    });

    // Botão voltar ao topo
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const toggleBackToTop = () => {
            backToTop.classList.toggle('is-visible', window.scrollY > 400);
        };
        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop();
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // Menu Header (hamburger + links)
    const hamburger = document.getElementById('hamburger');
    const menuTopo = document.querySelector('.menu-topo');
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    const sections = navLinks.map(link => document.getElementById(link.dataset.target)).filter(Boolean);

    if (hamburger && menuTopo) {
        hamburger.addEventListener('click', () => {
            const isOpen = menuTopo.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuTopo.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function setActiveNav() {
        const scrollPos = window.scrollY + 120;
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach((section, idx) => {
            if (!section) return;
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks[idx]?.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);
    setActiveNav();

    // FAQ accordion
    const faqItems = Array.from(document.querySelectorAll('.faq-item'));
    faqItems.forEach((item, idx) => {
        const heading = item.querySelector('h3');
        const body = item.querySelector('p');
        if (!heading || !body) return;
        if (idx === 0) item.classList.add('open');
        heading.addEventListener('click', () => {
            const isOpen = item.classList.toggle('open');
            body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : 0;
            heading.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        // set initial height if opened
        if (item.classList.contains('open')) {
            body.style.maxHeight = body.scrollHeight + 'px';
            heading.setAttribute('aria-expanded', 'true');
        } else {
            heading.setAttribute('aria-expanded', 'false');
        }
    });

    // Formulário de orçamento/contato
    const orcForm = document.getElementById('orcamentoForm');
    const btnOrcWhats = document.getElementById('btnOrcWhats');
    const btnOrcEmail = document.getElementById('btnOrcEmail');
    const telefonePadrao = '551991842811';
    const emailDestino = 'plastsuperior@gmail.com';

    const getField = (id) => document.getElementById(id)?.value.trim() || '';

    function montarMensagem() {
        const nome = getField('orc-nome');
        const whats = getField('orc-whats');
        const produto = getField('orc-produto') || 'Não informado';
        const mensagem = getField('orc-mensagem');
        if (!nome || !whats || !mensagem) {
            alert('Preencha nome, telefone/WhatsApp e mensagem.');
            return null;
        }
        return `Olá, meu nome é ${nome}.\nTelefone/WhatsApp: ${whats}.\nProduto de interesse: ${produto}.\nMensagem: ${mensagem}`;
    }

    function enviarWhats(e) {
        if (e) e.preventDefault();
        const msg = montarMensagem();
        if (!msg) return;
        const url = `https://wa.me/${telefonePadrao}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank', 'noopener');
    }

    function enviarEmail(e) {
        if (e) e.preventDefault();
        const msg = montarMensagem();
        if (!msg) return;
        const subject = encodeURIComponent('Orçamento - Superior Plast');
        const body = encodeURIComponent(msg);
        const url = `mailto:${emailDestino}?subject=${subject}&body=${body}`;
        window.location.href = url;
    }

    if (orcForm) {
        orcForm.addEventListener('submit', enviarWhats);
    }
    if (btnOrcWhats) {
        btnOrcWhats.addEventListener('click', enviarWhats);
    }
    if (btnOrcEmail) {
        btnOrcEmail.addEventListener('click', enviarEmail);
    }

    // Animação ao scroll
    // Carrossel automático na navbar
    iniciarCarrosselNavbar();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.produto-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
});

// Animação ao scroll
// Carrossel automático na navbar
function iniciarCarrosselNavbar() {
    const allImages = Array.from(document.querySelectorAll('.carousel-multi .carousel-image'));
    console.log('[DEBUG] iniciarCarrosselNavbar chamado. Quantidade de imagens:', allImages.length, allImages.map(img => img.src));
    if (allImages.length === 0) {
        console.warn('[DEBUG] Nenhuma imagem encontrada para o carrossel!');
        return;
    }
    let current = 0;
    function showOneImage() {
        allImages.forEach((img, i) => img.classList.remove('active'));
        allImages[current].classList.add('active');
        console.log('[DEBUG] Exibindo imagem do carrossel:', allImages[current].src);
        current = (current + 1) % allImages.length;
    }
    showOneImage();
    setInterval(showOneImage, 3000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[DEBUG] DOMContentLoaded: Chamando iniciarCarrosselNavbar');
        iniciarCarrosselNavbar();
    });
} else {
    console.log('[DEBUG] Script carregado: Chamando iniciarCarrosselNavbar');
    iniciarCarrosselNavbar();
}
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.produto-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});