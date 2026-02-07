"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowLeft,
  Search,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { sanitize } from "@/lib/sanitize";

/* ---------------- TYPES ---------------- */
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "done";

type OrderProduct = {
  id: string;
  quantity: number;
  priceAtOrder: number;
  product: {
    id: string;
    title: string;
    mainImage: string | null;
    price: number;
  };
};

type Order = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string | null;
  city: string;
  country: string;
  postalCode: string;
  totalPrice: number;
  status: OrderStatus;
  dateTime: string;
  customer_order_products: OrderProduct[];
};

/* ---------------- COMPONENT ---------------- */
const MyOrdersPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  // Fetch orders when user is authenticated
  useEffect(() => {
    const fetchOrders = async () => {
      if (sessionStatus !== "authenticated" || !session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching orders for:', session.user.email);
        
        const url = `http://localhost:3001/api/orders/user/${encodeURIComponent(session.user.email)}`;
        console.log('📡 Request URL:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
          throw new Error(`Failed to fetch orders: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Orders data received:', data);
        
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error("❌ Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      fetchOrders();
    }
  }, [session, sessionStatus]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_order_products.some((p) =>
        p.product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: OrderStatus | string }) => {
    const config: Record<string, { style: string; icon: React.ReactNode }> = {
      pending: {
        style: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <Clock className="w-3 h-3" />
      },
      processing: {
        style: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Package className="w-3 h-3" />
      },
      shipped: {
        style: "bg-purple-100 text-purple-700 border-purple-200",
        icon: <Truck className="w-3 h-3" />
      },
      delivered: {
        style: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />
      },
      cancelled: {
        style: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="w-3 h-3" />
      },
      done: {
        style: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />
      },
    };

    // Fallback for unknown statuses
    const { style, icon } = config[status] || {
      style: "bg-gray-100 text-gray-700 border-gray-200",
      icon: <Package className="w-3 h-3" />
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${style}`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (sessionStatus === "unauthenticated") {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-gray-600 mt-1">
                Track and manage your orders
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-5 h-5" />
              <span>{orders.length} Total Orders</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as OrderStatus | "all")
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 font-semibold mb-2">Failed to load orders</p>
                <p className="text-red-600 text-sm">{error}</p>
                <details className="mt-3 text-xs text-red-600">
                  <summary className="cursor-pointer font-semibold">Troubleshooting</summary>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Make sure your Express server is running on port 3001</li>
                    <li>Check the browser console (F12) for more details</li>
                    <li>Verify your email has orders in the database</li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* No Orders */}
        {filteredOrders.length === 0 && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter"
                : "You haven't placed any orders yet"}
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.dateTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        Rs. {order.totalPrice.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.customer_order_products.length} Items
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Products */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.customer_order_products.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="relative w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0">
                        {item.product.mainImage ? (
                          <Image
                            fill
                            src={
                              item.product.mainImage.startsWith("/")
                                ? item.product.mainImage
                                : `/${item.product.mainImage}`
                            }
                            alt={sanitize(item.product.title)}
                            className="object-contain p-2"
                          />
                        ) : (
                          <Package className="w-full h-full p-4 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {sanitize(item.product.title)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          Rs. {item.priceAtOrder.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per item</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span className="text-blue-600 text-lg">
                      Rs. {order.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2 text-sm text-gray-700">
                    Shipping Address
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.firstName} {order.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address}
                    {order.apartment && `, ${order.apartment}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.city}, {order.country} - {order.postalCode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Phone: {order.phone}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;