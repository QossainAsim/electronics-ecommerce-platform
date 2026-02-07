"use client";
import AdminOrders from "@/components/AdminOrders"; // ✅ Direct import
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="w-full p-6">
      <AdminOrders />
    </div>
  );
};

export default DashboardOrdersPage;