"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; // Changed from <img> to <Image> for Next.js best practice
import Logo from "@/assets/images/logo-standard.png";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname(); // Get current pathname

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const accentColors = {
    text: "text-brand-primary",
    bg: "bg-cyan-500",
    hoverText: "hover:text-brand-primary",
    hoverBg: "hover:bg-brand-primary",
    ring: "focus:ring-cyan-500",
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/90 shadow-xl backdrop-blur-lg py-2"
          : "bg-transparent py-3"
      }`}
      aria-label="Main navigation"
    >
      <div
        className={`
          flex justify-between items-center
          transition-all duration-300 ease-in-out
          rounded-full shadow-xl
          ${isScrolled ? "bg-white/90" : "bg-white/80"}
          w-[calc(100%-1rem)] max-w-7xl mx-auto
          px-4 sm:px-6 md:px-8
          py-2
        `}
      >
        <Link href="/" className="flex items-center" aria-label="Home">
          <Image
            src={Logo}
            alt="Company Logo"
            className="w-16 h-auto md:w-24 transition-all duration-200"
            draggable={false}
          />
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`relative text-base lg:text-lg font-medium text-gray-700 group
                  ${accentColors.hoverText} transition-colors duration-200
                  ${
                    pathname === link.path
                      ? `${accentColors.text} font-semibold`
                      : ""
                  }`}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 ${
                  accentColors.bg
                } transform origin-left transition-all duration-300 ease-out
                  ${
                    pathname === link.path
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-75 group-hover:opacity-100"
                  }`}
              ></span>
            </Link>
          ))}
          <Link
            href="/contact"
            className="group flex items-center border-brand-primary bg-brand-blue hover:bg-brand-yellow text-white font-medium rounded-full px-6 py-3 text-base lg:text-lg
              shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-brand-primary border"
          >
            Get In Touch
            <span
              className={`bg-brand-orange text-[#5a3d35] rounded-full p-2 ml-2 transition-transform duration-200 group-hover:rotate-45`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            ref={mobileMenuButtonRef}
            className={`text-white bg-brand-blue rounded-full focus:outline-none focus:ring-2 ${accentColors.ring} p-2 transition-transform duration-200 active:scale-90`}
            aria-label={
              isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
            }
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-8 h-8 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/70 transition-opacity duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed top-0 right-0 w-full h-screen bg-brand-yellow shadow-2xl z-50 transform transition-transform duration-500
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col pt-10 pb-8 px-7 space-y-6 overflow-y-auto text-white
        `}
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          boxShadow: "none",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex items-center w-full">
          <div className="flex items-center">
            <Image src={Logo} alt="Logo" className="w-24 h-auto md:w-32 mr-2" />
          </div>

          <button
            className="ml-auto text-brand-blue focus:outline-none transition-colors duration-200"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <svg
              width="40"
              height="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={closeMobileMenu}
              className={`block text-2xl font-bold tracking-normal px-0 py-2 rounded-lg transition-all duration-200 text-left ${
                pathname === link.path
                  ? "text-brand-blue"
                  : "text-[#1f2937] hover:text-brand-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-3 flex flex-col items-start gap-6 w-full">
          <div className="flex items-center text-brand-blue font-medium text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.5 5.5a2 2 0 002.4 0L21 8M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
              />
            </svg>

            <a
              href="mailto:danielonefour14@gmail.com"
              className="text-left"
            >
              danielonefour14@gmail.com
            </a>
          </div>
          <p className="text-gray-700 text-left text-base pr-4">
We're here to help you with any questions you might have.

          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-blue p-3 rounded-2xl text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-blue p-3 rounded-2xl text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
              aria-label="X (formerly Twitter)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-blue p-3 rounded-md text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-blue p-3 rounded-md text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.337 10.697 22.394 0h-2.05l-7.805 9.14L6.3 0H0l9.437 13.59L0 24h2.05l8.235-9.646L17.7 24H24L13.337 10.697Zm-2.02 2.367-.953-1.378L3.111 1.56h2.552l6.47 9.357.953 1.378 7.458 10.776h-2.552l-6.675-9.007Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
