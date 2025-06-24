// IMPORTS
import React, { useState, useEffect } from "react";
import Gallery from "./components/Gallery";
import Login from "./components/Login";

import image1 from "./assets/abstract1.jpg";
import image2 from "./assets/abstract2.jpg";
import image3 from "./assets/abstract3.jpg";
import image4 from "./assets/abstract4.jpg";
import image5 from "./assets/abstract5.jpg";
import image6 from "./assets/art1.jpg";
import image7 from "./assets/art2.jpg";
import image8 from "./assets/art3.jpg";
import image9 from "./assets/art4.jpg";
import image10 from "./assets/art5.jpg";
import image11 from "./assets/nature1.jpg";
import image12 from "./assets/nature2.jpg";
import image13 from "./assets/nature3.jpg";
import image14 from "./assets/nature4.jpg";
import image15 from "./assets/nature5.jpg";
import image16 from "./assets/nature6.jpg";
import image17 from "./assets/nature7.jpg";
import image18 from "./assets/nature8.jpg";
import image19 from "./assets/nature9.jpg";
import image20 from "./assets/nature10.jpg";

// DATA
const galleryItems = [
  { id: 1, width: 550, height: 550, imageUrl: image6, category: "art" },
  { id: 2, width: 500, height: 600, imageUrl: image1, category: "abstract" },
  { id: 3, width: 400, height: 500, imageUrl: image7, category: "art" },
  { id: 4, width: 500, height: 400, imageUrl: image11, category: "nature" },
  { id: 5, width: 400, height: 600, imageUrl: image12, category: "nature" },
  { id: 6, width: 500, height: 450, imageUrl: image13, category: "nature" },
  { id: 7, width: 450, height: 550, imageUrl: image8, category: "art" },
  { id: 8, width: 570, height: 600, imageUrl: image14, category: "nature" },
  { id: 9, width: 400, height: 450, imageUrl: image2, category: "abstract" },
  { id: 10, width: 500, height: 450, imageUrl: image15, category: "nature" },
  { id: 11, width: 450, height: 550, imageUrl: image9, category: "art" },
  { id: 12, width: 550, height: 600, imageUrl: image16, category: "nature" },
  { id: 13, width: 570, height: 450, imageUrl: image5, category: "abstract" },
  { id: 14, width: 500, height: 450, imageUrl: image3, category: "abstract" },
  { id: 15, width: 450, height: 550, imageUrl: image10, category: "art" },
  { id: 16, width: 550, height: 600, imageUrl: image17, category: "nature" },
  { id: 17, width: 450, height: 600, imageUrl: image18, category: "nature" },
  { id: 18, width: 550, height: 600, imageUrl: image4, category: "abstract" },
  { id: 19, width: 550, height: 400, imageUrl: image19, category: "nature" },
  { id: 20, width: 570, height: 550, imageUrl: image20, category: "nature" },
];

// COMPONENTS
const SvgFilters = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <filter id="subtle-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <feTurbulence id="turbulence" type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="3" seed="1576"></feTurbulence>
      <feDisplacementMap in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
    </filter>
    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="1" seed="5" result="turbulence"></feTurbulence>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap"></feGaussianBlur>
      <feDisplacementMap in="SourceGraphic" in2="softMap" scale="150" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
    </filter>
  </svg>
);


// main application component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // manages user authentication
  const [facts, setFacts] = useState([]); // stores fetched facts 
  const [currentFactIndex, setCurrentFactIndex] = useState(0); // index for the currently displayed fact
  const [selectedItem, setSelectedItem] = useState(null); // currently selected gallery item 
  const [appKey, setAppKey] = useState(0); // to reset the gallery component 


  // to cycle through facts when the user is logged in
  useEffect(() => {
    if (isLoggedIn && facts.length) {
      const intervalId = setInterval(() => {
        setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn, facts]);

  // handles login, sets auth state, and fetches facts
  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    try {
      const response = await fetch("/api/facts");
      const data = await response.json();
      setFacts(data);
    } catch (error) {
      console.error("Failed to fetch facts:", error);
    }
  };

  // prepares fact content for display
  let factContent = "Loading facts...";
  if (facts.length > 0) {
    const currentFactText = facts[currentFactIndex].fact;
    factContent = currentFactText.split(" ").map((word, index) => (
      <span key={index} className="fact-word">
        {word}{" "}
      </span>
    ));
  }

  // resets the app to its initial state
  const handleResetApp = () => {
    setSelectedItem(null);
    setAppKey((prevKey) => prevKey + 1);
  };

  const isDetailView = !!selectedItem;


  return (
    <>
      <div className={`auth-widget ${isDetailView ? "is-hiding" : "" }`}> {isLoggedIn ? ( <div className="login-success-message">{factContent}</div> ) : (
        <Login onLoginSuccess={handleLoginSuccess} /> )}
      </div>
      <Gallery 
        key={appKey} 
        items={galleryItems} 
        onResetApp={handleResetApp} 
        selectedItem={selectedItem} 
        setSelectedItem={setSelectedItem} 
      />
      <SvgFilters />
    </>
  );
}

export default App;