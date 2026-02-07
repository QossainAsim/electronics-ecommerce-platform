// *********************
// Role of the component: Button for adding product to the cart on the single product page
// Name of the component: AddToCartSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 3.0
// Component call: <AddToCartSingleProductBtn product={product} quantityCount={quantityCount}  />
// Input parameters: SingleProductBtnProps interface
// Output: Button with adding to cart functionality and modal
// *********************
"use client";

import React, { useState } from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import AddToCartModal from "./AddToCartModal";

const AddToCartSingleProductBtn = ({ product, quantityCount } : SingleProductBtnProps) => {
  const { addToCart } = useProductStore();
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Add to Cart</span>
      </button>

      <AddToCartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={product}
        quantity={quantityCount}
      />
    </>
  );
};

export default AddToCartSingleProductBtn;