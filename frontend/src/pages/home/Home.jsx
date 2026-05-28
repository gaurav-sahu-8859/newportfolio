import React, { useEffect, useMemo, useState } from 'react'
import ParticlesBackground from '../../components/ParticlesBackground'
import { motion } from "framer-motion"
import { FaGithub, FaLinkedinIn } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import avtar from "../../assets/react.svg"
import CubeSphere from '../../assets/CubeSphere'
import Sphere from '../../assets/Sphere'
import Reptile from '../../assets/reptiles/Reptile'
import CanvasBackground from '../../components/CanvasBackground'
const socials = [
  { Icon: FaXTwitter, label: "X", href: "" },
  { Icon: FaLinkedinIn, label: "Linkedin", href: "" },
  { Icon: FaGithub, label: "GitHub", href: "" }
]
const glowVariants = {
  initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
  hover: {
    scale: 1.2, y: -3,
    filter: "drop-shadow(0 0 6px rgba(13,88,204,0.9)) drop-shadow(0 0 18px rgba(16,185,129,0.8))",
    transition: { type: "string", stiffness: 300, damping: 15 }
  },
  tap: { scale: 0.9, y: 0, transition: { duration: 0.08 } }
}
function Home() {
  const roles = useMemo(() => ["Web Developer", "Software Developer", "AI/ML"], [])
  const [index, setindex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  // const [blink, setBlink] = useState(false)

  useEffect(() => {
    const current = roles[index]
    const timeout = setTimeout(() => {
      if (!deleting && subIndex < current.length) setSubIndex(v => v + 1)
      else if (!deleting && subIndex === current.length) setTimeout(() => { setDeleting(true) }, 1200);
      else if (deleting && subIndex > 0) setSubIndex(v => v - 1)
      else if (deleting && subIndex === 0) { setDeleting(false); setindex(p => (p + 1) % roles.length) }
    }, deleting ? 40 : 60);
    return () => clearTimeout(timeout)
  }, [subIndex, index, deleting, roles])
  return (
    <section id='home' className='w-full h-screen relative bg-black overflow-hidden'>
      <ParticlesBackground />
      {/* <CanvasBackground /> */}
      <div className='absolute inset-0'>
        <div className='absolute -top-32 -left-32 w-[70vw] sm:w-[z-500vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-30 sm:opacity-20 md:opacity-10 blur-[100px] sm:blur-[100px] sm:blur-[130px] md:blur-[150px] animate-pulse'></div>
        <div className='absolute bottom-0 right-0 w-[70vw] sm:w-[z-500vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-30 sm:opacity-20 md:opacity-10 blur-[100px] sm:blur-[100px] sm:blur-[130px] md:blur-[150px] animate-pulse delay-500'></div>
      </div>
      <div className='relation z-10 h-full w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2'>
        <div className='flex flex-col justify-center h-full'>
          <div className='w-full lg:pr-24 mx-auto max-w-[48rem]'>
            <motion.div
              className='mb-3 text-xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-wide min-h-[1.6em]'
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span>
                {roles[index].substring(0, subIndex)}
              </span>
              <span
                className='inline-block w-[2px] ml-1 bg-white animate-pulse align-middle'
                style={{ height: "1em" }}
              ></span>
            </motion.div>
            <motion.h1
              className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] drop-shadow-lg'
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Hello I'm <br />
              <span className='text-white font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl lg:whitespace-nowrap'>
                Gaurav sahu
              </span>
            </motion.h1>
            <motion.p
              className='mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ default: 0.4, duration: 0.8 }}
            >
              I turn complex ideas into seamless,heigh-impact web experiences - building modern, scalable, and lighting-fast applications that make a difference.
            </motion.p>
            <motion.div
              className='mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6'
              inherit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <a
                href="#projects"
                className='px-6 py-3 rounded-full font-medium text-lg text-white bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] shadow-lg hover:scale-105 transition-all'
              >
                View My Work
              </a>
              <a
                href="/resume.pdf"
                download
                className='px-6 py-3 rounded-full text-lg font-medium text-black bg-white hover:bg-gray-200 shadow-lg hover:scale-105 transition-all'
              >
                My Resume
              </a>
            </motion.div>
            <div className='mt-10 flex gap-5 text-2xl md:text-3xl'>
              {
                socials.map(({ Icon, label, href }) => {
                  <motion.a
                    href={href}
                    key={label}
                    target='_blank'
                    area-label={label}
                    rel="noopener noreferrer"
                    variants={glowVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className='text-gray-300'
                  ><Icon />
                  </motion.a>
                })
              }
            </div>
          </div>
        </div>
        <div className='relative hidden lg:block'>
          <div
            className='absolute top-1/2 -translate-y-1/2 pointer-events-none'
            style={{
              right: "10px",
              width: "min(22vw,410px)",
              height: "min(40vw,760px)",
              borderRadius: "50% ",
              filter: "blur(38px)",
              opacity: 0.32,
              background: "conic-gradient(from 0deg,#1cd8d2,#00bf8f,#302b63,#1cd8d2)"
            }}
          />
          {/* <CubeSphere/> */}
          {/* <Sphere /> */}
          {/* <Reptile /> */}


          <motion.img
            src={avtar}
            alt="gaurav sahu"
            className='absolute top-1/2 -translate-y-1/2 object-contain select-none pointer-events-none'
            style={{
              right: "-30px",
              width: "min(45vw,780px)",
              maxHeight: "90vh",
            }}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
        </div>
      </div>
    </section >
  )
}

export default Home


// import React, { useContext, useEffect, useState } from 'react';
// import Cube from '../../assets/Cube.jsx';
// import Sphere from '../../assets/Sphere.jsx';
// import Typewriter from '../../assets/Typewriter.jsx';
// import { Usercontext } from '../../App.jsx';
// import CubeSphere from '../../assets/CubeSphere.jsx';

// export default function Home() {
//   let {user, setuser} = useContext(Usercontext);
//   const [isCircle, setIsCircle] = useState(false);
//   let [isDark, setIsDark] = useState(true)
//   useEffect(() => {
//     const handleScroll = () => {
//       console.log(window.scrollX, window.scrollY);

//       if (window.scrollY > 200) {
//         setIsCircle(true);
//       } else {
//         setIsCircle(false);
//       }
//     };
//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   console.log("hello");

//   return (
//     <div style={{ height: '1000px', width: "100%", padding: '20px', background: isDark ? "#000" : "#f0f8ff" }}>
//       <button
//         onClick={() => setIsDark(!isDark)}
//         aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
//         aria-pressed={!isDark}
//       >
//         {isDark ? 'dark' : 'light'}
//       </button>


//       {/* <h1>Hi, I am Gaurav Sahu,I am software developer. I am able to build any type of sofware/application just like </h1> */}


//       <div
//         style={{
//           height: '300px',
//           width: '100%',
//           background: 'red',
//           borderRadius: isCircle ? '50%' : '0',
//           transition: 'border-radius 0.3s ',
//           position: "sticky",
//           display: "flex",
//           justifyContent: 'space-around',
//           top: 0,
//           padding: isCircle ? "44px 98px" : "0px 10px 5px 2px ",
//           boxShadow: "8px 8px 5px 0px black",
//           zIndex: "1",
//         }}
//       >
//         <div>
//           <h1 style={{ color: "#fff", textAlign: "center", fontSize: "2rem" }}>
//             Hi {user}, I'm <span style={{ color: "#00ffff" }}>Gaurav Sahu</span>
//           </h1>
//           <Typewriter
//             texts={[
//               "I am a Web Developer.",
//               "I am a Software Engineer.",
//               "I build modern digital experiences."
//             ]}
//             typingSpeed={100}
//             deletingSpeed={50}
//             delayBetween={1500}
//             cursorColor="#00ffff"
//           />

//         </div>
//       </div>
//       <div style={{ paddingLeft: "20px", display: "flex", flexWrap: "wrap", gap: "5px", justifyContent: 'space-around', transform: "translate(0,150px)", zIndex: "-9" }}>
//         {
//           isCircle ?
//             <>
//               <div style={{ height: "300px", width: "300px", }}>
//                 {/* <Cube /> */}
//                 <CubeSphere />
//               </div>
//               <div style={{ height: "300px", width: "300px", }}>
//                 <Sphere h="110px" w="110px" r={10} />
//               </div>
//               <div style={{ height: "300px", width: "300px", }}>
//                 <Cube h="150px" w="150px" />
//               </div>
//             </> :
//             <>
//               <div style={{ height: "300px", width: "300px", }}>
//                 <Cube h="150px" w="150px" />
//               </div>
//               <div style={{ height: "300px", width: "300px", }}>
//                 <Sphere h="100px" w="100px" r={100} />
//               </div>
//               <div style={{ height: "300px", width: "300px", }}>
//                 <Cube />
//               </div>
//             </>
//         }
//       </div>
//       {/* <Cube />
//           <Sphere /> */}
//     </div>
//   );
// }
