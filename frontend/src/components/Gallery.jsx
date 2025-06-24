import React, { useState, useMemo, useEffect, useRef } from "react";
import GalleryItem from "./GalleryItem";
import DetailOverlay from "./DetailOverlay";
import "../styles/Gallery.css"; 

const ANIMATION_DURATION = 400; // animation duration constant

// COMPONENT
// manages the main image gallery
const Gallery = ({ items, onResetApp, selectedItem, setSelectedItem }) => {
  const [displayedItems, setDisplayedItems] = useState(items); // currently displayed items 
  const [visibleItems, setVisibleItems] = useState(items); // a subset of displayedItems for transition effects
  const [activeCategory, setActiveCategory] = useState(null); // currently selected filter category

  const [galleryState, setGalleryState] = useState("initial"); // states for complex animation
  const [isAnimating, setIsAnimating] = useState(false); // to disable controls during animations

  const [showDetailLayers, setShowDetailLayers] = useState(false); // triggers the detail overlay
  const [areDetailLayersVisible, setAreDetailLayersVisible] = useState(false); // starts animation for the detail overlay

  const [scrollOffset, setScrollOffset] = useState(0); // scroll position for the gallery
  const galleryRef = useRef(null); // ref to the gallery for scroll

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))], [items]
  ); // to avoid recalculation


  // 1. detail view 
  // selecting an item to start the detail view
  const handleItemClick = (item) => {
    if (isAnimating || selectedItem) return;
    setSelectedItem(item);
  };

  // to fade out non-selected items for detail view
  useEffect(() => {
    if (selectedItem) {
      const timer = setTimeout(() => {
        setVisibleItems(items.filter((i) => i.id === selectedItem.id));
      }, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    } else {
      setVisibleItems(displayedItems);
    }
  }, [selectedItem, displayedItems, items]);

  // to prepare for the detail view animations
  useEffect(() => {
    if (showDetailLayers) {
      document.body.classList.add("is-detail-view");
    } else {
      document.body.classList.remove("is-detail-view");
    }
    return () => document.body.classList.remove("is-detail-view");
  }, [showDetailLayers]);

  // to wait for the zoom animation before showing the detail overlay
  useEffect(() => {
    let showTimer;
    if (selectedItem) {
      showTimer = setTimeout(() => setShowDetailLayers(true), 800);
    } else {
      setShowDetailLayers(false);
      setAreDetailLayersVisible(false);
    }
    return () => clearTimeout(showTimer);
  }, [selectedItem]);

  // delay, to make DetailOverlay animations based on css transition-delay run correctly!!
  useEffect(() => {
    let visibilityTimer;
    if (showDetailLayers) {
      visibilityTimer = setTimeout(() => setAreDetailLayersVisible(true), 50);
    }
    return () => clearTimeout(visibilityTimer);
  }, [showDetailLayers]);


  // 2. gallery view
  // routes category clicks to the correct handler (filter, switch, or reset)
  const handleCategoryClick = (category) => {
    resetScroll();
    if (isAnimating) return;
    if (category === activeCategory) handleReset();
    else if (activeCategory !== null) handleSwitchCategory(category);
    else handleFilter(category);
  };

  // animation for initial filtering
  const handleFilter = (category) => {
    setIsAnimating(true);
    setActiveCategory(category);
    setGalleryState("hiding"); // 1. hide non-matching items
    setTimeout(() => {
      setDisplayedItems(items.filter((item) => item.category === category));
      setGalleryState("reflowing"); // 2. reflow remaining items
      setTimeout(() => {
        setGalleryState("zoomed"); // 3. zoom into the new layout
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION);
  };

  // animation for switching between categories
  const handleSwitchCategory = (newCategory) => {
    setIsAnimating(true);
    setGalleryState("switching"); // 1. hide current category items
    setTimeout(() => {
      setActiveCategory(newCategory);
      setDisplayedItems(items.filter((item) => item.category === newCategory));
      setGalleryState("preparing-new"); // 2. show new items in zoomed layout
      setTimeout(() => {
        setGalleryState("zoomed");
        setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
      }, 50);
    }, ANIMATION_DURATION);
  };

  // animation for resetting filters
  const handleReset = () => {
    setIsAnimating(true);
    setGalleryState("resetting"); // 1. hide filtered items
    setTimeout(() => {
      setActiveCategory(null);
      setDisplayedItems(items);
      setGalleryState("snapping-back"); // 2. snap all items back to initial view
      setTimeout(() => {
        setGalleryState("initial");
        setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
      }, 50);
    }, ANIMATION_DURATION);
  };


  // 3. scroll animation for zoomed view
  useEffect(() => {
    const handleWheel = (event) => {
      if (galleryState !== "zoomed" || isAnimating || selectedItem) return;

      event.preventDefault();

      setScrollOffset((prevOffset) => {
        const delta = event.deltaY > 0 ? 1 : -1;
        const center = Math.floor(displayedItems.length / 2);
        const minScroll = -center;
        const maxScroll = displayedItems.length - center - 1;
        return Math.max(minScroll, Math.min(prevOffset + delta, maxScroll));
      });
    };

    const element = galleryRef.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
      return () => element.removeEventListener("wheel", handleWheel);
    }
  }, [galleryState, isAnimating, displayedItems.length, selectedItem]);

  const resetScroll = () => setScrollOffset(0);

  // booleans and classes for styling
  const isZoomed = ["zoomed", "switching", "preparing-new", "resetting"].includes(galleryState);
  const isDetailView = !!selectedItem;
  const galleryClasses = `gallery ${isZoomed ? "is-zoomed" : ""} ${isDetailView ? "is-detail-view" : ""} ${galleryState === "snapping-back" ? "no-transition" : ""}`;

  // constants for calculating the 3D layout
  const centerIndex = Math.floor(displayedItems.length / 2);
  const xStep = 200;
  const yStep = 80;

  return (
    <>
      {showDetailLayers && (
        <DetailOverlay
          isVisible={areDetailLayersVisible}
          selectedItem={selectedItem}
          onResetApp={onResetApp}
          itemWidth={selectedItem.width}
        />
      )}

      <div className={galleryClasses} ref={galleryRef}>
        {visibleItems.map((item, index) => {
          // positioning for the zoomed carousel view
          const originalIndex = displayedItems.findIndex((dItem) => dItem.id === item.id);
          const offsetIndex = originalIndex - centerIndex - scrollOffset;
          const xOffset = offsetIndex * xStep;
          const yOffset = offsetIndex * -yStep;

          // animation state flags for child items
          const shouldHide = ["switching", "resetting"].includes(galleryState) || (galleryState === "hiding" && item.category !== activeCategory);
          const isAppearing = galleryState === "preparing-new" || galleryState === "snapping-back";
          const isSelected = selectedItem?.id === item.id;
          const isFadingOut = selectedItem && !isSelected;

          return (
            <GalleryItem
              key={item.id}
              onClick={() => handleItemClick(item)}
              width={item.width}
              height={item.height}
              imageUrl={item.imageUrl}
              category={item.category}
              xOffset={xOffset}
              yOffset={yOffset}
              zIndex={isSelected ? 1001 : displayedItems.length - index}
              shouldHide={shouldHide}
              isAppearing={isAppearing}
              isSelected={isSelected}
              isFadingOut={isFadingOut}
              showDetailLayers={isSelected && showDetailLayers}
              areDetailLayersVisible={isSelected && areDetailLayersVisible}
            />
          );
        })}
      </div>

      <div className={`gallery-controls ${isDetailView ? "is-hiding" : ""}`}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => handleCategoryClick(cat)} className={activeCategory === cat ? "active" : ""} disabled={isAnimating}>
            {cat}
          </button>
        ))}
      </div>
    </>
  );
};

export default Gallery;
