import Link from "next/link";
import { Button } from "../../components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
            Nirvalla Tasks
          </h1>
          <div className="w-16 h-px bg-gray-300 mx-auto" />
        </div>

        {/* Main headline */}
        <h2 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-normal text-gray-900 mb-6 leading-tight">
          Tasks, Without
          <br />
          <span className="italic">the Chaos</span>
        </h2>

        {/* Subheadline */}
        <p className="font-inter text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Nirvalla Tasks is a minimal, distraction-free task management app
          designed to help you think clearly, plan intentionally, and act
          mindfully. Built for creatives, developers, and anyone who wants more
          control over their lives.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg font-medium transition-colors"
          >
            <Link href="/app">Start Using Nirvalla</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-medium transition-colors"
          >
            Learn More
          </Button>
        </div>

        {/* Tagline */}
        <p className="font-inter text-sm text-gray-500 mt-8 italic">
          Methodology-First Productivity app
        </p>
      </div>
    </section>
  );
};
