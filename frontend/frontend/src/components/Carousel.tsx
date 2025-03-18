import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/carousel.css";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const Carousel = <T,>({ items, renderItem }: CarouselProps<T>) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 3 : 1);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  if (items.length === 0) return <p className="text-center py-4">No events found.</p>;

  const totalItems = items.length;
  
  const nextSlide = () => {
    setDirection("right");
    setIndex((prev) => (prev + itemsPerPage) % totalItems);
  };

  const prevSlide = () => {
    setDirection("left");
    setIndex((prev) => (prev - itemsPerPage + totalItems) % totalItems);
  };

  // Update visibleItems to make the carousel circular
  const visibleItems = Array.from({ length: itemsPerPage }, (_, i) => {
    const idx = (index + i) % totalItems; // Ensure circular display with modulo
    return items[idx];
  });

  return (
    <div className="carousel-container">
      <button onClick={prevSlide} className="carousel-button left">◀</button>

      <div className="cards-container">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            className="event-cards"
            initial={{ x: direction === "right" ? 100 : -100, opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === "right" ? -100 : 100, opacity: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {visibleItems.map((item, i) => (
              <motion.div key={i} className="event-card" whileHover={{ scale: 1.03 }}>
                {renderItem(item)}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={nextSlide} className="carousel-button right">▶</button>
    </div>
  );
};

export default Carousel;
