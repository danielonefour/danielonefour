'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoWithFallback from './LogoWithFallback';
import { HiPhone, HiMenu, HiX } from 'react-icons/hi';
import HoleButton from '@/components/ui/HoleButton';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { data: companyDetails, isLoading } = useCompanyDetails();

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { text: 'Home', href: '/' },
    { text: 'About Us', href: '/about' },
    { text: 'Events', href: '/events' },
    { text: 'Services', href: '/services' },
    { text: 'Blog', href: '/blog' },
    { text: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className={`py-3 pb-6 px-6 md:px-12 lg:px-20 flex justify-between items-center relative transition-colors duration-300 ${isHomePage ? 'bg-white' : 'bg-header-bg'}`}>
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center" prefetch>
          <LogoWithFallback />
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-black hover:text-gray-800 font-medium"
            prefetch
          >
            {link.text}
          </Link>
        ))}
      </nav>
      
      {/* Desktop Contact and CTA */}
      <div className="hidden md:flex items-center space-x-6">
        <a href={`tel:${companyDetails?.primaryPhoneNumber}`} className="flex items-center text-black">
          <div className="flex items-center justify-center mr-2">
            <HiPhone size={18} />
          </div>
          <span className="font-medium">{companyDetails?.primaryPhoneNumber}</span>
        </a>
        <HoleButton 
          href="/contact"
          bgColorClass={isHomePage ? "bg-brand-orange" : "bg-brand-orange"}
        >
          <span className="mr-4">Get In Touch</span>
        </HoleButton>
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-black z-50" 
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-header-bg z-40 transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden overflow-y-auto`}
        style={{ top: '0' }}
      >
        <div className="flex flex-col min-h-screen p-6 pt-20">
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
            <Link href="/" className="flex items-center" prefetch onClick={() => setMobileMenuOpen(false)}>
              <LogoWithFallback />
            </Link>
          </div>
          <nav className="flex flex-col space-y-6 mb-8 mt-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-black hover:text-gray-800 font-medium text-lg"
                onClick={() => setMobileMenuOpen(false)}
                prefetch
              >
                {link.text}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pb-6">
            {companyDetails?.primaryPhoneNumber && (
              <a href={`tel:${companyDetails?.primaryPhoneNumber}`} className="flex items-center text-black mb-6">
                <div className="flex items-center justify-center mr-2">
                  <HiPhone size={18} />
                </div>
                <span className="font-medium">{companyDetails?.primaryPhoneNumber}</span>
              </a>
            )}
            <HoleButton 
              href="/contact" 
              className="w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
              bgColorClass="bg-brand-orange"
            >
              <span className="mr-4">Get In Touch</span>
            </HoleButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 