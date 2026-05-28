import { createContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import router from './routes/Router'
import { RouterProvider } from 'react-router-dom'
import ParticlesBackground from './components/ParticlesBackground'
import CustomCursor from './components/CustomCursor'
import OverlayMenu from './components/OverlayMenu'
import Nav from './components/navbar/Nav'
import Home from "./pages/home/Home";
import IntroAnimation from './components/IntroAnimation'

let Usercontext = createContext();

function App() {
  let [user, setuser] = useState("user")

  // navbar modes
  let modes = [
    {
      mode: "collapse",
      type: ["collapse-close", "collapse-open"],
    },
    {
      mode: "navmode",
      type: "navbar"
    }
  ]
  // mode switch
  let [index, setindex] = useState(1);

  // collapse open close
  let [open, setopen] = useState(true);
  return (
    <>
      <Usercontext.Provider value={{ user, setuser, modes, index, setindex, open, setopen }}>
        {/* {!introDone && <IntroAnimation />}
        <div className='relative gradient text-white'>
          <CustomCursor />
          <Nav />
          <Home />
          <div className='w-full h-screen'>About</div>
          <div className='w-full h-screen'>Skills</div>
          <div className='w-full h-screen'>projects</div>
          <div className='w-full h-screen'>Experience</div>
          <div className='w-full h-screen'>Testimonials</div>
          <div className='w-full h-screen'>Contact</div>
          <div className='w-full h-screen'>Footer</div>
        </div> */}
        <RouterProvider router={router} />
      </Usercontext.Provider>
    </>
  )
}

export default App
export { Usercontext }

