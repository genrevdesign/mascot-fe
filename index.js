import EmblaCarousel from "https://esm.sh/embla-carousel@8.3.0";
import { addPrevNextBtnsClickHandlers } from "./embla-carousel/EmblaCarouselArrowButtons.js";

const OPTIONS = { loop: false };

const emblaNode = document.querySelector(".embla");

if (!emblaNode) {
  console.warn("Embla root element not found");
} else {
  const viewportNode = emblaNode.querySelector(".embla__viewport");
  const prevBtn = emblaNode.querySelector(".embla__button--prev");
  const nextBtn = emblaNode.querySelector(".embla__button--next");

  if (!viewportNode) {
    console.error("Embla viewport not found");
  } else {
    const emblaApi = EmblaCarousel(viewportNode, OPTIONS);

    const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
      emblaApi,
      prevBtn,
      nextBtn
    );

    emblaApi.on("destroy", removePrevNextBtnsClickHandlers);

    console.log("Event listeners attached");
  }
}
