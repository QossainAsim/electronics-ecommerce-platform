// *********************
// Role of the component: Enhanced customer benefits section with animations
// Name of the component: IncentivesEnhanced.tsx
// Developer: Enhanced by AI
// Version: 2.0
// Component call: <IncentivesEnhanced />
// Input parameters: no input parameters
// Output: Animated incentives component
// *********************

"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Truck, HeadphonesIcon, ShoppingCart, Shield, Award, Zap } from "lucide-react";

interface Incentive {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const incentives: Incentive[] = [
  {
    id: 1,
    title: "Free Shipping",
    description: "Free delivery on all orders over RS 3000. Shop with confidence.",
    icon: <Truck className="w-8 h-8" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "24/7 Customer Support",
    description: "Expert support team available around the clock for your queries.",
    icon: <HeadphonesIcon className="w-8 h-8" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: "Fast Shopping Cart",
    description: "Lightning-fast checkout process for a seamless shopping experience.",
    icon: <Zap className="w-8 h-8" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 4,
    title: "Secure Payments",
    description: "100% secure payment processing with top-level encryption.",
    icon: <Shield className="w-8 h-8" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 5,
    title: "Quality Guarantee",
    description: "All products are authentic and come with manufacturer warranty.",
    icon: <Award className="w-8 h-8" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    id: 6,
    title: "Easy Returns",
    description: "Hassle-free 30-day return policy on all purchases.",
    icon: <ShoppingCart className="w-8 h-8" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
];

const IncentivesEnhanced = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-full text-sm font-semibold mb-4"
          >
            WHY CHOOSE US
          </motion.div>
          <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Best Customer Benefits
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            We're committed to providing exceptional service and value to every customer
          </p>
        </motion.div>

        {/* Incentives Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {incentives.map((incentive) => (
            <motion.div
              key={incentive.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative overflow-hidden bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-neutral-100 hover:border-transparent">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex p-4 ${incentive.bgColor} rounded-2xl ${incentive.color} mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    {incentive.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {incentive.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-600 leading-relaxed">
                    {incentive.description}
                  </p>

                  {/* Decorative corner */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  />
                </div>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 100%)",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 pt-12 border-t border-neutral-200"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                50K+
              </div>
              <div className="text-sm text-neutral-600 font-medium">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                500+
              </div>
              <div className="text-sm text-neutral-600 font-medium">
                Products Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                4.9★
              </div>
              <div className="text-sm text-neutral-600 font-medium">
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-sm text-neutral-600 font-medium">
                Customer Support
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IncentivesEnhanced;