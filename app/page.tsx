import React from "react";
import Link from "next/link";
import { Check, Circle, Star } from "lucide-react";

import { Button } from "./global-components/ui/button";
import { interFont, playfairFont } from "./layout";
import NoWrap from "./global-components/NoWrap";

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
          <Link href="/tasks-app">
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg font-medium transition-colors"
            >
              Start Using Nirvalla
            </Button>
          </Link>
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

const Features = () => {
  const features = [
    {
      icon: <Circle className="w-6 h-6" />,
      title: "Gentle Focus",
      description:
        "A clean, distraction-free interface that respects your mental bandwidth and helps you stay in flow.",
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: "Mindful Organization",
      description:
        "Structured task management without the overwhelming complexity of traditional productivity tools.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Flow-Friendly Design",
      description:
        "Built for knowledge workers, creatives, and anyone who values clarity over chaos in their workflow.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h3 className="font-playfair text-4xl sm:text-5xl font-normal text-gray-900 mb-4">
            Minamalistic <span className="italic">Design</span>
          </h3>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            Every element and interaction is thoughtfully crafted to reduce
            cognitive load and increase clarity, You are the master of the tool,
            not the other way around.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center group animate-fade-in"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-6 group-hover:shadow-md transition-shadow">
                <div className="text-gray-700">{feature.icon}</div>
              </div>
              <h4 className="font-playfair text-2xl font-medium text-gray-900 mb-4">
                {feature.title}
              </h4>
              <p className="font-inter text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  const comparisons = [
    {
      problem: "Notion",
      solution: "Overwhelming complexity and feature bloat",
      benefit:
        "Simple, focused task management without the database complexity",
    },
    {
      problem: "Todoist",
      solution: "Gamification and pressure-driven design",
      benefit: "Calm, mindful approach that reduces anxiety and promotes focus",
    },
    {
      problem: "Traditional Tools",
      solution: "One-size-fits-all approach",
      benefit:
        "Designed specifically for neurodivergent users who need clarity without clutter",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h3 className="font-playfair text-4xl sm:text-5xl font-normal text-gray-900 mb-4">
            Why <span className="italic">Nirvalla</span>?
          </h3>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            We believe productivity tools should enhance your natural workflow,
            not fight against it.
          </p>
        </div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-lg hover:bg-gray-100 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="mb-6">
                <h4 className="font-inter text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  {item.problem}
                </h4>
                <p className="font-inter text-gray-700 mb-4">{item.solution}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h5 className="font-inter text-sm font-medium text-gray-900 uppercase tracking-wide mb-2">
                  Nirvalla Approach
                </h5>
                <p className="font-inter text-gray-700 font-medium">
                  {item.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional benefit statement */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <blockquote className="font-playfair text-2xl sm:text-3xl text-gray-700 italic leading-relaxed">
            "Finally, a task manager that feels like a gentle companion rather
            than a demanding taskmaster."
          </blockquote>
          <p className="font-inter text-gray-500 mt-4">
            — The Nirvalla Philosophy
          </p>
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="font-playfair text-4xl sm:text-5xl font-normal mb-6">
          Clear Your Mind <span className="italic">Today</span>
        </h3>

        <p className="font-inter text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of knowledge workers, creatives, and thoughtful
          individuals who've discovered the joy of frictionless productivity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 text-lg font-medium transition-colors"
          >
            Start Using Nirvalla
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 text-lg font-medium transition-colors"
          >
            View Demo
          </Button>
        </div>

        <p className="font-inter text-sm text-gray-500 mt-8">
          Free to start • No credit card required • Available on all platforms
        </p>
      </div>
    </section>
  );
};

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "#demo" },
      { name: "Download", href: "#download" },
    ],
    company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" },
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Status", href: "#status" },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="md:col-span-1">
            <h4 className="font-playfair text-2xl font-semibold text-gray-900 mb-4">
              Nirvalla Tasks
            </h4>
            <p className="font-inter text-gray-600 mb-4 leading-relaxed">
              Mindful productivity for the modern knowledge worker.
            </p>
            <p className="font-inter text-sm text-gray-500 italic">
              Flow-friendly task management.
            </p>
          </div>

          {/* <div>
            <h5 className="font-inter text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Product
            </h5>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="font-inter text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-inter text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Company
            </h5>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="font-inter text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-inter text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Support
            </h5>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="font-inter text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-inter text-gray-500 text-sm">
            © 2024 Nirvalla Tasks. All rights reserved.
          </p>
          <p className="font-inter text-gray-500 text-sm mt-4 md:mt-0 italic">
            Made with intention and care.
          </p>
        </div>
      </div>
    </footer>
  );
};
