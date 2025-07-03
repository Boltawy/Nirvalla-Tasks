
export const Benefits = () => {
  const comparisons = [
    {
      problem: "Notion",
      solution: "Overwhelming complexity and feature bloat",
      benefit: "Simple, focused task management without the database complexity"
    },
    {
      problem: "Todoist",
      solution: "Gamification and pressure-driven design",
      benefit: "Calm, mindful approach that reduces anxiety and promotes focus"
    },
    {
      problem: "Traditional Tools",
      solution: "One-size-fits-all approach",
      benefit: "Designed specifically for neurodivergent users who need clarity without clutter"
    }
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
            We believe productivity tools should enhance your natural workflow, not fight against it.
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
                <p className="font-inter text-gray-700 mb-4">
                  {item.solution}
                </p>
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
            "Finally, a task manager that feels like a gentle companion rather than a demanding taskmaster."
          </blockquote>
          <p className="font-inter text-gray-500 mt-4">
            — The Nirvalla Philosophy
          </p>
        </div>
      </div>
    </section>
  );
};
