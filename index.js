gsap.registerPlugin(ScrollTrigger);

// Pin the intro text section
ScrollTrigger.create({
  trigger: ".intro-wrapper",
  start: "top top",
  end: "bottom top",
  pin: ".text-align-center",
  pinSpacing: false
});

// Handling the scroll for the tabs
document.addEventListener("scroll", function () {
  let scrollPosition = window.scrollY;
  let windowHeight = window.innerHeight + 550; // +550 = increasing the scroll distance before each class changes
  let sections = document.querySelectorAll('.tabs_let-content');
  let videos = document.querySelectorAll('.tabs_video');
  let lastSectionIndex = sections.length - 1;

  sections.forEach((section, index) => {
    if (scrollPosition >= (index * windowHeight) && scrollPosition < ((index + 1) * windowHeight)) {
      section.classList.add('is-1');
      videos[index].classList.add('is-1');
    } else {
      // Remove is-1 class from all sections except the last one
      if (index !== lastSectionIndex) {
        section.classList.remove('is-1');
        videos[index].classList.remove('is-1');
      }
    }
  });

  // Keep is-1 class on the last section until user scrolls past it
  if (scrollPosition > (lastSectionIndex * windowHeight)) {
    sections[lastSectionIndex].classList.add('is-1');
    videos[lastSectionIndex].classList.add('is-1');
  } else {
    sections[lastSectionIndex].classList.remove('is-1');
    videos[lastSectionIndex].classList.remove('is-1');
  }
});