"use client";

import React, { useState } from "react";
import Draggable from "react-draggable";

const ImagePreview = ({ src, alt = "Image" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setZoom(1);
      setRotation(0);
    }
  };

  const handleZoom = (direction: any) => {
    setZoom((prevZoom) => {
      const newZoom = direction === "in" ? prevZoom + 0.1 : prevZoom - 0.1;
      return newZoom < 0.1 ? 0.1 : newZoom;
    });
  };

  const handleRotate = (direction: any) => {
    setRotation((prevRotation) => (direction === "right" ? prevRotation + 90 : prevRotation - 90));
  };

  return (
    <>
      <img src={src} alt={alt} onClick={togglePopup} style={{ cursor: "pointer", width: "200px" }} />

      {!isOpen && (
        <div className="popup-overlay" onClick={togglePopup}>
          <Draggable>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
              <img
                src={src}
                alt={alt}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
          </Draggable>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
