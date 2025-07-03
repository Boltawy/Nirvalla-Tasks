
export const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "#demo" },
      { name: "Download", href: "#download" }
    ],
    company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" }
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Status", href: "#status" }
    ]
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
