import react, { useState } from "react";

export default function useCardSlider(length) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null); // "left" | "right"
  const [phase, setPhase] = useState(null);        // "out" | "in" | null

  const goLeft = () => {
    setDirection("left");
    setPhase("out");
  };

  const goRight = () => {
    setDirection("right");
    setPhase("out");
  };

  const onAnimationEnd = () => {
    if (phase === "out") {
      const nextIndex =
        direction === "left"
          ? (index <= 0 ? length - 1 : index - 1)
          : (index === length - 1 ? 0 : index + 1);

      setIndex(nextIndex);
      setPhase("in");
    } else if (phase === "in") {
      setPhase(null);
      setDirection(null);
    }
  };

  return {
    index,
    animationClass: phase ? `slide-${direction}-${phase}` : "",
    goLeft,
    goRight,
    onAnimationEnd
  };
}