import React, { useEffect, useState } from "react";
import "./Typewriter.css";

const Typewriter = ({
  texts = ["I am a Web Developer.", "I am a Software Engineer.", "I am a Problem Solver."],
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetween = 1500,
  cursorColor = "#0ff",
}) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // If texts is empty or undefined, do nothing to avoid errors
    if (!texts || texts.length === 0) return;

    const currentText = texts[index % texts.length];

    let timeout;

    if (!isDeleting && text.length < currentText.length) {
      // Typing
      timeout = setTimeout(() => {
        setText(currentText.substring(0, text.length + 1));
      }, typingSpeed);
    } else if (isDeleting && text.length > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setText(currentText.substring(0, text.length - 1));
      }, deletingSpeed);
    } else if (!isDeleting && text.length === currentText.length) {
      // Wait before deleting
      timeout = setTimeout(() => setIsDeleting(true), delayBetween);
    } else if (isDeleting && text.length === 0) {
      // Move to next text
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, texts, typingSpeed, deletingSpeed, delayBetween]);

  return (
    <div className="typewriter-container">
      <p className="typewriter-text">
        {text}
        <span className="cursor" style={{ backgroundColor: cursorColor }}></span>
      </p>
    </div>
  );
};

export default Typewriter;
