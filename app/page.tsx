import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import JobListings from "@/components/JobListings";
import HowItWorks from "@/components/HowItWorks";
import Insights from "@/components/Insights";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <JobListings />
      <HowItWorks />
      <Insights />
      <Testimonials />
      <CTABanner />
      <Footer />
    </>
  );
}
