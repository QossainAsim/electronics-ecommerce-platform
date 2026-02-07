// *********************
// Role of the component: Footer component
// Name of the component: Footer.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <Footer />
// Input parameters: no input parameters
// Output: Footer component
// *********************

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <Image
                  src="/logo v1.png"
                  alt="Singitronic logo"
                  width={200}
                  height={80}
                  className="h-auto w-auto brightness-0 invert"
                />
              </Link>
              <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                Your trusted destination for premium electronics and cutting-edge technology. 
                Quality products, exceptional service.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>+381 61 123 321</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>test@email.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
                  <span>Belgrade, Serbia</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                <a
                  href="#"
                  className="p-2 bg-neutral-800 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-neutral-800 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-neutral-800 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-neutral-800 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
              {/* Sale Section */}
              <div>
                <h3 className="text-base font-bold text-white mb-4">
                  Sale
                </h3>
                <ul role="list" className="space-y-3">
                  <li>
                    <Link
                      href="/deals"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Deals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coupons"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Coupons
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Categories Section */}
              <div>
                <h3 className="text-base font-bold text-white mb-4">
                  Categories
                </h3>
                <ul role="list" className="space-y-3">
                  <li>
                    <Link
                      href="/category/cameras"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/headphones"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Headphones
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/laptops"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Laptops
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/mobile"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Mobile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/pcs"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      PCs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/printers"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Printers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/smart-watches"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Smart Watches
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/tablets"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Tablets
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Section */}
              <div>
                <h3 className="text-base font-bold text-white mb-4">
                  Support
                </h3>
                <ul role="list" className="space-y-3">
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/customer-service"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Customer Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/track-order"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Track Order
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/help"
                      className="text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-neutral-800 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-white mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-sm text-neutral-400">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
            <p className="text-neutral-400">
              © {currentYear} Singitronic. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="text-neutral-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-neutral-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-neutral-400 hover:text-blue-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;