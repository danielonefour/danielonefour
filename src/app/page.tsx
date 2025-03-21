import type { NextPage } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import ClientsSection from '@/components/home/ClientsSection'
import ProgramsSection from '@/components/home/ProgramsSection'
import ServicesSection from '@/components/home/ServicesSection'
import EventsSection from '@/components/home/EventsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import BlogSection from '@/components/home/BlogSection'
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection'
import WhyChooseSection from '@/components/home/WhyChooseSection'
const Home: NextPage = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ClientsSection />
        <ProgramsSection />
        <ServicesSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <EventsSection />
        <BlogSection />
      </main>
      <Footer />
    </>
  )
}

export default Home
