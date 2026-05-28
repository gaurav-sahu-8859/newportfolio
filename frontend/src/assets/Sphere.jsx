// import React, { useEffect, useRef } from "react";
// import "./Sphere.css";

// const Sphere = () => {
//   const sphereRef = useRef(null);
//   const radius = 120;
//   const latCount = 30;
//   const longCount = 30;

//   useEffect(() => {
//     const sphere = sphereRef.current;
//     sphere.innerHTML = "";

//     for (let i = 0; i < latCount; i++) {
//       const theta = (i / (latCount - 1)) * Math.PI;
//       for (let j = 0; j < longCount; j++) {
//         const phi = (j / longCount) * 2 * Math.PI;

//         const x = radius * Math.sin(theta) * Math.cos(phi);
//         const y = radius * Math.cos(theta);
//         const z = radius * Math.sin(theta) * Math.sin(phi);

//         //  Each dot gets its own wrapper for position in 3D space
//         const wrapper = document.createElement("div");
//         wrapper.className = "dot-wrapper";
//         wrapper.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

//         const dot = document.createElement("div");
//         dot.className = "dot";
//         wrapper.appendChild(dot);

//         sphere.appendChild(wrapper);
//       }
//     }
//   }, []);

//   return (
//     <div id="sphere-container">
//       <div id="sphere" ref={sphereRef}></div>
//     </div>
//   );
// };

// export default Sphere;



import React, { useEffect, useRef } from "react";
import "./Sphere.css"; //  Import CSS file

const Sphere = ({ w = "300px", h = "300px",r=120 }) => {
  const sphereRef = useRef(null);
  const radius = r;
  const latCount = 30;
  const longCount = 30;
  const dots = useRef([]);
  const frameRef = useRef();

  useEffect(() => {
    const sphere = sphereRef.current;
    dots.current = [];
    sphere.innerHTML = "";

    for (let i = 0; i < latCount; i++) {
      const theta = (i / (latCount - 1)) * Math.PI;
      for (let j = 0; j < longCount; j++) {
        const phi = (j / longCount) * 2 * Math.PI;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * Math.sin(phi);

        const dot = document.createElement("div");
        dot.className = "dot";
        sphere.appendChild(dot);
        dots.current.push({ el: dot, x, y, z });
      }
    }

    let angleX = 0;
    let angleY = 0;
    const perspective = 600;

    const animate = () => {
      angleX += 0.01;
      angleY += 0.01;
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      dots.current.forEach(({ el, x: origX, y: origY, z: origZ }) => {
        let y = origY * cosX - origZ * sinX;
        let z = origY * sinX + origZ * cosX;
        let x = origX * cosY + z * sinY;
        z = -origX * sinY + z * cosY;

        const scale = perspective / (perspective + z);
        const screenX = x * scale;
        const screenY = y * scale;

        el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) scale(${scale})`;
        el.style.zIndex = Math.floor(scale * 1000);
        el.style.opacity = scale;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      dots.current.forEach(({ el }) => el.remove());
      dots.current = [];
    };
  }, []);

  return (
    
    // <div id="sphere-container">
    // </div>

    <div id="sphere" ref={sphereRef} style={{
      width: w,
      height: h
    }}></div>
  );
};

export default Sphere;
