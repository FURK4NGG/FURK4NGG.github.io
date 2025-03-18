document.addEventListener('DOMContentLoaded', () => {
  const userLang = navigator.language || navigator.userLanguage;

  // İçeriği dil tercihine göre yönlendirme
  if (userLang.startsWith('tr')) {
    window.location.href = '/home_tr'; // Türkçe içerik
  } else {
    window.location.href = '/home_en'; // İngilizce içerik
  }
});
