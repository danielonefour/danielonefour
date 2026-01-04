"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, ShoppingCart } from "lucide-react";

export default function BookSection() {
  return (
    <section className="py-24 bg-white overflow-hidden" id="book">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] items-center gap-12 lg:gap-20">
          {/* Left: Book Cover */}
          <div className="relative w-full flex justify-center lg:justify-start" data-aos="fade-right">
            <div className="relative group lg:-ml-10">
              {/* Shadow effect */}
              <div className="absolute -inset-4 bg-brand-blue/10 rounded-3xl blur-2xl group-hover:bg-brand-blue/20 transition-all duration-500"></div>
              
              <Image
                src="/book-cover.png"
                alt="Time Stamp - Oyinkansola Adedapo"
                width={400}
                height={600}
                className="relative z-10 w-64 md:w-80 lg:w-[450px] h-auto object-contain rounded-lg shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full space-y-8" data-aos="fade-left">
            <div className="space-y-4">
              <h2 className="text-brand-blue font-bold tracking-widest uppercase text-sm">
                Published Work
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Time Stamp: <span className="text-brand-orange">Fill Your Titles With Life</span>
              </h1>
            </div>

            <div className="space-y-6 text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl">
              <p>
                In <strong>Time Stamp</strong>, Oyinkansola Adedapo invites us on a deeply personal journey through the shifting seasons of her life, from childhood memories and family upheavals to milestones of marriage, motherhood, and mentorship.
              </p>
              <p>
                With honesty and grace, she explores how every title we bear — daughter, wife, mother, leader — leaves an imprint on those around us, and how our personal stories become part of a much greater script written by God.
              </p>
              <p className="italic text-brand-blue font-medium border-l-4 border-brand-orange pl-6 py-2">
                "This is not just a memoir, it is a mirror. One that reflects your own journey, reminds you of God's redemptive power, and urges you to live meaningfully beyond the labels."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <a
                href="https://www.amazon.com/Time-Stamp-Fill-Your-Titles-ebook/dp/B0FS37K3VC/ref=sr_1_1?crid=HI5WUED2AF2C&dib=eyJ2IjoiMSJ9.h-H8iYuKdLPyRROZzaEbJQ.y3GRINPfj6e13p7X_4heOT7i7G6oxXnZ8TEDYgVZ2ro&dib_tag=se&keywords=Time+Stamp+Oyinkansola+Adedapo&qid=1766336733&sprefix=time+stamp+oyinkansola+adedapo%2Caps%2C697&sr=8-1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 text-center focus:ring-4 focus:ring-slate-200"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy on Amazon
              </a>
              <a
                href="https://www.amber-hive.com/book/undefined" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-brand-blue border-2 border-brand-blue font-bold px-8 py-4 rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition-all duration-300 transform hover:scale-105 text-center focus:ring-4 focus:ring-blue-100"
              >
                <BookOpen className="w-5 h-5" />
                Get on AmberHive
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
