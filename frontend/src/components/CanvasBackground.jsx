// npm install @react-three/fiber @react-three/drei three

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

// Ek chota wrapper component jo taron ko rotate karega

const RotatingStars = () => {
    const starsRef = useRef();

    // Ye hook har frame par chalega aur stars ko ghumayega

    useFrame((state) => {
        if (starsRef.current) {
            const time = state.clock.getElapsedTime();
            starsRef.current.rotation.y = time * 0.03; // Left to Right
            starsRef.current.rotation.x = time * 0.03; // Up to Down (Dono milkar diagonal banayenge)
            starsRef.current.rotation.z = time * 0.01; // Halki si tilting wave
        }
    });


    //   useFrame((state) => {
    //     if (starsRef.current) {
    //       // Yahan se aap ghumne ki speed control kar sakte hain
    //       starsRef.current.rotation.y = - state.clock.getElapsedTime() * 0.05; // Y-axis par ghumega
    //       starsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02; // X-axis par halka tilt
    //     }
    //   });

    return (
        <Stars
            ref={starsRef}
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1.5} // Ye taron ke टिमटिमाने (twinkling) ke liye hai
        />
    );
};

const CanvasBackground = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                background: '#040406', // Aapka exact page dark background color
                // zIndex:1
            }}
        >
            <Canvas camera={{ position: [0, 0, 1] }}>
                <RotatingStars />
            </Canvas>
        </div>
    );
};

export default CanvasBackground;