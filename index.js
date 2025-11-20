import EmblaCarousel from "https://esm.sh/embla-carousel@8.3.0";
import { addPrevNextBtnsClickHandlers } from "./embla-carousel/EmblaCarouselArrowButtons.js";

// --- 1. CONFIGURAZIONE DEL CAROSELLO ---
const OPTIONS = { 
  loop: false,
  duration: 30, 
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// --- 2. LOGICA DI INIZIALIZZAZIONE ---
(function initializeEmbla() {
  const emblaNode = document.querySelector(".embla");

  if (!emblaNode) {
    console.warn("Embla root element not found. Initialization skipped.");
    return;
  }

  const viewportNode = emblaNode.querySelector(".embla__viewport");
  if (!viewportNode) {
    console.error("Embla viewport not found: cannot initialize.");
    return;
  }

  // TROVA GLI ELEMENTI INTERNI
  const prevBtn = emblaNode.querySelector(".embla__button--prev");
  const nextBtn = emblaNode.querySelector(".embla__button--next");

  // INIZIALIZZA L'API EMBLA
  const emblaApi = EmblaCarousel(viewportNode, OPTIONS);
  
  // AGGIUNGI I LISTENER DEI PULSANTI DI NAVIGAZIONE
  const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
    emblaApi,
    prevBtn,
    nextBtn
  );

  // --- 3. LOGICA PERSONALIZZATA DI SCROLL (CON OTTIMIZZAZIONE) ---
  let lastScrollY = window.scrollY; 
  const SCROLL_THRESHOLD = 10; 
  let isScrolling = false; // Flag per il throttling

  const handleScrollLogic = () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    // Controlla se il carosello è in vista
    const emblaRect = emblaNode.getBoundingClientRect();
    const isVisible = emblaRect.top < window.innerHeight && emblaRect.bottom > 0;
    
    // Aggiorna la posizione qui
    lastScrollY = currentScrollY; 
    isScrolling = false; // Resetta il flag per permettere il prossimo frame
    
    if (!isVisible) return; 

    // Scorrimento verso il basso (Down Scroll)
    if (scrollDelta > SCROLL_THRESHOLD) {
      emblaApi.scrollNext(); 
    } 
    
    // Scorrimento verso l'alto (Up Scroll)
    else if (scrollDelta < -SCROLL_THRESHOLD) {
      emblaApi.scrollTo(0); 
    }
  };

  const handleWindowScroll = () => {
    if (!isScrolling) {
      // Usa requestAnimationFrame per limitare l'esecuzione a un frame
      window.requestAnimationFrame(handleScrollLogic);
      isScrolling = true;
    }
  };

  // 4. AGGIUNGI IL LISTENER DELLO SCROLL 
  window.addEventListener('scroll', handleWindowScroll);
  console.log("Embla initialized and listeners attached.");

  // 5. GESTIONE DELLA PULIZIA
  emblaApi.on("destroy", () => {
    removePrevNextBtnsClickHandlers(); 
    window.removeEventListener('scroll', handleWindowScroll); 
    console.log("Embla destroyed and all listeners removed.");
  });

})(); // Fine della funzione di inizializzazione