"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Edit,
  Save,
  X,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  AlertCircle,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

/* ---------------- TYPES ---------------- */
type UserStats = {
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
};

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  postalCode: string;
};

/* ---------------- COMPONENT ---------------- */
const MyAccountPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states for editing
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  // Fetch user info and stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionStatus !== "authenticated" || !session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user's orders
        const ordersResponse = await fetch(
          `http://localhost:3001/api/orders/user/${encodeURIComponent(session.user.email)}`
        );

        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const ordersData = await ordersResponse.json();
        const orders = ordersData.orders || [];

        if (orders.length > 0) {
          // Get info from most recent order
          const latestOrder = orders[0];

          // Calculate stats
          const totalOrders = orders.length;
          const totalSpent = orders.reduce(
            (sum: number, order: any) => sum + order.totalPrice,
            0
          );
          const memberSince = orders[orders.length - 1].dateTime;

          const userData: UserInfo = {
            firstName: latestOrder.firstName,
            lastName: latestOrder.lastName,
            email: latestOrder.email,
            phone: latestOrder.phone,
            company: latestOrder.company || "",
            address: latestOrder.address,
            apartment: latestOrder.apartment || "",
            city: latestOrder.city,
            country: latestOrder.country,
            postalCode: latestOrder.postalCode,
          };

          setUserInfo(userData);
          setUserStats({
            totalOrders,
            totalSpent,
            memberSince,
          });

          // Set form values
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setPhone(userData.phone);
          setCompany(userData.company || "");
          setAddress(userData.address);
          setApartment(userData.apartment || "");
          setCity(userData.city);
          setCountry(userData.country);
          setPostalCode(userData.postalCode);
        }
      } catch (err: any) {
        console.error("Error fetching user info:", err);
        toast.error("Failed to load account information");
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      fetchUserData();
    }
  }, [session, sessionStatus]);

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!userInfo) return;

    setIsSaving(true);

    try {
      // Update user info (stored in state for now)
      // In production, you would send this to your API
      const updatedInfo: UserInfo = {
        ...userInfo,
        firstName,
        lastName,
        phone,
        company,
        address,
        apartment,
        city,
        country,
        postalCode,
      };

      setUserInfo(updatedInfo);
      setIsEditing(false);
      toast.success("Account information updated successfully!");

      // Note: To persist changes to future orders, you could:
      // 1. Create a user_profile table in your database
      // 2. Update it here via API call
      // 3. Use these values as defaults in checkout
    } catch (error: any) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (!userInfo) return;

    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setPhone(userInfo.phone);
    setCompany(userInfo.company || "");
    setAddress(userInfo.address);
    setApartment(userInfo.apartment || "");
    setCity(userInfo.city);
    setCountry(userInfo.country);
    setPostalCode(userInfo.postalCode);
    setIsEditing(false);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (sessionStatus === "unauthenticated") {
    return null; // Will redirect to login
  }

  // No user info (no orders yet)
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome, {session?.user?.name || session?.user?.email}!</h2>
            <p className="text-gray-600 mb-6">
              Place your first order to create your account profile
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
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
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-gray-600 mt-1">
                Manage your account information
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Orders
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">
              {userStats?.totalOrders || 0}
            </p>
            <p className="text-sm opacity-90">Total Orders</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Spent
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">
              Rs. {(userStats?.totalSpent || 0).toLocaleString()}
            </p>
            <p className="text-sm opacity-90">Total Spent</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Member
              </span>
            </div>
            <p className="text-lg font-bold mb-1">
              {formatDate(userStats?.memberSince)}
            </p>
            <p className="text-sm opacity-90">Member Since</p>
          </motion.div>
        </div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 mt-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Account Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            // View Mode
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">First Name</p>
                    <p className="font-semibold">{userInfo.firstName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Last Name</p>
                    <p className="font-semibold">{userInfo.lastName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </p>
                    <p className="font-semibold">{userInfo.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Phone
                    </p>
                    <p className="font-semibold">{userInfo.phone}</p>
                  </div>
                  {userInfo.company && (
                    <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        Company
                      </p>
                      <p className="font-semibold">{userInfo.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold mb-2">
                    {userInfo.address}
                    {userInfo.apartment && `, ${userInfo.apartment}`}
                  </p>
                  <p className="text-gray-600">
                    {userInfo.city}, {userInfo.country} - {userInfo.postalCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-6">
              {/* Personal Info Edit */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company (optional)"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address Edit */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apartment / Suite (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="State/Country"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="ZIP Code"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mt-6"
        >
          <Link
            href="/my-orders"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">
                  View My Orders
                </h3>
                <p className="text-sm text-gray-600">
                  Track and manage your orders
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </Link>

          <Link
            href="/"
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Continue Shopping</h3>
                <p className="text-sm opacity-90">
                  Explore our latest products
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 opacity-80" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default MyAccountPage;