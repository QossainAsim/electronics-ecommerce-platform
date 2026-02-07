'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useSession } from 'next-auth/react';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = "" }) => {
  const { data: session } = useSession();
  const { unreadCount } = useUnreadCount();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't show notification bell if user is not logged in
  if (!session?.user) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-6 w-6" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
            <h3 className="text-lg font-semibold text-neutral-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-sm text-neutral-600 bg-blue-100 px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-neutral-200">
            <div className="flex gap-2">
              <Link
                href="/notifications"
                onClick={() => setIsDropdownOpen(false)}
                className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
              >
                View All
              </Link>
              
              {unreadCount > 0 && (
                <button
                  className="flex-1 px-3 py-2 text-sm font-medium text-center text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-1 transition-colors"
                  onClick={() => {
                    // TODO: Implement mark all as read functionality
                    setIsDropdownOpen(false);
                  }}
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>

          {/* Notification Preview */}
          <div className="max-h-64 overflow-y-auto">
            {unreadCount === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-600 text-sm font-medium mb-1">No new notifications</p>
                <p className="text-neutral-400 text-xs">You're all caught up!</p>
              </div>
            ) : (
              <div className="p-4">
                <div className="text-center bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-700 mb-3 font-medium">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                  <Link
                    href="/notifications"
                    onClick={() => setIsDropdownOpen(false)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all hover:scale-105"
                  >
                    View in Notification Center →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-neutral-50 border-t border-neutral-200">
            <Link
              href="/notifications"
              onClick={() => setIsDropdownOpen(false)}
              className="block w-full text-center text-sm text-neutral-600 hover:text-blue-600 font-medium transition-colors"
            >
              Go to Notification Center
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;