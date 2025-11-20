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

  const prevBtn = emblaNode.querySelector(".embla__button--prev");
  const nextBtn = emblaNode.querySelector(".embla__button--next");

  // INIZIALIZZA L'API EMBLA
  const emblaApi = EmblaCarousel(viewportNode, OPTIONS);
  
  const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
    emblaApi,
    prevBtn,
    nextBtn
  );

  // --- 3. GESTIONE DEL BLOCCO SCROLL ---
  let isCarouselActive = false;
  let wheelTimeout = null;

  // Funzione per verificare se il carosello è centrato nella viewport
  const isCarouselCentered = () => {
    const emblaRect = emblaNode.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const emblaCenter = emblaRect.top + emblaRect.height / 2;
    const viewportCenter = windowHeight / 2;
    
    // Controlla se il centro del carosello è vicino al centro della viewport
    const threshold = 150; // pixels di tolleranza
    return Math.abs(emblaCenter - viewportCenter) < threshold;
  };

  // Gestisci lo scroll con la rotella
  const handleWheel = (e) => {
    const isCentered = isCarouselCentered();
    
    if (isCentered) {
      const delta = e.deltaY;
      const canScrollNext = emblaApi.canScrollNext();
      const canScrollPrev = emblaApi.canScrollPrev();
      
      // Se possiamo navigare nel carosello, blocca lo scroll verticale
      if ((delta > 0 && canScrollNext) || (delta < 0 && canScrollPrev)) {
        e.preventDefault();
        e.stopPropagation();
        
        isCarouselActive = true;
        
        clearTimeout(wheelTimeout);
        
        if (delta > 0) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollPrev();
        }
        
        // Resetta lo stato dopo un breve periodo
        wheelTimeout = setTimeout(() => {
          isCarouselActive = false;
        }, 300);
      }
      // Se non possiamo navigare, permetti lo scroll normale
      else {
        isCarouselActive = false;
      }
    }
  };

  // Gestisci touch per dispositivi mobili
  let touchStartY = 0;
  let touchStartX = 0;
  
  const handleTouchStart = (e) => {
    if (isCarouselCentered()) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }
  };
  
  const handleTouchMove = (e) => {
    if (!isCarouselCentered()) return;
    
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const diffY = touchStartY - touchY;
    const diffX = touchStartX - touchX;
    
    // Se il movimento è più orizzontale che verticale, lascia Embla gestire
    if (Math.abs(diffX) > Math.abs(diffY)) {
      return;
    }
    
    const canScrollNext = emblaApi.canScrollNext();
    const canScrollPrev = emblaApi.canScrollPrev();
    
    // Se possiamo navigare, blocca lo scroll verticale
    if ((diffY > 30 && canScrollNext) || (diffY < -30 && canScrollPrev)) {
      e.preventDefault();
      
      if (diffY > 30) {
        emblaApi.scrollNext();
        touchStartY = touchY; // Reset per evitare scroll multipli
      } else if (diffY < -30) {
        emblaApi.scrollPrev();
        touchStartY = touchY;
      }
    }
  };

  // 4. AGGIUNGI I LISTENER
  document.addEventListener('wheel', handleWheel, { passive: false });
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  
  console.log("Embla initialized and listeners attached.");

  // 5. GESTIONE DELLA PULIZIA
  emblaApi.on("destroy", () => {
    clearTimeout(wheelTimeout);
    removePrevNextBtnsClickHandlers(); 
    document.removeEventListener('wheel', handleWheel);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    console.log("Embla destroyed and all listeners removed.");
  });

})();