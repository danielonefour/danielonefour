import Image from "next/image";

export default function HeroSection() {
  const stats = [
    { value: "120+", label: "Countries Reached" },
    { value: "600+", label: "Courses Available" },
  ];

  return (
    <section className="relative min-h-screen bg-brand-blue text-white flex items-center py-24 md:py-32 overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-1/2 h-full bg-gradient-to-r from-brand-blue to-transparent transform -skew-x-12 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10 w-full px-6 md:px-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="flex flex-col justify-center space-y-8" data-aos="fade-up">

          <header className="space-y-6">

            <div className="flex items-center space-x-3 text-zinc-200 mt-5">
              <Crown className="h-7 w-7" />
              <span className="text-sm font-bold tracking-widest uppercase zinc-700">
                School Of Leadership & Etiquette
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-snug sm:leading-normal">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-brand-orange">
                Empowering <br />
              </span>{" "}
              Young People <br />to Lead Change.
            </h1>


            <p className="text-zinc-100 text-lg max-w-xl">
              At Leagues, we help young people develop emotional intelligence, be socially elegant, and globally relevant through our courses in leadership and etiquette.
            </p>
          </header>

          {/* CTA Button */}
          <button className="bg-brand-yellow text-neutral-900 font-bold px-10 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-yellow-400 w-max">
            Get Started Today
          </button>


        </div>

        {/* Right Image */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[550px]" data-aos="fade-left" data-aos-delay="200">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/author/leader-chess.jpg"
              alt="Oyinkansola Adedapo - Leadership Coach"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-neutral-900 opacity-20 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
