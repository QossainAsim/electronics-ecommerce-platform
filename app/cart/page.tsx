import ProgressSteps from "@/components/ProgressSteps";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";
import { Loader } from "@/components/Loader";

const CartPage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Progress Bar - Step 1: Cart */}
      <ProgressSteps currentStep={1} />
      
      <Suspense fallback={<Loader />}>
        <CartModule />
      </Suspense>
    </div>
  );
};

export default CartPage;