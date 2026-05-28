import React, { useContext, useState } from 'react'
import { Usercontext } from '../App'
import Nav from '../components/navbar/Nav'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'
import Project from '../pages/project/Project'
import IntroAnimation from '../components/IntroAnimation'
import CustomCursor from '../components/CustomCursor'
import MusicPlayer from '../components/MusicPlayer'

function Layout() {
    let { modes, index, setindex } = useContext(Usercontext)
    let [introDone, setintroDone] = useState(false)

    return (
        <>
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

            {!introDone && <IntroAnimation />}
            {/* <IntroAnimation /> */}
            <div className='relative gradient text-white' style={(modes[index]["mode"] == "collapse") ? { display: "flex" } : { display: "block" }}>
                <CustomCursor />
                <Nav />
                <MusicPlayer />

                <div className={(modes[index]["mode"] == "collapse") ? "collapse-layout" : "nav-layout"}>
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Layout
