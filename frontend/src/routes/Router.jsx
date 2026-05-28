import Nav from '../components/navbar/Nav'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import Home from '../pages/home/Home'
import About from '../pages/about/About'
import Service from '../pages/Service'
import Skills from '../pages/skills/Skills'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import MyStudents from '../pages/testimonials/MyStudents'
import Auth from './Auth'

import Nopage from '../pages/nopage/Nopage'
import Layout from './Layout'
import ReptileCreature from '../assets/reptiles/ReptileCreature3'
import Experience from '../pages/experience/Experience'
import Projects from '../pages/project/Project'
import Testimonials from '../pages/testimonials/Testimonials'
import Contact from '../pages/contact/Contact'

let router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                // element: <Auth />,
                children: [
                    {
                        index: true,
                        element: <>
                            {/* <Home introDone={introDone} /> */}
                            <Home />
                            <About />
                            <Skills />
                            <Projects />
                            <Experience />
                            <Testimonials />
                            <Contact />
                            <Service />
                            <ReptileCreature />
                        </>
                    },

                ]
            },

            {
                path: "/home",
                element: <>
                    <Home />
                 
                </>
            },
            {
                path: "/about",
                element: <>
                    <About />
                </>
            },
            {
                path: "/services",
                element: <>
                    <Service />
                </>
            },
            {
                path: "/skills",
                element: <>
                    <Skills />
                </>
            },
            {
                path: "/trainee",
                element: <>
                    <MyStudents />
                </>
            },
            {
                path: "/signin",
                element: <>
                    <Login />
                </>
            },
            {
                path: "/signup",
                element: <>
                    <Signup />
                </>
            },
            {
                path: "*",
                element: <>
                    <Nopage />
                </>
            },
        ]
    },
])
export default router
