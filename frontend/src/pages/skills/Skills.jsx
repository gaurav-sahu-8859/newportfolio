import { delay, motion, useMotionValue } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
// import "./Skills.css"; // or use module.css if preferred
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaPython, FaJava } from "react-icons/fa";
import { SiAngular, SiDocker, SiFastapi, SiMongodb, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";

export default function Skills() {
  // const skills = [
  //   { name: "HTML", icon: <FaHtml5 color="#E34F26" /> },
  //   { name: "CSS", icon: <FaCss3Alt color="#1572B6" /> },
  //   { name: "JavaScript", icon: <FaJs color="#F7DF1E" /> },
  //   { name: "React", icon: <FaReact color="#61DBFB" /> },
  //   { name: "Node.js", icon: <FaNodeJs color="#68A063" /> },
  //   { name: "Python", icon: <FaPython color="#3776AB" /> },
  //   { name: "Java", icon: <FaJava color="#f89820" /> },
  // ];
  const skills = [
    { icon: <FaHtml5 />, name: "HTML", },
    { icon: <FaCss3Alt />, name: "CSS", },
    { icon: <FaJs />, name: "JavaScript", },
    { icon: <FaJava />, name: "Java", },
    { icon: <FaReact />, name: "React", },
    { icon: <SiNextdotjs />, name: "Next.js", },
    { icon: <SiTypescript />, name: "TypeScript", },
    { icon: <SiTailwindcss />, name: "Tailwind CSS", },
    { icon: <SiFastapi />, name: "FastApi", },
    { icon: <FaPython />, name: "Python", },
    { icon: <SiDocker />, name: "Docker", },
    { icon: <FaNodeJs />, name: "Node.js", },
    { icon: <SiMongodb />, name: "Mongodb", },
    { icon: <SiAngular />, name: "Angular", },
  ];

  const repeated = [...skills, ...skills]

  const [dir, setDir] = useState(-1);
  const [active, setActive] = useState(false)

  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const touchY = useRef(null)

  const x = useMotionValue(0)

  // Detect section visibility
  useEffect(() => {
    const el = sectionRef.current
    if ((!el)) return

    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio > 0.1);
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Scroll direction detection
  useEffect(() => {
    if (!active) return
    const onWheel = (e) => setDir(e.deltaY > 0 ? 1 : -1);
    const onTouchStart = (e) => (touchY.current = e.touches[0].clientY)
    const onTouchMove = (e) => {
      if (touchY.current == null) return
      const delta = e.touches[0].clientY - touchY.current
      setDir(delta > 0 ? 1 : -1);
      touchY.current = e.touches[0].clientY;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);

    }
  }, [active])

  // Infinite marquee animation
  useEffect(() => {
    if (!active) return;

    let id;
    let last = performance.now()
    const SPEED = 80;
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      let next = x.get() + SPEED * dir * dt;
      const loop = trackRef.current?.scrollWidth / 2 || 0
      if (loop) {
        if (next <= -loop) next += loop;
        else if (next >= 0) next -= loop;
      }
      x.set(next)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [dir, x,active])

  return (
    <>
      <section
        id="skills"
        ref={sectionRef}
        className="h-1/2 w-full pb-8 flex-col items-center justify-center relative bg-pink-800 text-white overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none ">
          <div className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#302b63]  via-[#00bf8f] to-[#1cd8d2] opacity-20 blur-[120px] animate-pulse" >
          </div>
          <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#302b63]  via-[#00bf8f] to-[#1cd8d2] opacity-20 blur-[120px] animate-pulse delay-500" >
          </div>
        </div>
        {/* Heading */}
        <motion.h2
          className="text-4xl mt-5 sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] z-10"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duartion: 0.5, delay: 0.1 }}
        >My Skills
        </motion.h2>

        <motion.p className="mt-2 mb-8 text-white/90 text-base sm:text-lg z-10"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Modern Application | Modern Technologies
        </motion.p>

         {/* Marquee */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex gap-10 text-6xl text-[#1cd8d2]"
            style={{ x, whiteSpace: "nowrap", willChange: "transform" }}
          >
            {
              repeated.map((s, i) => {
                return <div
                  key={i}
                  className="flex flex-col items-center gap-2 min-w-[120px]"
                  aria-label={s.name}
                  title={s.name}
                >
                  <span className="hover:scale-125 transition-transform duration-300">
                    {s.icon}
                  </span>
                  <p className="text-sm">{s.name}</p>
                </div>
              })
            }
          </motion.div>
        </div>
      </section>
      {/* <div className="skills-container">
      <h2 className="skills-title">My Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-card">
            <div className="skill-icon">{skill.icon}</div>
            <p className="skill-name">{skill.name}</p>
          </div>
        ))}
      </div>
    </div> */}
    </>
  );
}
