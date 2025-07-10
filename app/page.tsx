import React from "react";
import { Features } from "./components/Features";
import { Benefits } from "./components/Benefits";
import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";
import Nav from "./components/Nav";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { interFont, playfairFont } from "./layout";
import NoWrap from "./components/NoWrap";

export default function Landing() {
  return (
    <div>
      <Hero />
      {/* <Features />
      <Benefits />
      <CallToAction />
      <Footer /> */}
    </div>
  );
}

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-28 md:mt-4 lg:mg-2">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
            Nirvalla Tasks
          </h1>
          <div className="w-16 h-px bg-gray-300 mx-auto" />
        </div>

        {/* Main headline */}
        <h2
          className="text-7xl sm:text-7xl lg:text-7xl font-bold text-gray-900 mb-6 !leading-[4rem] sm:!leading-[4rem]"
          style={{ fontFamily: playfairFont.style.fontFamily }}
        >
          Organize <NoWrap>your life</NoWrap>,
          <br />
          <span className=" inline-block italic text-gray-700 pt-2 md:pt-0 text-6xl sm:text-6xl lg:text-6xl h-12 !leading-[3.25rem]">
            one task <NoWrap>at a time</NoWrap>.
          </span>
        </h2>

        {/* Subheadline */}
        <p className="font-inter text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Nirvalla Tasks is a minimal personal task management app designed to
          help you think clearly, plan intentionally, and act mindfully. Built
          for creatives, developers, and anyone who wants more control over
          their lives.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg font-medium transition-colors"
          >
            <Link href="/app">Start Using Nirvalla</Link>
          </Button>
          {/* <Button
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-medium transition-colors"
          >
            Learn More
          </Button> */}
        </div>

        {/* Tagline */}
        <p className="font-inter text-sm text-gray-500 mt-8 italic">
          Methodology-First Productivity app
        </p>
      </div>
    </section>
  );
};
