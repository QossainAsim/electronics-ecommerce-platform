"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Search, Eye, Check, X, Clock } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const ContactInquiriesPage = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await apiClient.get("/api/admin/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await apiClient.patch(`/api/admin/inquiries/${id}`, {
        status,
      });
      if (response.ok) {
        toast.success(`Inquiry marked as ${status}`);
        fetchInquiries();
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast.error("Failed to update inquiry");
    }
  };

  const openModal = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInquiry(null);
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || inquiry.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const respondedCount = inquiries.filter((i) => i.status === "responded").length;
  const closedCount = inquiries.filter((i) => i.status === "closed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "responded":
        return "bg-blue-100 text-blue-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "responded":
        return <Mail className="w-4 h-4" />;
      case "closed":
        return <Check className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading inquiries...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Contact Inquiries</h1>
        <p className="text-neutral-600 mt-1">
          Manage customer messages and support requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-neutral-900">{inquiries.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Responded</p>
              <p className="text-2xl font-bold text-blue-600">{respondedCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Closed</p>
              <p className="text-2xl font-bold text-green-600">{closedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          {["all", "pending", "responded", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-3 rounded-lg font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No inquiries found
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-neutral-900">{inquiry.name}</p>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Mail className="w-4 h-4" />
                          <span>{inquiry.email}</span>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Phone className="w-4 h-4" />
                            <span>{inquiry.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900 line-clamp-2">
                        {inquiry.subject}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                          inquiry.status
                        )}`}
                      >
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(inquiry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <h2 className="text-2xl font-bold text-neutral-900">Inquiry Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-600 uppercase mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-neutral-900">
                      {selectedInquiry.name}
                    </p>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Mail className="w-4 h-4" />
                      <span>{selectedInquiry.email}</span>
                    </div>
                    {selectedInquiry.phone && (
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Phone className="w-4 h-4" />
                        <span>{selectedInquiry.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-600 uppercase mb-2">
                    Subject
                  </h3>
                  <p className="text-lg font-semibold text-neutral-900">
                    {selectedInquiry.subject}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-600 uppercase mb-2">
                    Message
                  </h3>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-neutral-900 whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-600 uppercase mb-3">
                    Update Status
                  </h3>
                  <div className="flex gap-2">
                    {["pending", "responded", "closed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedInquiry.id, status)}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                          selectedInquiry.status === status
                            ? getStatusColor(status)
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-4 p-6 border-t border-neutral-200">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInquiriesPage;