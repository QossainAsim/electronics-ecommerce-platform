import React from "react";
import ProgressSteps from "@/components/ProgressSteps";
import HotSellingProducts from "@/components/HotSellingProducts";
import OrderCompleteClient from "./OrderCompleteClient";

const OrderCompletePage = () => {
  return (
    <div className="bg-gradient-to-b from-green-50 via-blue-50 to-white min-h-screen">
      {/* Progress Bar - Step 3: Complete */}
      <ProgressSteps currentStep={3} />

      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-12 py-16">
        {/* Client-side animations and effects */}
        <OrderCompleteClient />

        {/* Hot Selling Products - Server Component */}
        <HotSellingProducts />
      </div>
    </div>
  );
};

export default OrderCompletePage;
