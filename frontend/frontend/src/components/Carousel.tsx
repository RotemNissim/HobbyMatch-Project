import React, { useState } from "react";
import { motion } from "framer-motion";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const Carousel = <T,>({ items, renderItem }: CarouselProps<T>) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const nextSlide = () => {
    setDirection("right");
    setIndex((prev) => (prev + 3) % items.length);
  };

  const prevSlide = () => {
    setDirection("left");
    setIndex((prev) => (prev - 3 + items.length) % items.length);
  };

  const visibleItems = [
    items[index % items.length],
    items[(index + 1) % items.length],
    items[(index + 2) % items.length],
  ];

  return (
    <div className="carousel-container relative flex items-center justify-center overflow-hidden w-full">
      <button onClick={prevSlide} className="nav-button left-nav absolute left-0 z-10">
        ⬅️
      </button>
      <button onClick={nextSlide} className="nav-button right-nav absolute right-0 z-10">
        ➡️
      </button>

      <div className="event-cards-container w-full flex justify-center overflow-hidden">
        <motion.div
          key={index}
          className="event-cards flex gap-4"
          initial={{ x: direction === "right" ? 100 : -100, opacity: 0.8 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === "right" ? -100 : 100, opacity: 0.8 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {visibleItems.map((item, i) => (
            <motion.div
              key={i}
              className="event-card w-1/3 bg-white shadow-md p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              {renderItem(item)}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Carousel;
