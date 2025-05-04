import Link from "next/link"

interface FooterProps {
  minimal?: boolean
}

export function Footer({ minimal = false }: FooterProps) {
  const currentYear = new Date().getFullYear()

  if (minimal) {
    return (
      <footer className="border-t border-[#2a2a2a] py-2 sm:py-3 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-0">
          <div className="text-[10px] xs:text-xs text-gray-500 text-center sm:text-left">
            © {currentYear} Sweepo. All rights reserved.
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/terms" className="text-[10px] xs:text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-[10px] xs:text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-[#2a2a2a] py-4 sm:py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-white text-sm font-medium mb-3 sm:mb-4">Sweepo</h3>
            <p className="text-gray-400 text-xs mb-3 sm:mb-4">
              Powerful data cleaning and analysis tools to transform your workflow.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white text-sm font-medium mb-3 sm:mb-4">Product</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-medium mb-3 sm:mb-4">Resources</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/documentation" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="text-white text-sm font-medium mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-xs transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2a2a2a] pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-[10px] xs:text-xs text-gray-500 mb-3 sm:mb-0 text-center sm:text-left">
            © {currentYear} Sweepo. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <Link href="/terms" className="text-[10px] xs:text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-[10px] xs:text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-[10px] xs:text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              Cookies
            </Link>
            <Link href="/help" className="text-[10px] xs:text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
