// =====================================================
// MOBILE CAROUSEL - SWIPER CARDS
// =====================================================

let mobileSwiper = null;

function initMobileCarousel() {
  // Esegui solo su mobile
  if (window.innerWidth >= 1024) {
    // Distruggi Swiper se esiste e siamo su desktop
    if (mobileSwiper) {
      mobileSwiper.destroy(true, true);
      mobileSwiper = null;
    }
    return;
  }

  // Non reinizializzare se già esiste
  if (mobileSwiper) return;

  // Verifica che Swiper sia disponibile
  if (typeof Swiper === "undefined") {
    console.warn("Swiper library not loaded, retrying...");
    // Riprova dopo 100ms
    setTimeout(initMobileCarousel, 100);
    return;
  }

  const swiperElement = document.querySelector(".swiper-mascot");
  if (!swiperElement) {
    console.warn("Swiper element not found");
    return;
  }

  console.log("Initializing mobile carousel with Swiper");

  // Inizializza Swiper con l'effetto cards
  try {
    mobileSwiper = new Swiper(".swiper-mascot", {
      effect: "cards",
      grabCursor: true,
      cardsEffect: {
        perSlideOffset: 8,
        perSlideRotate: 2,
        rotate: true,
        slideShadows: true,
      },
    });
    console.log("Mobile carousel initialized successfully");
  } catch (error) {
    console.error("Error initializing Swiper:", error);
  }
}

// Funzione per gestire il caricamento
function waitForSwiper() {
  if (typeof Swiper !== "undefined") {
    initMobileCarousel();
  } else {
    setTimeout(waitForSwiper, 50);
  }
}

// Inizializza quando il DOM è pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForSwiper);
} else {
  waitForSwiper();
}

// Re-inizializza su resize (da desktop a mobile)
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initMobileCarousel();
  }, 250);
});
