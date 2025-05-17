document.addEventListener('DOMContentLoaded', () => {
  const userLang = navigator.language || navigator.userLanguage;

  // İçeriği dil tercihine göre yönlendirme
  if (userLang.startsWith('tr')) {
    window.location.href = 'https://furk4ngg.me'; // Türkçe içerik
  } else {
    window.location.href = 'https://furk4ngg.me'; // İngilizce içerik
  }
});
