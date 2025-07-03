
import { Button } from "@/components/ui/button";

export const CallToAction = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="font-playfair text-4xl sm:text-5xl font-normal mb-6">
          Clear Your Mind <span className="italic">Today</span>
        </h3>
        
        <p className="font-inter text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of knowledge workers, creatives, and thoughtful individuals who've discovered 
          the joy of frictionless productivity.
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
