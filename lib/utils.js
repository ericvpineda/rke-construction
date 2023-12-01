import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function classNames(...inputs) {
  return twMerge(clsx(inputs))
}

export function toggleZoom (e, val, windowY) {
  const carousel = document.querySelector("#carousel");
  const searchBar = document.querySelector("#searchBar");
  const verticalScroll = document.querySelector("#verticalScroll");
  const arrowLeft = document.querySelector(".carousel-control-prev");
  const arrowRight = document.querySelector(".carousel-control-next");

  // Check if left or right arrow clicked
  if (
    arrowRight &&
    (e.target == arrowRight.children[0] || e.target == arrowRight)
  ) {
    setSelectedIndex((prev) => prev + 1);
  } else if (
    arrowLeft &&
    (e.target == arrowLeft.children[0] || e.target == arrowLeft)
  ) {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
  }
  // Hide carousel if carousel background clicked
  if (e.target.id == carousel.id) {
    carousel.classList.add("hidden");
    searchBar.classList.remove("hidden");
    verticalScroll.classList.remove("hidden");
    window.scrollTo({ top: windowY, left: 0, behavior: "instant" });

    // Show carousel
  } else if (carousel.classList.contains("hidden")) {
    carousel.classList.remove("hidden");
    searchBar.classList.add("hidden");
    verticalScroll.classList.add("hidden");
    // Set carousel to selected image
    setSelectedIndex(val);
    // Snap to image, then quickly allow arrow transitions
    setIsSlide(false);
    setTimeout(() => setIsSlide(true), 100);
  }
};