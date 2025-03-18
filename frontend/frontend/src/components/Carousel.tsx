import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const Carousel = <T,>({ items, renderItem }: CarouselProps<T>) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  if (items.length === 0) return <p className="text-center py-4">No events found.</p>;

  const itemsPerPage = window.innerWidth >= 768 ? 3 : 1;
  const totalItems = items.length;

  const nextSlide = () => {
    setDirection("right");
    setIndex((prev) => (prev + 3) % totalItems);
  };

  const prevSlide = () => {
    setDirection("left");
    setIndex((prev) => (prev - 3 + totalItems) % totalItems);
  };

  // מעגליות - אם מגיעים לסוף, נמשיך מההתחלה
  const visibleItems = [
    ...items,
    ...items
  ].slice(index, index + itemsPerPage);

  return (
    <div className="1st in carousel">
      <button onClick={prevSlide} className="carousel buttonL">⬅️</button>

      <div className="cards-container">
        <AnimatePresence initial={false} mode="wait">
          <motion.div key={index} className="event-cards motion.div" 
          initial={{ x: direction === "right" ? 100 : -100, opacity: 0.8 }}
          animate={{ x: 0, opacity: 1 }} exit={{ x: direction === "right" ? -100 : 100, opacity: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}>
            {visibleItems.map((item, i) => (
              <motion.div key={i} className="event-card motion.div hover" whileHover={{ scale: 1.03 }}>
                {renderItem(item)}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <button onClick={nextSlide} className="carousel buttonR">➡️</button>
    </div>
  );
};

export default Carousel;