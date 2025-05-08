"use client";

import { Box } from "@chakra-ui/react";
import { useAnimation } from "framer-motion";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingSection from "@/components/sections/PricingSection";
import ContactSection from "@/components/sections/ContactSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HeroSection from "@/components/sections/HeroSection";
import CTASection from "@/components/sections/CTASection";

export default function LandingPage() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <Box bg="white" position="relative" overflow="hidden">
      <Header />
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeaturesSection />
      {/* Pricing Section */}
      <PricingSection />
      {/* Contact Section */}
      <CTASection />
      <ContactSection />
      <Footer />
    </Box>
  );
}
