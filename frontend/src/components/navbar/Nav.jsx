// import React, { useEffect, useRef, useState } from 'react'
// import logo from "../../assets/react.svg"
// import { FiMenu } from 'react-icons/fi'
// import OverlayMenu from '../OverlayMenu'

// function Nav() {
//   const [menuopen, setMenuOpen] = useState(false)
//   const [visible, setVisible] = useState(true)
//   const [forceVisible, setForceVisible] = useState(false)

//   const lastScrollY = useRef(0)
//   const timerId = useRef(null)
//   useEffect(() => {
//     const homeSection = document.querySelector("#home")
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setForceVisible(true)
//           setVisible(true)
//         } else {
//           setForceVisible(false)
//         }
//       }, { threshold: 0.1 }
//     )
//     if (homeSection) observer.observe(homeSection);
//     return () => {
//       if (homeSection) observer.unobserve(homeSection)
//     }
//   }, [])

//   useEffect(() => {
//     const handleScroll = () => {
//       if (forceVisible) {
//         setVisible(true)
//         return
//       }
//       const currentScrollY = window.scrollY;

//       if (currentScrollY > lastScrollY.current) {
//         setVisible(false)
//       } else {
//         setVisible(true)

//         if (timerId.current) clearTimeout(timerId.current)
//         timerId.current = setTimeout(() => {
//           setVisible(false)
//         }, 3000);
//       }
//       lastScrollY.current = currentScrollY;
//     }
//     window.addEventListener("scroll", handleScroll, { passive: true })

//     return () => {
//       window.removeEventListener("scroll", handleScroll)
//       if (timerId.current) clearTimeout(timerId.current)
//     }
//   }, [forceVisible])
//   return (
//     <>
//       <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 ${menuopen ? "z-0" : "z-9999"} transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>
//         <div className='flex items-center space-x-2'>
//           <img src={logo} alt="logo" className='w-8 h-8' />
//           <div className='text-2xl font-bold text-white hidden sm:block'>
//             Gaurav
//           </div>

//         </div>
//         <div className='block lg:absolute lg:left-1/2 lg:transform lg:translate-x-1/2'>
//           <button
//             onClick={() => {
//               console.log("sdkjf");

//               setMenuOpen(true)
//             }}
//             className='text-white text-3xl focus:outline-none'
//             area-label='open Menu'
//           >
//             <FiMenu />
//           </button>
//         </div>
//         <div className='hidden lg:block'>
//           <a
//             href="#contact"
//             className='bg-gradient-to-r from-pink-500 to-blue-500 text-white px-5 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity duration-300'
//           >
//             Reach Out
//           </a>

//         </div>
//       </nav>
//       <OverlayMenu isOpen={menuopen} onClose={() => {
//         console.log("sdfj");

//         setMenuOpen(false)
//       }} />
//     </>
//   )
// }

// export default Nav



import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from "./Nav.module.css";
import { Usercontext } from '../../App';

let portals = [
  {
    write: "portfolio",
    link: "/",
    dropdown: [],
    isactive: true,
  },
  {
    write: "home",
    link: "/home",
    dropdown: [],
    isactive: false,
  },
  {
    write: "about",
    link: "/about",
    dropdown: [],
    isactive: false,
  },
  {
    write: "skills",
    link: "/skills",
    dropdown: ["HTML | CSS", "Javascript", "Nodejs", "expressjs", "AI | ML", "C/C++", "Java", "Python",],
    isactive: false,
  },
  {
    write: "services",
    link: "/services",
    dropdown: [],
    isactive: false,
  },
  // {
  //   write: "My Students",
  //   link: "/trainee",
  //   dropdown: [],
  //   isactive: false,
  // },
  {
    write: "login",
    link: "/signin",
    dropdown: [],
    isactive: false,
  },
  // {
  //   write: "register",
  //   link: "/signup",
  //   dropdown: [],
  //   isactive: false,
  // },
];

export default function Nav() {
  let { modes, index, setindex, open, setopen } = useContext(Usercontext)

  let collapsehandler = () => {
    console.log(index);

    setindex(prev => {
      if (index > modes.length - 2) {
        return 0
      }
      return prev + 1

    })

  }
  return (
    <>
      {/* <div className={`${(modes[index]["mode"] == "collapse") ? styles.menu : styles.nav} z-90`} > */}
      <div
        className={
          `${modes[index].mode === "collapse"
            ? `${styles.menu} ${open ? styles.expand : styles.collapse}`
            : styles.nav} z-90`
        }
      >
        <div>
          <button onClick={collapsehandler}>
            {modes[index]["mode"]}
          </button>
          {
            modes[index]["mode"] == "collapse" && (

              // <button onClick={() => setopen(!open)}>
              //   {open ? "Close" : "Open"}
              // </button>
              <button
                onClick={() => setopen(prev => !prev)}
                className={styles.toggleBtn}
              >
                {open ? "✕ Close" : "☰ Menu"}
              </button>
            )
          }
        </div>
        {/* <div className={(modes[index]["mode"] == "collapse") ? styles.innermenu : styles.innernav}> */}
        <div
          className={
            modes[index]["mode"] == "collapse"
              ? `${styles.innermenu} ${open ? styles.show : styles.hide}`
              : styles.innernav
          }
        >
          {
            portals.map((v, k) => {
              return (
                <div key={k} className={(modes[index]["mode"] == "collapse") ? styles.dropdown : styles.navdropdown}>
                  <NavLink
                    // onClick={() => setopen(false)}
                    to={v.link}
                    className={({ isActive }) => {

                      let baseClass =
                        modes[index].mode == "collapse"
                          ? styles.linkmenu
                          : styles.linknav;

                      return isActive
                        ? `${baseClass} ${styles.active}`
                        : baseClass;
                    }}
                  // className={({ isActive }) =>
                  //   isActive ? `${(modes[index]["mode"] == "collapse") ? styles.linkmenu : styles.linknav} ${styles.active}` : styles.link
                  // }
                  >
                    {v.write}
                  </NavLink>

                  {/* Dropdown Menu */}
                  {v.dropdown.length > 0 && (
                    <div className={(modes[index]["mode"] == "collapse") ? styles.dropdownMenu : styles.dropdownMenuNav}>
                      {v.dropdown.map((v2, k2) => (
                        <NavLink key={k2} to={`/${v2.toLowerCase()}`} className={styles.dropdownItem}>
                          {v2}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
}
