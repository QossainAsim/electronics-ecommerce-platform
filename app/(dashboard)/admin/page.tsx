"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Percent,
  Tag,
  Mail,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  activeDeals: number;
  activeCoupons: number;
  pendingInquiries: number;
}

interface RecentOrder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalPrice: number;
  status: string;
  dateTime: string;
}

interface LowStockProduct {
  id: string;
  title: string;
  slug: string;
  mainImage: string | null;
  inStock: number;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setLowStockProducts(data.lowStockProducts || []);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
    link,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    bgColor: string;
    link?: string;
  }) => (
    <Link
      href={link || "#"}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-4">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </Link>
  );

  const QuickAction = ({
    title,
    description,
    icon: Icon,
    color,
    bgColor,
    link,
  }: {
    title: string;
    description: string;
    icon: any;
    color: string;
    bgColor: string;
    link: string;
  }) => (
    <Link
      href={link}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
      </div>
      <h3 className="font-semibold text-gray-900 mt-4">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Products"
                value={stats?.totalProducts || 0}
                icon={Package}
                color="text-blue-600"
                bgColor="bg-blue-50"
                link="/admin/products"
              />
              <StatCard
                title="Total Orders"
                value={stats?.totalOrders || 0}
                icon={ShoppingCart}
                color="text-green-600"
                bgColor="bg-green-50"
                link="/admin/orders"
              />
              <StatCard
                title="Total Revenue"
                value={`$${stats?.totalRevenue || 0}`}
                icon={DollarSign}
                color="text-purple-600"
                bgColor="bg-purple-50"
              />
              <StatCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon={Users}
                color="text-orange-600"
                bgColor="bg-orange-50"
                link="/admin/users"
              />
            </div>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 mb-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="text-2xl font-bold">Welcome to your Admin Panel</h4>
                  <p className="text-blue-100 mt-2">Manage your store, products, orders and more from here.</p>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-lg font-semibold">{stats?.totalProducts || 0} products</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickAction
                  title="Manage Deals"
                  description={`${stats?.activeDeals || 0} active deals`}
                  icon={Percent}
                  color="text-red-600"
                  bgColor="bg-red-50"
                  link="/admin/deals"
                />
                <QuickAction
                  title="Manage Coupons"
                  description={`${stats?.activeCoupons || 0} active coupons`}
                  icon={Tag}
                  color="text-green-600"
                  bgColor="bg-green-50"
                  link="/admin/coupons"
                />
                <QuickAction
                  title="View Inquiries"
                  description={`${stats?.pendingInquiries || 0} pending messages`}
                  icon={Mail}
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                  link="/admin/inquiries"
                />
              </div>
            </div>

            {/* Recent Orders + Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                  <Link
                    href="/admin/orders"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentOrders.length === 0 ? (
                    <p className="p-8 text-center text-gray-500">No orders yet</p>
                  ) : (
                    recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {order.firstName} {order.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{order.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${order.totalPrice}</p>
                            <span
                              className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mt-1 ${
                                order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "processing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
                  </div>
                  <Link
                    href="/admin/products"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {lowStockProducts.length === 0 ? (
                    <p className="p-8 text-center text-gray-500">All products well stocked ✓</p>
                  ) : (
                    lowStockProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{product.title}</p>
                            <p className="text-sm text-gray-500">SKU: {product.id.slice(0, 8)}...</p>
                          </div>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ml-4 ${
                              product.inStock === 0
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {product.inStock === 0 ? "Out of Stock" : `${product.inStock} left`}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;