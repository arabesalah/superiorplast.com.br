// utils.js - Funções utilitárias reutilizáveis

export function getWhatsAppLink(message, waNumber = '551991842811') {
  const encoded = encodeURIComponent(message);
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (isMobile) {
    return `https://wa.me/${waNumber}?text=${encoded}`;
  }
  return `https://web.whatsapp.com/send?phone=${waNumber}&text=${encoded}`;
}

export function preferWebp(src) {
  return src || '';
}

export function ehLogo(src = '') {
  return src.toLowerCase().includes('logosuperiorplast');
}
