// *********************
// Role of the component: Buy Now button that adds product to the cart and redirects to the checkout page
// Name of the component: BuyNowSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <BuyNowSingleProductBtn product={product} quantityCount={quantityCount} />
// Input parameters: SingleProductBtnProps interface
// Output: Button with buy now functionality
// *********************

"use client";
import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { addToCart } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage || "",
      amount: quantityCount,
      // ✅ Only include deal if it exists and has all required properties
      deal: product?.deal ? {
        id: product.deal.id,
        discountPercent: product.deal.discountPercent,
        startDate: product.deal.startDate.toString(),
        endDate: product.deal.endDate.toString(),
      } : null,
    });
    toast.success("Product added to the cart");
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white rounded-lg font-semibold text-base hover:bg-orange-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
    >
      <Zap className="w-5 h-5" />
      <span>Buy Now</span>
    </button>
  );
};

export default BuyNowSingleProductBtn;