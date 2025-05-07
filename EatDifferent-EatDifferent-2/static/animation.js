gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(
  ".cards-wrap",
  {
    x: -50,
    opacity: 0,
  },
  {
    scrollTrigger: {
      trigger: "cards-wrap",
      start: "topx`x",
    },
    x: 0,
    opacity: 1,
    duration: 1.5,
  }
);
