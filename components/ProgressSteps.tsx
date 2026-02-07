// *********************
// Role of the component: Progress indicator for checkout flow
// Name of the component: ProgressSteps.tsx
// Developer: Enhanced
// Version: 1.0
// Component call: <ProgressSteps currentStep={1} />
// Input parameters: { currentStep: number } (1=Cart, 2=Checkout, 3=Complete)
// Output: Animated progress bar with icons
// *********************

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, CheckCircle2 } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number; // 1 = Cart, 2 = Checkout, 3 = Complete
}

const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  const steps = [
    { number: 1, label: "Cart", icon: ShoppingBag },
    { number: 2, label: "Checkout", icon: CreditCard },
    { number: 3, label: "Complete", icon: CheckCircle2 },
  ];

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    currentStep >= step.number
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </motion.div>
                <span
                  className={`ml-3 font-semibold hidden sm:block transition-colors ${
                    currentStep >= step.number ? "text-blue-600" : "text-neutral-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: currentStep > step.number ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;