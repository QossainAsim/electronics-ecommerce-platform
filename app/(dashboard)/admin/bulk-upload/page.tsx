// *********************
// Role of the component: Bulk upload products page for admin dashboard
// Name of the component: BulkUpload.tsx (Enhanced)
// Developer: Enhanced for Excel + Multiple Images + Local Paths
// Version: 3.0
// Component call: <BulkUpload />
// Input parameters: no input parameters
// Output: Enhanced bulk upload page with Excel, multiple images, local path support
// *********************

"use client";
import BulkUploadHistory from "@/components/BulkUploadHistory";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaFileUpload,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaFileExcel,
  FaFileCsv,
  FaInfoCircle,
} from "react-icons/fa";

interface UploadResult {
  success: boolean;
  message: string;
  details?: {
    processed: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validExtensions = [".csv", ".xlsx", ".xls"];
      const isValid = validExtensions.some((ext) =>
        droppedFile.name.toLowerCase().endsWith(ext)
      );

      if (isValid) {
        setFile(droppedFile);
        setUploadResult(null);
      } else {
        toast.error("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validExtensions = [".csv", ".xlsx", ".xls"];
      const isValid = validExtensions.some((ext) =>
        selectedFile.name.toLowerCase().endsWith(ext)
      );

      if (isValid) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast.error("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3001/api/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: data.message || "Products uploaded successfully!",
          details: {
            processed: data.totalItems || 0,
            successful: data.successCount || 0,
            failed: data.failureCount || 0,
            errors: data.validationErrors?.map((e: any) => e.error) || [],
          },
        });
        toast.success("Bulk upload completed!");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Upload failed",
        });
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "Network error occurred during upload",
      });
      toast.error("Network error occurred");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async (format: "csv" | "excel") => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/bulk-upload/template?format=${format}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `product-template.${format === "excel" ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Template downloaded!");
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  return (
    <div className="w-full xl:p-14 p-4">
      <h1 className="text-4xl font-bold mb-8">
        📦 Bulk Upload Products (Enhanced)
      </h1>

      {/* Key Features Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 mb-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3 text-blue-800 flex items-center gap-2">
          <FaInfoCircle /> ✨ New Features
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="font-semibold text-blue-700 mb-1">
              📊 Excel Support
            </p>
            <p className="text-gray-600">Upload .xlsx and .xls files</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="font-semibold text-green-700 mb-1">
              🖼️ Multiple Images
            </p>
            <p className="text-gray-600">Add multiple images per product</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="font-semibold text-purple-700 mb-1">
              💻 Local Files
            </p>
            <p className="text-gray-600">Use local file paths from PC</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">
          📋 How to Use
        </h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
          <li>Download the CSV or Excel template below</li>
          <li>
            Fill in your product data (title, price, manufacturer, stock,
            description, slug, categoryId)
          </li>
          <li>
            <strong>For images:</strong> Use URLs OR paste local file paths
            from your computer
          </li>
          <li>
            <strong>Multiple images:</strong> Separate with{" "}
            <code className="bg-blue-100 px-1 rounded">|</code> or{" "}
            <code className="bg-blue-100 px-1 rounded">,</code>
          </li>
          <li>Upload the completed file</li>
        </ol>
      </div>

      {/* Local File Path Guide */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-yellow-800">
          💡 Using Local File Paths for Images
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-gray-700 mb-2">🪟 Windows:</p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>
                Hold <kbd className="bg-gray-200 px-1 rounded">Shift</kbd> +
                Right-click file
              </li>
              <li>Click "Copy as path"</li>
              <li>Paste in Excel images column</li>
            </ol>
            <code className="block mt-2 text-xs bg-gray-100 p-1 rounded overflow-x-auto">
              C:\Users\Admin\image.jpg
            </code>
          </div>

          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-gray-700 mb-2">🍎 Mac:</p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Right-click file</li>
              <li>
                Hold <kbd className="bg-gray-200 px-1 rounded">Option</kbd>
              </li>
              <li>Click "Copy as Pathname"</li>
              <li>Paste in Excel images column</li>
            </ol>
            <code className="block mt-2 text-xs bg-gray-100 p-1 rounded overflow-x-auto">
              /Users/admin/image.jpg
            </code>
          </div>

          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-gray-700 mb-2">🐧 Linux:</p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Right-click file</li>
              <li>Select "Copy" or Ctrl+C</li>
              <li>Paste path in Excel</li>
            </ol>
            <code className="block mt-2 text-xs bg-gray-100 p-1 rounded overflow-x-auto">
              /home/admin/image.jpg
            </code>
          </div>
        </div>

        <div className="mt-3 bg-yellow-100 p-2 rounded">
          <p className="text-xs text-yellow-800">
            <strong>Example with multiple images:</strong>
          </p>
          <code className="block mt-1 text-xs bg-white p-2 rounded overflow-x-auto">
            C:\Users\Admin\img1.jpg|C:\Users\Admin\img2.jpg|https://example.com/img3.jpg
          </code>
        </div>
      </div>

      {/* Download Template Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <button
          onClick={() => downloadTemplate("csv")}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          <FaFileCsv className="text-xl" />
          Download CSV Template
        </button>
        <button
          onClick={() => downloadTemplate("excel")}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          <FaFileExcel className="text-xl" />
          Download Excel Template
        </button>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FaFileUpload className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-lg mb-2">
            {file ? (
              <span className="font-semibold text-blue-600 flex items-center justify-center gap-2">
                {file.name.endsWith(".xlsx") || file.name.endsWith(".xls") ? (
                  <FaFileExcel className="text-green-600" />
                ) : (
                  <FaFileCsv className="text-blue-600" />
                )}
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
            ) : (
              "Drag and drop CSV or Excel file here, or click to select"
            )}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded cursor-pointer transition-colors"
          >
            Select File
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: CSV, XLSX, XLS • Max size: 5MB
          </p>
        </div>
      </div>

      {/* Upload Button */}
      {file && (
        <div className="mb-6">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-all ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Upload...
              </span>
            ) : (
              "🚀 Upload Products"
            )}
          </button>
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div
          className={`border-l-4 p-6 rounded-lg mb-6 ${
            uploadResult.success
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
          }`}
        >
          <div className="flex items-start gap-3">
            {uploadResult.success ? (
              <FaCheckCircle className="text-3xl text-green-500 flex-shrink-0 mt-1" />
            ) : (
              <FaTimesCircle className="text-3xl text-red-500 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h3
                className={`text-xl font-bold mb-2 ${
                  uploadResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {uploadResult.success
                  ? "✅ Upload Successful!"
                  : "❌ Upload Failed"}
              </h3>
              <p
                className={`mb-3 ${
                  uploadResult.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {uploadResult.message}
              </p>

              {uploadResult.details && (
                <div className="bg-white rounded p-4 space-y-2">
                  <p className="font-semibold">Upload Statistics:</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {uploadResult.details.processed}
                      </p>
                      <p className="text-sm text-gray-600">Processed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {uploadResult.details.successful}
                      </p>
                      <p className="text-sm text-gray-600">Successful</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {uploadResult.details.failed}
                      </p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                  </div>

                  {uploadResult.details.errors &&
                    uploadResult.details.errors.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold text-red-700 mb-2">
                          Errors ({uploadResult.details.errors.length}):
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-600 max-h-40 overflow-y-auto">
                          {uploadResult.details.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced CSV/Excel Format Guide */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📝 File Format Guide</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Column
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Required
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Type
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Example
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  title
                </td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">
                  Product name
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs">
                  Gaming Laptop
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  price
                </td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  Product price
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs">
                  1299.99
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  manufacturer
                </td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">
                  Brand name
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs">
                  TechCorp
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  inStock
                </td>
                <td className="border border-gray-300 px-4 py-2">❌ No</td>
                <td className="border border-gray-300 px-4 py-2">Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  Stock quantity
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs">
                  10
                </td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border border-gray-300 px-4 py-2 font-mono font-bold">
                  images
                </td>
                <td className="border border-gray-300 px-4 py-2">❌ No</td>
                <td className="border border-gray-300 px-4 py-2">
                  String (URLs or Paths)
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>URLs OR local file paths</strong>
                  <br />
                  Multiple: separate with | or ,
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs">
                  <code className="block mb-1">
                    C:\img1.jpg|C:\img2.jpg
                  </code>
                  <code className="block">
                    https://example.com/img.jpg
                  </code>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  description
                </td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">
                  Product description
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs">
                  High-performance laptop
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  slug
                </td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">
                  URL-friendly ID
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs">
                  gaming-laptop
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  categoryId
                </td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">UUID</td>
                <td className="border border-gray-300 px-4 py-2">
                  Category UUID from DB
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs">
                  abc-123-def-456
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload History */}
      <div className="mt-8">
        <BulkUploadHistory />
      </div>
    </div>
  );
};

export default BulkUploadPage;