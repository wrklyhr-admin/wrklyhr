"use client";

import Marquee from "react-fast-marquee";

const functions = [
  "Product Management",
  "Software Engineering",
  "Data Science & AI",
  "UX / Product Design",
  "Sales & Revenue",
  "Marketing & Growth",
  "Finance & Accounting",
  "Human Resources",
  "DevOps & Infrastructure",
  "Legal & Compliance",
  "Customer Success",
  "Operations",
  "Executive Leadership",
  "Cybersecurity",
  "Business Intelligence",
];

export default function MarqueeStrip() {
  return (
    <div className="bg-primary py-4 overflow-hidden">
      <Marquee speed={50} gradient={false} pauseOnHover>
        {functions.map((fn) => (
          <span
            key={fn}
            className="inline-flex items-center gap-3 mx-8 text-white font-syne font-semibold text-sm uppercase tracking-widest whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-highlight flex-shrink-0" />
            {fn}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
