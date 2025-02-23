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

export default function LandingPage() {
  const controls = useAnimation();

  // Scroll-based gradient animation

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <Box
      bg="white"
      position="relative"
      overflow="hidden"
      bgGradient="linear(to-br, #E0F7FA, #F3E5F5)"
    >
      <Header />
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeaturesSection />
      {/* Pricing Section */}
      <PricingSection />
      {/* Contact Section */}
      <ContactSection />
      <Footer />
    </Box>
  );
}
