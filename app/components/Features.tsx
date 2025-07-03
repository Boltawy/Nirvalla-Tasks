import { Check, Circle, Star } from "lucide-react";

export const Features = () => {
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
