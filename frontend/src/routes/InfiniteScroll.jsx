import React, { useEffect, useRef } from "react";
import Cube from "../assets/Cube";
import Sphere from "../assets/Sphere";

export default function InfiniteScroll() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let scrollPos = 0;

    const scrollLoop = () => {
      scrollPos += 0.5; // scroll speed
      if (container) {
        container.scrollLeft = scrollPos;
        if (scrollPos >= container.scrollWidth / 2) {
          scrollPos = 0; // reset when half scrolled for looping
        }
      }
      requestAnimationFrame(scrollLoop);
    };

    scrollLoop();
  }, []);

  const shapes = [
    <Cube key="c1" h="120px" w="120px" />,
    <Sphere key="s1" h="100px" w="100px" />,
    <Cube key="c2" h="150px" w="150px" />,
    <Sphere key="s2" h="130px" w="130px" />,
    <Cube key="c3" h="100px" w="100px" />,
    <Sphere key="s3" h="150px" w="150px" />,
  ];

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflowX: "scroll",
        whiteSpace: "nowrap",
        display: "flex",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        background: "#111",
        padding: "40px 0",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "50px",
          animation: "scrollLoop 30s linear infinite",
        }}
      >
        {[...shapes, ...shapes, ...shapes].map((shape, i) => (
          <div
            key={i}
            style={{
              display: "inline-block",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            {shape}
          </div>
        ))}
      </div>
    </div>
  );
}
