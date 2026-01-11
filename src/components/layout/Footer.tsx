// components/Footer.js
"use client";
import React, { useState } from "react";
import logoFooter from "@/assets/images/logo-standard.png";
import { FiLoader, FiCheck, FiX } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaMailBulk,
} from "react-icons/fa";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";

const Footer = () => {
  const { data: companyDetails, isLoading } = useCompanyDetails();

  // Newsletter form state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !email.includes("@")) {
      setSubmitStatus("error");
      setStatusMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      // Success
      setSubmitStatus("success");
      setStatusMessage(data.message || "Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      setSubmitStatus("error");
      setStatusMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Reset status when user starts typing again
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setStatusMessage("");
    }
  };
  return (
    <footer className="bg-black border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between pb-8 border-b border-gray-200">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <Link href="/" prefetch>
              <Image
                src={logoFooter}
                alt="Daniel One Four"
                height={80}
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm my-4 mb-6">
              {companyDetails?.introTagLine}{" "}
            </p>

            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-brand-blue hover:text-brand-blue">
                <FaMailBulk size={24} />
              </a>
              <a
                href="https://www.facebook.com/share/1A6DpWQpix/?mibextid=wwXIfr"
                className="text-brand-blue hover:text-brand-blue"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="https://www.instagram.com/oyinkansolaadedapo?igsh=bXU4eDczajAxMmJs&utm_source=qr"
                className="text-brand-blue hover:text-brand-blue"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/oyinkansola-adedapo-102510264?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                className="text-brand-blue hover:text-brand-blue"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div className="flex justify-start md:justify-center w-full md:w-1/3 mb-8 md:mb-0 lg:mr-6">
            <div>
              <h4 className="font-semibold text-gray-400 mb-4">Quicklinks...</h4>
              <ul className="space-y-2 lg:space-y-4 text-gray-400 text-sm">
                <li>
                  <Link href="/about" className="hover:text-purple-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/#about-me" className="hover:text-purple-600">
                    The Visionary
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-purple-600">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link href="/#book" className="hover:text-purple-600">
                    The Book
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-purple-600">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <h4 className="font-semibold text-gray-400 mb-4">
              Stay in the loop!
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for updates, expert tips, special
              offers and regular inspiration.
            </p>
            <div className="flex">
              <form className="mb-4" onSubmit={handleNewsletterSubmit}>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="your mail address"
                    className="flex-grow p-5 border border-gray-400 rounded-l-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    className="bg-brand-orange text-gray-800 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-r-full hover:bg-yellow-500 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <FiLoader className="animate-spin" size={24} />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>

                {/* Status message */}
                {submitStatus === "success" && (
                  <div className="flex items-center mt-2 text-green-600">
                    <FiCheck className="mr-2" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-center mt-2 text-red-600">
                    <FiX className="mr-2" />
                    <span>{statusMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p className="mb-2 md:mb-0">
            © 2025 Daniel One Four. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">
              Terms & Conditions
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
