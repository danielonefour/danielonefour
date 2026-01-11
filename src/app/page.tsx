import React from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { getAllServices } from "@/lib/contentful";
import { getFeaturedBlogPosts } from "@/lib/contentful";
import { getUpcomingEvents } from "@/lib/contentful-events";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/layout/HeroSection";
import AboutMeSection from "@/components/home/AboutMeSection";
import BookSection from "@/components/home/BookSection";
import InfiniteScroll from "@/components/layout/InfiniteScroll";

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="py-16 flex justify-center">
    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Dynamic imports with loading fallbacks

const ClientsSection = dynamic(
  () => import("@/components/home/ClientsSection"),
  {
    loading: () => <LoadingSpinner />,
  }
);

const ServicesSection = dynamic(
  () => import("@/components/home/ServicesSection"),
  {
    loading: () => <LoadingSpinner />,
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/home/TestimonialsSection"),
  {
    loading: () => <LoadingSpinner />,
  }
);

const BlogSection = dynamic(() => import("@/components/home/BlogSection"), {
  loading: () => <LoadingSpinner />,
});

export const metadata: Metadata = {
  title: "Daniel One Four - Coaching, Training, and Consulting",
  description:
    "Empower your leadership journey with Daniel One Four. We provide executive coaching, leadership training, and consulting services.",
};

// Revalidate page every 10 minutes
export const revalidate = 600;

export default async function Home() {
  // Fetch critical data in parallel at build time
  const [initialServices, initialPosts] = await Promise.all([
    getAllServices(),
    getFeaturedBlogPosts(),
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <InfiniteScroll />
        

        <ClientsSection />

        <ServicesSection initialServices={initialServices} />

        <BookSection />

        <TestimonialsSection />
        <BlogSection initialPosts={initialPosts} />
                <InfiniteScroll />

      </main>
      <Footer />
    </>
  );
}
