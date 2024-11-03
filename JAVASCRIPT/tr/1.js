/*IMAGE CHANGER*/
let currentIndex = 0;
const images = document.querySelectorAll('#photo img');

function switchPhoto() {
    // Hide the current image by removing 'visible'
    images[currentIndex].classList.remove('visible');

    // Increment the index and loop back to the first image after the last one
    currentIndex = (currentIndex + 1) % images.length;

    // Show the next image by adding 'visible'
    images[currentIndex].classList.add('visible');
}

// Initially set the first image as visible
images[currentIndex].classList.add('visible');


/*SCROLL REVEALING*/
document.addEventListener('DOMContentLoaded', () => {
  const textContainer = document.getElementById('animatedTextContainer');
  const text = "18 yaşında Bilgisayar Mühendisliği okuyan bir üniversite öğrencisiyim. 2020 yılından bu yana kendimi en çok Robotik Kodlama, Mobil Uygulama Geliştirme, 2D/3D Oyun Yapımı, Web Sitesi Oluşturma, Siber Güvenlik ve Yapay Zeka Komut İstemi Mühendisliği başta olmak üzere back-end departmanlarında geliştirdim. Teknofest Yarışmalarına ve TÜBİTAK projelerine de katıldım. Şu anda yapay zeka ve IoT ile ilgili projeler üzerinde çalışıyorum. İnsanların yaşamlarını olumlu yönde etkileyebilecek ve topluma katkıda bulunabilecek yenilikçi çözümler yaratma konusunda tutkuluyum ve insanlığa hizmet eden yeni fikirleri keşfetmeye her zaman açığım.";
  
  // Split text into words and wrap each word in a span
  const words = text.split(' ').map(word => {
    const span = document.createElement('span');
    span.textContent = word;
    span.className = 'word';
    return span;
  });

  // Append words to the text container
  words.forEach(word => textContainer.appendChild(word));
});

document.addEventListener('scroll', () => {
  const words = document.querySelectorAll('.word');
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const totalHeight = document.body.scrollHeight;
  
  const scrollPercent = scrollPosition*4.7 / (totalHeight - windowHeight);
  
  words.forEach((word, index) => {
    const wordOffset = index / words.length;
    const opacity = Math.min(Math.max((scrollPercent - wordOffset) * 2, 0), 1);
    word.style.color = `rgba(0, 0, 0, ${opacity})`;
  });
});


/*LAZY LOADING*/
document.addEventListener("DOMContentLoaded", function() {
    const lazyLoadImages = document.querySelectorAll("img.lazy-load");

    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute("data-src");
                    img.removeAttribute("data-src");
                    img.classList.remove("lazy-load");
                    observer.unobserve(img);
                }
            });
        });

        lazyLoadImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that do not support IntersectionObserver
        const loadImages = () => {
            lazyLoadImages.forEach(img => {
                if (img.getBoundingClientRect().top < window.innerHeight && img.getBoundingClientRect().bottom > 0 && getComputedStyle(img).display !== "none") {
                    img.src = img.getAttribute("data-src");
                    img.removeAttribute("data-src");
                    img.classList.remove("lazy-load");
                }
            });
        };

        loadImages();
        window.addEventListener("scroll", loadImages);
        window.addEventListener("resize", loadImages);
    }
});


/*SAVE DATA AND RUN OFFLINE*/
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}


/*TO-TOP BUTTON REVEALING*/
const toTop = document.querySelector(".to-top");
const trandingSlideContent = document.querySelector(".tranding-slide-content");

window.addEventListener("scroll", () => {
  const trandingSlideRect = trandingSlideContent.getBoundingClientRect();
  
  // Divin ortasını hesapla
  const trandingSlideMiddle = trandingSlideRect.top + (trandingSlideRect.height / 2);
  
  // Sayfanın kaydırma yüksekliği
  const scrollPosition = window.scrollY + window.innerHeight;

  // Eğer scroll pozisyonu divin ortasını geçerse butonu göster
  if (scrollPosition > trandingSlideMiddle + window.scrollY) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});

/*when the window is reloading or loading*/
window.addEventListener('load', function() {
  const targetElement = document.getElementById('container_1');
  targetElement.scrollIntoView();
  const sidebarCheckbox = document.getElementById('sidebar-active');
  if (sidebarCheckbox.checked) {sidebarCheckbox.checked = false;}
});


/*LOADING SCREEN*/
gsap.fromTo(
  ".loading_page",
  { opacity: 1 },
  {
    opacity: 0,
    display: "none",
    duration: 1.5,
    delay: 3.5,
  }
);

gsap.fromTo(
  ".logo_name",
  {
    y: 50,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 2,
    delay: 0.5,
  }
);


/*DARK MODE*/
const options = {
  bottom: '32px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '15px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: true, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: true // default: true
}


/*GALLERY IMAGES*/
var TrandingSlider = new Swiper('.tranding-slider', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2.5,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});


/*SMOOTH SCROLL FUNCTION*/
document.addEventListener("DOMContentLoaded", function() {
    // Tüm anchor linklerini seç
    const links = document.querySelectorAll('a[href^="#"]');

    // Tıklama olaylarını dinle
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Varsayılan davranışı engelle (URL değişimi)

            // Hedef elementi seç
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Smooth scroll işlemini gerçekleştir
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});


/*ANIMATED TEXT*/
const dynamicText = document.querySelector(".h1 span");
const words = ["Geliştiriciyim", "Sporcuyum", "Müzisyenim"];

// Variables to track the position and deletion status of the word
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);
    dynamicText.textContent = currentChar;
    dynamicText.classList.add("stop-blinking");

    if (!isDeleting && charIndex < currentWord.length) {
        // If condition is true, type the next character
        charIndex++;
        setTimeout(typeEffect, 200);
    } else if (isDeleting && charIndex > 0) {
        // If condition is true, remove the previous character
        charIndex--;
        setTimeout(typeEffect, 100);
    } else {
        // If word is deleted then switch to the next word
        isDeleting = !isDeleting;
        dynamicText.classList.remove("stop-blinking");
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
        setTimeout(typeEffect, 1200);
    }
}

typeEffect();

const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

window.addEventListener("mouseout", function (e) {
  if (!document.body.contains(e.relatedTarget)) {
    // Daireleri gizle
    circles.forEach((circle) => {
      circle.style.visibility = "hidden"; // veya display: none
    });
  }
});

//When the cursor came in the page make visible the circles
window.addEventListener("mouseover", function (e) {
  circles.forEach((circle) => {
    circle.style.visibility = "visible"; // veya display: block
  });
});


/*CURSOR*/
const colors = ["#DCFFB7","#CBFFA9","#D0F5BE","#C3EDC0","#C8E4B2","#D9EDBF","#CDF2CA","#CDF2CA","#C3E5AE","#C7E9B0","#CCD6A6","#B3C99C","#A4BC92","#99B080","#789461","#527853","#4F6F52","#436850","#4F6F52","#294B29","#1A4D2E","#114232"];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 9 + "px";
    circle.style.top = y - 9 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
  requestAnimationFrame(animateCircles);
}

animateCircles();

/*DISABLE COPY-PASTE*/
const disabledKeys = ["c", "C", "x", "J", "u", "I"]; // keys that will be disabled
  const showAlert = e => {
    e.preventDefault(); // preventing its default behaviour
    return alert("Üzgünüz, kaynak kodlarını bu şekilde görüntüleyemez veya kopyalayamazsınız!");
  }
  document.addEventListener("contextmenu", e => {
    showAlert(e); // calling showAlert() function on mouse right click
  });
  document.addEventListener("keydown", e => {
    // calling showAlert() function, if the pressed key matched to disabled keys
    if((e.ctrlKey && disabledKeys.includes(e.key)) || e.key === "F12") {
      showAlert(e);
    }
  });
