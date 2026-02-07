"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // If not logged in, redirect to login
    if (!session) {
      router.push("/login");
      return;
    }

    // If logged in but not admin, redirect to home
    if (session.user?.role !== "admin") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not admin
  if (!session || session.user?.role !== "admin") {
    return null;
  }

  // Render admin layout only if admin
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      {children}
    </div>
  );
}