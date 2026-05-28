import React from "react";
import "./Cube.css"; // <-- Import CSS

const Cube  = ({h="200px",w="200px"}) => {
  return (
    // <div className="container">
    // </div>
    <div className="cube" style={{height:h,width:w}}>
      <div className="side1"></div>
      <div className="side2"></div>
      <div className="side3"></div>
      <div className="side4"></div>
      <div className="side5"></div>
      <div className="side6"></div>
    </div>
  );
};

export default Cube;
