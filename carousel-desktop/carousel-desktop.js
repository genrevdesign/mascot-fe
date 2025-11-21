// =====================================================
// DESKTOP CAROUSEL - NBA MASCOTS
// =====================================================

const teamMembers = [
  { name: "Rocky", role: "Denver Nuggets" },
  { name: "Benny the Bull", role: "Chicago Bulls" },
  { name: "Coyote", role: "San Antonio Spurs" },
  { name: "Go", role: "Phoenix Suns" },
  { name: "Clutch", role: "Houston Rockets" },
  { name: "Crunch", role: "Los Angeles Clippers" },
];

let desktopCarouselInitialized = false;

function initDesktopCarousel() {
  // Esegui solo su desktop
  if (window.innerWidth < 1024) {
    desktopCarouselInitialized = false;
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
  const track = document.querySelector(".carousel-track");

  if (!cards.length || !memberName || !memberRole || !track) {
    console.warn("Desktop carousel elements not found");
    return;
  }

  console.log("Initializing desktop carousel");

  let currentIndex = 0;
  let isAnimating = false;

  function updateCarousel(newIndex) {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (newIndex + cards.length) % cards.length;

    cards.forEach((card, i) => {
      const offset = (i - currentIndex + cards.length) % cards.length;

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
    });

    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    memberName.style.opacity = "0";
    memberRole.style.opacity = "0";

    setTimeout(() => {
      memberName.textContent = teamMembers[currentIndex].name;
      memberRole.textContent = teamMembers[currentIndex].role;
      memberName.style.opacity = "1";
      memberRole.style.opacity = "1";
    }, 300);

    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  // Event Listeners
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
        updateCarousel(i);
      });
    });
  }

  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      updateCarousel(i);
    });
  });

  // Keyboard navigation
  const handleKeydown = (e) => {
    if (window.innerWidth < 1024) return;
    if (e.key === "ArrowLeft") {
      updateCarousel(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      updateCarousel(currentIndex + 1);
    }
  };

  document.addEventListener("keydown", handleKeydown);

  // Touch/Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    if (window.innerWidth < 1024) return;
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    if (window.innerWidth < 1024) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };

  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
  }

  // Inizializza il carosello
  updateCarousel(0);
  desktopCarouselInitialized = true;
  console.log("Desktop carousel initialized successfully");
}

// Inizializza quando il DOM è pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDesktopCarousel);
} else {
  initDesktopCarousel();
}

// Re-inizializza su resize (da mobile a desktop)
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initDesktopCarousel();
  }, 250);
});