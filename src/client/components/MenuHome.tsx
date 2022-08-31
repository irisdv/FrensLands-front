import React from "react";
import { NavLink } from "react-router-dom";

export default function MenuHome() {

    const [navbarOpen, setNavbarOpen] = React.useState(false);

  return (
    <>
        <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-pink-500 mb-3">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
            <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <NavLink to="/">
                <img src="resources/front/UI_GameTitle.png" className="h-24 w-auto" />
            </NavLink>
            <button type="button" 
                className="block lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false"
                onClick={() => setNavbarOpen(!navbarOpen)}
            >
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            </div>
            <div
                className={
                "lg:flex flex-grow items-center" +
                (navbarOpen ? " flex" : " hidden")
                }
                id="example-navbar-danger"
            >
                <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                <li className="nav-item">
                    <NavLink className={(navData) => (navData.isActive ? 'gameMenuActive' : 'gameMenuWhite')} to="/"></NavLink>
                    <div className="dashWhite hidden lg:inline-block"></div>
                </li>
                <li className="nav-item">
                    <NavLink  className={(navData) => (navData.isActive ? 'tutorialMenuActive' : 'tutorialMenuWhite')} to="/tutorial"></NavLink>
                    <div className="dashWhite hidden lg:inline-block"></div>
                </li>
                <li className="nav-item">
                    <NavLink  className={(navData) => (navData.isActive ? 'roadmapMenuActive' : 'roadmapMenuWhite')} to="/roadmap"></NavLink>
                    <div className="dashWhite hidden lg:inline-block"></div>
                </li>
                <li className="nav-item">
                    <NavLink  className={(navData) => (navData.isActive ? 'aboutMenuActive' : 'aboutMenuWhite')} to="/about"></NavLink>
                    <div className="dashWhite hidden lg:inline-block"></div>
                </li>
                <li className="nav-item"><NavLink  className={(navData) => (navData.isActive ? 'docsMenuActive' : 'docsMenuWhite')} to="/docs"></NavLink></li>
                </ul>
            </div>
            </div>
        </nav>
    </>

  )
}
