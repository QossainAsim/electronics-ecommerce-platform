// *********************
// Role of the component: Quantity input for incrementing and decrementing product quantity on the single product page
// Name of the component: QuantityInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <QuantityInput quantityCount={quantityCount} setQuantityCount={setQuantityCount} />
// Input parameters: QuantityInputProps interface
// Output: one number input and two buttons
// *********************

"use client";

import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

interface QuantityInputProps {
  quantityCount: number;
  setQuantityCount: React.Dispatch<React.SetStateAction<number>>;
}

const QuantityInput = ({quantityCount, setQuantityCount} : QuantityInputProps) => {

  const handleQuantityChange = (actionName: string): void => {
    if (actionName === "plus") {
      setQuantityCount(quantityCount + 1);
    } else if (actionName === "minus" && quantityCount !== 1) {
      setQuantityCount(quantityCount - 1);
    }
  };

  return (
    <div className="inline-flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
      {/* Minus Button */}
      <button
        type="button"
        onClick={() => handleQuantityChange("minus")}
        disabled={quantityCount <= 1}
        className="w-10 h-10 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <FaMinus className="w-3 h-3" />
      </button>

      {/* Quantity Display */}
      <input
        type="number"
        value={quantityCount}
        disabled={true}
        className="w-16 h-10 text-center text-base font-semibold text-neutral-900 bg-white border-x border-neutral-300 focus:outline-none"
        readOnly
      />

      {/* Plus Button */}
      <button
        type="button"
        onClick={() => handleQuantityChange("plus")}
        className="w-10 h-10 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
        aria-label="Increase quantity"
      >
        <FaPlus className="w-3 h-3" />
      </button>
    </div>
  );
};

export default QuantityInput;