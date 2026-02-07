"use client";
import DashboardProductTable from "@/components/DashboardProductTable"; // ✅ Direct import
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="w-full p-6">
      <DashboardProductTable />
    </div>
  );
};

export default DashboardProducts;