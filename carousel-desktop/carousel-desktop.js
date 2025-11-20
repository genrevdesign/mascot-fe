// =====================================================
// DESKTOP CAROUSEL - TEAM MEMBERS (WCAG & Fluid)
// =====================================================

const teamMembers = [
  { name: "Emily Kim", role: "Founder" },
  { name: "Michael Steward", role: "Creative Director" },
  { name: "Emma Rodriguez", role: "Lead Developer" },
  { name: "Julia Gimmel", role: "UX Designer" },
  { name: "Lisa Anderson", role: "Marketing Manager" },
  { name: "James Wilson", role: "Product Manager" },
];

let desktopCarouselInitialized = false;

function initDesktopCarousel() {
  const isDesktop = window.innerWidth >= 1024;
  
  // Condizione per de-inizializzare/non inizializzare su mobile
  if (!isDesktop) {
    // Reset dello stato se si passa da desktop a mobile
    if (desktopCarouselInitialized) {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      desktopCarouselInitialized = false;
      console.log("Desktop carousel de-initialized");
    }
    return;
  }

  // Non reinizializzare se già fatto
  if (desktopCarouselInitialized) return;

  const cards = document.querySelectorAll(".carousel-card");
  const dots = document.querySelectorAll(".carousel-dot");
  const memberName = document.querySelector(".member-name");
  const memberRole = document.querySelector(".member-role");
  const leftArrow = document.querySelector(".carousel-nav-arrow.left");
  const rightArrow = document.querySelector(".carousel-nav-arrow.right");

  if (!cards.length || !memberName || !memberRole || !leftArrow || !rightArrow) {
    console.warn("Desktop carousel elements not found");
    return;
  }

  console.log("Initializing desktop carousel");

  let currentIndex = 0;
  let isAnimating = false;

  // Tempo di animazione CSS (deve corrispondere alla transizione CSS)
  const CSS_TRANSITION_TIME = 500; // Esempio: 500ms
  const TEXT_FADE_TIME = 200; // Tempo per dissolvenza del testo

  function updateMemberInfo(index) {
    memberName.style.opacity = "0";
    memberRole.style.opacity = "0";
    
    // Attendi la dissolvenza in uscita (TEXT_FADE_TIME)
    setTimeout(() => {
      memberName.textContent = teamMembers[index].name;
      memberRole.textContent = teamMembers[index].role;
      memberName.style.opacity = "1";
      memberRole.style.opacity = "1";
    }, TEXT_FADE_TIME);
  }

  function handleCardFocus(card, isCenter) {
    // Rende solo la carta centrale navigabile con focus e cliccabile
    if (isCenter) {
        card.setAttribute("tabindex", "0");
        card.removeAttribute("aria-hidden");
        // Aggiungi un gestore click per la carta centrale per un'interazione chiara
        // (il click era già gestito in fondo, ma questo chiarisce l'intento)
    } else {
        card.setAttribute("tabindex", "-1");
        card.setAttribute("aria-hidden", "true"); // Per elementi fuori schermo o non attivi
    }
  }

  function updateAriaLabels() {
    // Aggiorna aria-label per le frecce di navigazione
    leftArrow.setAttribute("aria-label", `Membro precedente: ${teamMembers[(currentIndex - 1 + cards.length) % cards.length].name}`);
    rightArrow.setAttribute("aria-label", `Membro successivo: ${teamMembers[(currentIndex + 1) % cards.length].name}`);
  }

  function updateCarousel(newIndex, fromClick = false) {
    if (isAnimating) return;
    isAnimating = true;

    const prevIndex = currentIndex;
    currentIndex = (newIndex + cards.length) % cards.length;

    // Se l'indice non è cambiato, non fare nulla (a meno che non sia un click esplicito)
    if (currentIndex === prevIndex && !fromClick) {
        isAnimating = false;
        return;
    }

    cards.forEach((card, i) => {
      const offset = (i - currentIndex + cards.length) % cards.length;
      let isCenter = false;

      // Logica di assegnazione classi
      card.classList.remove(
        "center",
        "left-1",
        "left-2",
        "right-1",
        "right-2",
        "hidden"
      );

      if (offset === 0) {
        card.classList.add("center");
        isCenter = true;
      } else if (offset === 1) {
        card.classList.add("right-1");
      } else if (offset === 2) {
        card.classList.add("right-2");
      } else if (offset === cards.length - 1) {
        card.classList.add("left-1");
      } else if (offset === cards.length - 2) {
        card.classList.add("left-2");
      } else {
        card.classList.add("hidden");
      }
      
      handleCardFocus(card, isCenter);
    });

    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
        // Miglioramento ARIA per i puntini di navigazione
        dot.setAttribute("aria-label", `Visualizza ${teamMembers[i].name}`);
        dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");
      });
    }

    // Aggiorna info membro solo se l'indice è cambiato
    if (currentIndex !== prevIndex) {
        updateMemberInfo(currentIndex);
    }
    
    // Aggiorna etichette ARIA delle frecce
    updateAriaLabels();

    // Rimuovi lo stato di animazione solo dopo che le transizioni CSS sono finite
    setTimeout(() => {
      isAnimating = false;
      // Sposta il focus sulla carta centrale per l'accessibilità da tastiera
      cards[currentIndex].focus(); 
    }, Math.max(CSS_TRANSITION_TIME, TEXT_FADE_TIME * 2)); // Attendi il più lungo tra CSS e dissolvenza testo
  }

  // === Event Listeners ===

  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      updateCarousel(currentIndex - 1);
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      updateCarousel(currentIndex + 1);
    });
  }

  if (dots.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        updateCarousel(i, true); // Usa 'true' per forzare l'aggiornamento se si clicca sul dot della carta corrente
      });
    });
  }

  cards.forEach((card, i) => {
    // Permetti al click di aggiornare il carosello, indipendentemente dalla posizione
    card.addEventListener("click", () => {
      updateCarousel(i, true);
    });
    
    // Aggiungi un listener per il focus sulla carta, per navigare con TAB
    card.addEventListener('focus', (e) => {
        // Se si arriva con il TAB, aggiorna il carosello all'indice della carta
        if (i !== currentIndex) {
            updateCarousel(i);
        }
    });
  });


  // === Navigazione da Tastiera (su tutto il documento) ===
  const handleKeydown = (e) => {
    if (!isDesktop) return; 
    
    // Verifica che l'elemento attualmente focalizzato non sia un campo di input
    if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
        return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault(); // Previene lo scorrimento della pagina
      updateCarousel(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault(); // Previene lo scorrimento della pagina
      updateCarousel(currentIndex + 1);
    }
  };

  document.addEventListener("keydown", handleKeydown);

  // === Supporto Touch/Swipe ===
  let touchStartX = 0;
  let touchEndX = 0;
  
  // Aggiungi un listener sul carosello stesso (o un contenitore) invece che su document, se possibile, per circoscrivere l'azione
  // Uso document per compatibilità con il tuo codice originale
  
  const handleTouchStart = (e) => {
    if (!isDesktop || isAnimating) return; 
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    if (!isDesktop || isAnimating) return; 
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };
  
  // Rimuovo e riaggiungo i listener per prevenire duplicati se la funzione viene chiamata su resize
  document.removeEventListener("touchstart", handleTouchStart);
  document.removeEventListener("touchend", handleTouchEnd);

  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1); // Swipe verso sinistra (avanti)
      } else {
        updateCarousel(currentIndex - 1); // Swipe verso destra (indietro)
      }
    }
  }

  // Inizializza il carosello
  updateCarousel(0);
  desktopCarouselInitialized = true;
  console.log("Desktop carousel initialized successfully");
}

// === Gestione Inizializzazione e Resize ===

// Inizializza quando il DOM è pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDesktopCarousel);
} else {
  initDesktopCarousel();
}

// Re-inizializza/De-inizializza su resize (da mobile a desktop e viceversa)
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initDesktopCarousel();
  }, 250);
});