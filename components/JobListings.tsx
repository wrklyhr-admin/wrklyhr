"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Clock, Bookmark, ArrowRight } from "lucide-react";

const categories = ["All", "Marketing", "Finance", "Healthcare", "Education", "Creative", "Engineering", "Remote"];

const jobs = [
  {
    id: 1,
    title: "Data Scientist",
    company: "Google",
    location: "New York, USA",
    salary: "$8.3k – $9.9k/mo",
    type: "Full-time",
    posted: "2 days ago",
    category: "Engineering",
    featured: false,
    logo: "G",
    logoColor: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "UX Consultant",
    company: "Meta",
    location: "San Francisco, CA",
    salary: "$11.5k – $13.8k/mo",
    type: "Full-time",
    posted: "1 day ago",
    category: "Creative",
    featured: true,
    logo: "M",
    logoColor: "bg-white/20 text-white",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Stripe",
    location: "Austin, TX",
    salary: "$10.2k – $12.3k/mo",
    type: "Full-time",
    posted: "3 days ago",
    category: "Engineering",
    featured: true,
    logo: "S",
    logoColor: "bg-white/20 text-white",
  },
  {
    id: 4,
    title: "Cloud Engineer",
    company: "AWS",
    location: "Seattle, WA",
    salary: "$12.4k – $14.8k/mo",
    type: "Contract",
    posted: "Today",
    category: "Engineering",
    featured: false,
    logo: "A",
    logoColor: "bg-orange-100 text-orange-600",
  },
  {
    id: 5,
    title: "Machine Learning Eng.",
    company: "OpenAI",
    location: "Remote",
    salary: "$11.8k – $13.8k/mo",
    type: "Full-time",
    posted: "5 days ago",
    category: "Engineering",
    featured: false,
    logo: "O",
    logoColor: "bg-green-100 text-green-600",
  },
  {
    id: 6,
    title: "Growth Marketer",
    company: "Notion",
    location: "New York, USA",
    salary: "$7.5k – $9.2k/mo",
    type: "Part-time",
    posted: "1 week ago",
    category: "Marketing",
    featured: false,
    logo: "N",
    logoColor: "bg-gray-100 text-gray-700",
  },
  {
    id: 7,
    title: "Healthcare Analyst",
    company: "Nuance",
    location: "Boston, MA",
    salary: "$9.0k – $11.5k/mo",
    type: "Full-time",
    posted: "2 days ago",
    category: "Healthcare",
    featured: false,
    logo: "N",
    logoColor: "bg-teal-100 text-teal-600",
  },
  {
    id: 8,
    title: "Financial Advisor",
    company: "Goldman Sachs",
    location: "New York, USA",
    salary: "$13k – $16k/mo",
    type: "Full-time",
    posted: "Today",
    category: "Finance",
    featured: false,
    logo: "GS",
    logoColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 9,
    title: "Curriculum Designer",
    company: "Coursera",
    location: "Remote",
    salary: "$6.5k – $8.0k/mo",
    type: "Contract",
    posted: "4 days ago",
    category: "Education",
    featured: false,
    logo: "C",
    logoColor: "bg-indigo-100 text-indigo-600",
  },
];

export default function JobListings() {
  const [active, setActive] = useState("All");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filtered = active === "All" ? jobs : jobs.filter((j) => j.category === active);

  return (
    <section id="jobs" ref={ref} className="py-24 bg-bgLight">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Opportunities
            </span>
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Latest Job Opportunities
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-sm flex-shrink-0">
            View all jobs <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat ? "tab-active shadow-md" : "tab-inactive"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Job cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className={`relative group rounded-3xl p-6 flex flex-col gap-5 transition-all duration-300 ${
                job.featured
                  ? "bg-primaryDark text-white shadow-lg"
                  : "bg-white text-gray-900 shadow-card hover:shadow-cardHover"
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${job.logoColor} ${!job.featured ? "border border-gray-100" : ""}`}>
                  {job.logo}
                </div>
                <button className={`p-2 rounded-full transition-colors ${job.featured ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-primaryLight text-gray-400 hover:text-primary"}`}>
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Job info */}
              <div>
                <h3 className={`font-jakarta font-bold text-lg mb-1 ${job.featured ? "text-white" : "text-gray-900"}`}>
                  {job.title}
                </h3>
                <p className={`text-sm mb-3 ${job.featured ? "text-white/70" : "text-gray-500"}`}>
                  {job.company}
                </p>
                <div className={`flex items-center gap-3 text-xs ${job.featured ? "text-white/60" : "text-gray-400"}`}>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {job.posted}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-opacity-10" style={{ borderColor: job.featured ? "rgba(255,255,255,0.15)" : "#e5e7eb" }}>
                <div>
                  <p className={`font-jakarta font-bold text-sm ${job.featured ? "text-white" : "text-primary"}`}>
                    {job.salary}
                  </p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    job.featured ? "bg-white/15 text-white/80" : "bg-primaryLight text-primary"
                  }`}>
                    {job.type}
                  </span>
                </div>
                <button className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  job.featured
                    ? "bg-white text-primaryDark hover:bg-primaryLight"
                    : "bg-primary text-white hover:bg-primaryDark"
                }`}>
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
