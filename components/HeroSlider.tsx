// *********************
// Role of the component: Premium hero banner with multiple overlapping product images
// Name of the component: HeroSlider.tsx
// Developer: Qossain
// Version: 5.0 (Final - Color scheme and links corrected)
// Component call: <HeroSlider />
// Input parameters: no input parameters
// Output: Hero slider with multiple products and promotional boxes (responsive)
// *********************

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, Gift, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductImage {
  src: string;
  alt: string;
  size: "large" | "medium" | "small";
  position: string;
  zIndex: number;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  products: ProductImage[];
  buttonText: string;
  buttonLink: string;
  bgGradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "PREMIUM AUDIO",
    subtitle: "Wireless Earbuds & Headphones",
    description: "Experience crystal-clear sound with our latest wireless audio collection. Premium comfort meets cutting-edge technology.",
    products: [
      {
        src: "/earbuds 4.webp",
        alt: "Wireless Earbuds",
        size: "large",
        position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        zIndex: 30
      },
      {
        src: "/earbuds 6.webp",
        alt: "Earbuds",
        size: "medium",
        position: "top-[20%] right-[10%]",
        zIndex: 20
      },
      {
        src: "/handfree 1.webp",
        alt: "Handfree",
        size: "small",
        position: "bottom-[15%] left-[15%]",
        zIndex: 10
      }
    ],
    buttonText: "Shop Audio",
    buttonLink: "/category/headphones",
    bgGradient: "from-purple-600 via-pink-600 to-blue-600",
  },
  {
    id: 2,
    title: "POWER UP",
    subtitle: "Fast Chargers & Power Banks",
    description: "Never run out of power. Premium chargers and high-capacity power banks to keep you connected all day.",
    products: [
      {
        src: "/power bank 1.webp",
        alt: "Power Bank",
        size: "large",
        position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        zIndex: 30
      },
      {
        src: "/power bank 4.webp",
        alt: "Solar Power Bank",
        size: "medium",
        position: "top-[25%] right-[5%]",
        zIndex: 20
      },
      {
        src: "/power bank 5.webp",
        alt: "Fast Charger",
        size: "small",
        position: "bottom-[20%] left-[10%]",
        zIndex: 15
      },
    ],
    buttonText: "Browse Power",
    buttonLink: "/category/mobile-accessories",
    bgGradient: "from-blue-600 via-cyan-600 to-teal-500",
  },
  {
    id: 3,
    title: "CONNECT SMART",
    subtitle: "Premium Cables & Accessories",
    description: "Durable, fast-charging cables and accessories built to last. Quality you can trust.",
    products: [
      {
        src: "/cable 4.webp",
        alt: "USB Cable",
        size: "large",
        position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        zIndex: 30
      },
      {
        src: "/cable 5.webp",
        alt: "Type-C Cable",
        size: "medium",
        position: "top-[30%] right-[8%]",
        zIndex: 20
      },
      {
        src: "/cable 6.webp",
        alt: "Multi Cable",
        size: "medium",
        position: "bottom-[25%] left-[12%]",
        zIndex: 15
      }
    ],
    buttonText: "Shop Cables",
    buttonLink: "/category/mobile-accessories",
    bgGradient: "from-orange-600 via-red-600 to-pink-600",
  },
];

const sizeClasses = {
  large: "w-[280px] h-[280px] lg:w-[420px] lg:h-[420px]",
  medium: "w-[180px] h-[180px] lg:w-[260px] lg:h-[260px]",
  small: "w-[120px] h-[120px] lg:w-[180px] lg:h-[180px]"
};

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="w-full">
      {/* Desktop Layout: Slider Left + 2 Promo Boxes Right */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4 max-w-screen-2xl mx-auto px-4 py-4">
        
        {/* LEFT: Main Slider (2 columns) */}
        <div className="col-span-2 relative h-[500px] rounded-2xl overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgGradient}`}
            >
              <div className="grid grid-cols-2 h-full">
                {/* Text Content - LEFT SIDE */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-col justify-center px-8 lg:px-12 text-white space-y-4 z-40 relative"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full w-fit"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">{slides[currentSlide].subtitle}</span>
                  </motion.div>

                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    {slides[currentSlide].title}
                  </h2>

                  <p className="text-base lg:text-lg text-white/90 max-w-md">
                    {slides[currentSlide].description}
                  </p>

                  <div className="pt-4">
                    <Link
                      href={slides[currentSlide].buttonLink}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>{slides[currentSlide].buttonText}</span>
                    </Link>
                  </div>
                </motion.div>

                {/* Multiple Product Images - RIGHT SIDE */}
                <div className="relative">
                  {slides[currentSlide].products.map((product, index) => (
                    <motion.div
                      key={`${currentSlide}-${index}`}
                      initial={{ 
                        x: 100, 
                        opacity: 0, 
                        scale: 0.5,
                        rotate: index % 2 === 0 ? -15 : 15
                      }}
                      animate={{ 
                        x: 0, 
                        opacity: 1, 
                        scale: 1,
                        rotate: 0,
                        y: [0, -12, 0]
                      }}
                      transition={{ 
                        delay: 0.3 + (index * 0.15),
                        duration: 0.8,
                        y: {
                          duration: 2.5 + (index * 0.5),
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className={`absolute ${product.position} ${sizeClasses[product.size]}`}
                      style={{ zIndex: product.zIndex }}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={product.src}
                          alt={product.alt}
                          fill
                          className="object-contain drop-shadow-2xl"
                        />
                        {/* Glow effect */}
                        <motion.div
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.5
                          }}
                          className="absolute inset-0 bg-white/20 rounded-full blur-3xl -z-10"
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Background decorative elements */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.1, 0.25, 0.1]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                    className="absolute bottom-10 left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 z-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 z-50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Two Promo Boxes (Stacked) */}
        <div className="flex flex-col gap-4">
          
          {/* Top Box: Super Deals */}
          <Link
            href="/deals"
            className="relative h-[242px] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
              <Image
                src="/Super Deals.webp"
                alt="Super Deals"
                fill
                className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6 text-white z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold">Limited Time</span>
                </div>
                <h3 className="text-2xl font-bold">SUPER DEALS</h3>
                <p className="text-sm text-white/80">Save up to 70%</p>
              </div>
            </div>
          </Link>

          {/* Bottom Box: Top Coupons */}
          <Link
            href="/coupons"
            className="relative h-[242px] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600">
              <Image
                src="/Top Cuopons.jpg"
                alt="Top Coupons"
                fill
                className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6 text-white z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                  <Gift className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold">Exclusive</span>
                </div>
                <h3 className="text-2xl font-bold">TOP COUPONS</h3>
                <p className="text-sm text-white/80">Extra discounts</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Layout: Slider on Top + Super Deals Below */}
<div className="lg:hidden px-4 py-4 space-y-4">
  
  {/* Main Slider */}
  <div className="relative h-[520px] rounded-2xl overflow-hidden group">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgGradient} p-6 flex flex-col justify-between`}
      >
        {/* Product Images - Mobile (showing 3 products) */}
        <div className="relative flex-1">
          {slides[currentSlide].products.slice(0, 3).map((product, index) => (
            <motion.div
              key={`mobile-${currentSlide}-${index}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -8, 0]
              }}
              transition={{ 
                delay: 0.2 + (index * 0.1),
                y: {
                  duration: 2 + (index * 0.3),
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className={`absolute ${
                index === 0 
                  ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 z-30'
                  : index === 1
                  ? 'top-[15%] right-[5%] w-28 h-28 z-20'
                  : 'bottom-[20%] left-[8%] w-24 h-24 z-10'
              }`}
            >
              <Image
                src={product.src}
                alt={product.alt}
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          ))}
        </div>

        {/* Text Content + Button at Bottom */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white space-y-3 relative z-40"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold">{slides[currentSlide].subtitle}</span>
          </div>

          <h2 className="text-3xl font-bold">{slides[currentSlide].title}</h2>

          <Link
            href={slides[currentSlide].buttonLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{slides[currentSlide].buttonText}</span>
          </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>

    {/* Mobile Navigation */}
    <button
      onClick={prevSlide}
      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full z-50"
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    <button
      onClick={nextSlide}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full z-50"
      aria-label="Next slide"
    >
      <ChevronRight className="w-5 h-5" />
    </button>

    {/* Mobile Indicators */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`h-1.5 rounded-full transition-all ${
            currentSlide === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  </div>

  {/* Super Deals Box (Mobile Only) */}
  <Link
    href="/deals"
    className="relative h-[200px] rounded-2xl overflow-hidden block"
  >
    <Image
      src="/Super Deals.webp"
      alt="Super Deals"
      fill
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="absolute bottom-4 left-4 text-white z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-1">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-xs font-semibold">Limited Time</span>
      </div>
      <h3 className="text-xl font-bold">SUPER DEALS</h3>
      <p className="text-xs text-white/80">Save up to 70%</p>
    </div>
  </Link>
</div>
    </div>
  );
};

export default HeroSlider;