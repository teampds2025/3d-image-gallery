import React from "react";

// COMPONENT
// renders a single gallery item as a 3D cuboid
const GalleryItem = ({
  // core item properties
  width,
  height,
  imageUrl,
  category,
  onClick,
  // positioning and stacking
  xOffset,
  yOffset,
  zIndex,
  // animation state flags
  shouldHide,
  isAppearing,
  isSelected,
  isFadingOut,
  // detail view state flags
  showDetailLayers,
  areDetailLayersVisible,
}) => {
  // custom css properties for dynamic sizing and positioning
  const itemStyle = {
    "--cube-width": `${width}px`,
    "--cube-height": `${height}px`,
    "--half-width": `${width / 2}px`,
    "--half-height": `${height / 2}px`,
    "--x-offset": `${xOffset}px`,
    "--y-offset": `${yOffset}px`,
    zIndex: zIndex,
  };

  // builds the classes based on the item's state
  const itemClasses = [
    "scene",
    shouldHide ? "is-hiding" : "",
    isAppearing ? "is-appearing" : "",
    isSelected ? "is-selected" : "",
    isFadingOut ? "is-fading-out" : "",
    showDetailLayers ? "is-detail-view" : ""
  ].filter(Boolean).join(" ");

  const detailBaseClass = "cuboid__face cuboid__face--front";
  const detailVisibilityClass = areDetailLayersVisible ? "is-visible" : "";

  return (
    <div className={itemClasses} style={itemStyle} onClick={onClick}>
      <div className="cuboid">
        <div
          className="cuboid__face cuboid__face--front" style={{ backgroundImage: `url(${imageUrl})` }}></div>

        {showDetailLayers && (
          <>
            <div
              className={`${detailBaseClass} cuboid-detail-view--one ${detailVisibilityClass}`}
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div
              className={`${detailBaseClass} cuboid-detail-view--two ${detailVisibilityClass}`}
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div
              className={`${detailBaseClass} cuboid-detail-view--three ${detailVisibilityClass}`}
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
          </>
        )}

        <div className="cuboid__face cuboid__face--back" style={{ backgroundImage: `url(${imageUrl})` }}></div>
        <div className="cuboid__face cuboid__face--right"></div>
        <div className="cuboid__face cuboid__face--left"></div>
        <div className="cuboid__face cuboid__face--top"></div>
        <div className="cuboid__face cuboid__face--bottom"></div>
      </div>
    </div>
  );
};

export default GalleryItem;