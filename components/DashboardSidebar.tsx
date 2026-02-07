// *********************
// Role of the component: Sidebar on admin dashboard page
// Name of the component: DashboardSidebar.tsx
// Developer: Fixed Version
// Version: 2.0
// Component call: <DashboardSidebar />
// Input parameters: no input parameters
// Output: sidebar for admin dashboard page with correct links
// *********************

import React from "react";
import { MdDashboard, MdCategory } from "react-icons/md";
import { FaTable, FaRegUser, FaGear, FaBagShopping, FaStore } from "react-icons/fa6";
import { FaFileUpload } from "react-icons/fa"; // ← Changed from fa6 to fa
import { Tag, Gift, MessageSquare } from "lucide-react";
import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <div className="xl:w-[400px] bg-blue-500 h-full max-xl:w-full">
      {/* Dashboard */}
      <Link href="/admin">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <MdDashboard className="text-2xl" />
          <span className="font-normal">Dashboard</span>
        </div>
      </Link>

      {/* Orders */}
      <Link href="/admin/orders">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaBagShopping className="text-2xl" />
          <span className="font-normal">Orders</span>
        </div>
      </Link>

      {/* Products */}
      <Link href="/admin/products">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaTable className="text-2xl" />
          <span className="font-normal">Products</span>
        </div>
      </Link>

      {/* Deals - NEW */}
      <Link href="/admin/deals">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <Tag className="text-2xl" />
          <span className="font-normal">Deals</span>
        </div>
      </Link>

      {/* Coupons - NEW */}
      <Link href="/admin/coupons">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <Gift className="text-2xl" />
          <span className="font-normal">Coupons</span>
        </div>
      </Link>

      {/* Bulk Upload */}
      <Link href="/admin/bulk-upload">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaFileUpload className="text-2xl" />
          <span className="font-normal">Bulk Upload</span>
        </div>
      </Link>

      {/* Categories */}
      <Link href="/admin/categories">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <MdCategory className="text-2xl" />
          <span className="font-normal">Categories</span>
        </div>
      </Link>

      {/* Contact Inquiries - NEW */}
      <Link href="/admin/inquiries">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <MessageSquare className="text-2xl" />
          <span className="font-normal">Inquiries</span>
        </div>
      </Link>

      {/* Users */}
      <Link href="/admin/users">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaRegUser className="text-2xl" />
          <span className="font-normal">Users</span>
        </div>
      </Link>

      {/* Merchant */}
      <Link href="/admin/merchant">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaStore className="text-2xl" />
          <span className="font-normal">Merchant</span>
        </div>
      </Link>

      {/* Settings */}
      <Link href="/admin/settings">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaGear className="text-2xl" />
          <span className="font-normal">Settings</span>
        </div>
      </Link>
    </div>
  );
};

export default DashboardSidebar;