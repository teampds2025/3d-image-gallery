import React, { useState } from "react";
import "../styles/DetailOverlay.css"; 

// COMPONENT
// renders an overlay with details and a voting poll
const DetailOverlay = ({ isVisible, selectedItem, onResetApp, itemWidth }) => {
  const [choice, setChoice] = useState(""); // stores the user's vote 
  const [isSubmitting, setIsSubmitting] = useState(false); // tracks if the vote submission is in progress
  const [hasVoted, setHasVoted] = useState(false); // tracks if the user has submitted a vote

  // classes and css properties 
  const containerClasses = `detail-overlay-container ${isVisible ? "is-visible" : ""}`;
  const containerStyle = {
    "--cube-width": `${itemWidth}px`,
  };

  // submits the user's vote 
  const handleVoteSubmit = async () => {
    if (!choice) return; 

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: selectedItem.id, choice: choice }),
      });

      if (!response.ok) throw new Error("Failed to submit vote.");

      setHasVoted(true); 
    } catch (error) {
      console.error("Vote error:", error);
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Return Button */}
      <button className="block-container return-block" onClick={onResetApp}>
        <div className="inner-core2"></div>
        <div className="outer-ring"></div>
        <div className="inner-core"></div>
        <div className="content">
          <div className="content_element content_element--active">
            <div className="content_container">
              <div className="content_icon content_icon--active content_icon--return"></div>
              Return
            </div>
          </div>
        </div>
      </button>

      {/* Art Block */}
      <div className="block-container art-block">
        <div className="inner-core2"></div>
        <div className="outer-ring"></div>
        <div className="inner-core"></div>
        <div className="content">
          <div className="content_element">
            <div className="content_container content_container--lplace">
              <div className="content_icon content_icon-art"></div>
              artwork n.{selectedItem.id}
            </div>
          </div>
        </div>
      </div>

      {/* Poll Wrapper */}
      <div className="poll-wrapper">
        {/* Like Block */}
        <div className="block-container like-block">
          <div className="inner-core2"></div>
          <div className="outer-ring"></div>
          <div className="inner-core"></div>
          <div className="content">
            <div className="content_element">
              <div className="content_container content_container--lplace">
                <div className="content_icon content_icon--like"></div>
                do you like it?
              </div>
            </div>
          </div>
        </div>

        {/* Poll Block */}
        <div className={`block-container poll-block ${hasVoted ? "poll-block--voted" : ""}`}>
          <div className="inner-core2"></div>
          <div className="outer-ring"></div>
          <div className="inner-core"></div>
          <form className="content" id="myForm">
            <div className="content_element">
              <div className="content_container">
                <input
                  type="radio"
                  name="choice"
                  value="Yes"
                  id="option1"
                  checked={choice === "Yes"}
                  onChange={(e) => setChoice(e.target.value)}
                  disabled={hasVoted || isSubmitting}
                />
                <div className="content_icon content_icon--yes"></div>
                <label htmlFor="option1">Yes</label>
              </div>
            </div>
            <div className="content_element">
              <div className="content_container">
                <input
                  type="radio"
                  name="choice"
                  value="No"
                  id="option2"
                  checked={choice === "No"}
                  onChange={(e) => setChoice(e.target.value)}
                  disabled={hasVoted || isSubmitting}
                />
                <div className="content_icon content_icon--no"></div>
                <label htmlFor="option2">No</label>
              </div>
            </div>
          </form>
        </div>

        <button
          onClick={handleVoteSubmit}
          type="button"
          className="block-container sendfrom-block"
          disabled={hasVoted || isSubmitting}>
          <div className="inner-core2"></div>
          <div className="outer-ring"></div>
          <div className="inner-core"></div>
          <div className="content">
            <div className="content_element content_element--active">
              <div className="content_container">
                <div className="content_icon content_icon--active content_icon--vote"></div>
                {hasVoted ? "Voted!" : isSubmitting ? "..." : "vote!"}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DetailOverlay;
