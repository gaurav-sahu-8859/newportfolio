import React from "react";
import styles from "./CubeSphere.module.css";

export default function CubeSphere() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* 3D CUBE */}
        <div className={styles.cube}>
          <div className={styles.front}></div>
          <div className={styles.back}></div>
          <div className={styles.right}></div>
          <div className={styles.left}></div>
          <div className={styles.top}></div>
          <div className={styles.bottom}></div>
        </div>

        {/* SPHERE INSIDE */}
        <div className={styles.spc}>
          <div id={styles["sphere-container"]}>
            {[...Array(7)].map((_, i) => (
              <div
                key={`spx${i + 1}`}
                className={`${styles.sphere} ${styles[`spx${i + 1}`]}`}
              >
                <div></div>
              </div>
            ))}
            {[...Array(7)].map((_, i) => (
              <div
                key={`spy${i + 1}`}
                className={`${styles.sphere} ${styles[`spy${i + 1}`]}`}
              >
                <div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
