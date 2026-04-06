"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Clock, Crown, ArrowUpRight } from "lucide-react";

const cards = [
  {
    icon: Users,
    title: "Permanent Hiring",
    desc: "We source and vet exceptional full-time talent aligned to your culture, competencies, and long-term growth goals. End-to-end process management included.",
    features: ["Role briefing & spec", "Multi-source talent search", "Structured interviews", "Offer negotiation support"],
    color: "from-primary to-accent",
    badge: "Most Popular",
  },
  {
    icon: Clock,
    title: "Contract Staffing",
    desc: "Need to scale fast? Access pre-vetted contractors and interim professionals ready to plug in within days — not weeks.",
    features: ["24–48hr shortlist", "Fully managed payroll", "Flexible terms", "IR35 compliant"],
    color: "from-accent to-violet-400",
    badge: null,
  },
  {
    icon: Crown,
    title: "Executive Search",
    desc: "Discreet, research-led executive search for C-suite and senior leadership roles. We map markets, not just job boards.",
    features: ["Market mapping", "Confidential outreach", "Board-level briefings", "Psychometric assessment"],
    color: "from-violet-600 to-primary",
    badge: "Premium",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-24 bg-bgLight" ref={ref}>
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            What We Do
          </span>
          <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-bgDark leading-tight mb-4">
            Recruitment Solutions <br />
            <span className="text-gradient">Built Around You</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Whether you need one hire or a hundred, we have a service designed for your situation.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                className="relative group rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {card.badge && (
                  <span className="absolute top-6 right-6 text-xs font-bold bg-highlight/15 text-highlight px-3 py-1 rounded-full">
                    {card.badge}
                  </span>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-syne text-2xl font-bold text-bgDark mb-3">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{card.desc}</p>

                <ul className="mt-auto space-y-2 mb-8">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-highlight flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:text-accent transition-colors"
                >
                  Get Started <ArrowUpRight className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
