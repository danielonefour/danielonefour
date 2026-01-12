import React from "react";

export default function InfiniteScroll() {
  const items = ["Leadership", "Etiquette", "Global", "Social", "Elevation"];

  return (
    <div className="overflow-hidden whitespace-nowrap bg-brand-orange py-8">
      <div className="flex animate-scroll">
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            className="mx-4 sm:mx-8 md:mx-12 text-2xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tighter"
          >
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  );
}
