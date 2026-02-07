// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SearchInput />
// Input parameters: no input parameters
// Output: form with search input and button
// *********************

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sanitize } from "@/lib/sanitize";
import { Search } from "lucide-react";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  // function for modifying URL for searching products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Sanitize the search input before using it in URL
    const sanitizedSearch = sanitize(searchInput);
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput("");
  };

  return (
    <form
      className="flex w-full max-w-2xl mx-auto lg:mx-0"
      onSubmit={searchProducts}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for products..."
          className="w-full h-12 pl-10 pr-4 text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      <button
        type="submit"
        className="h-12 px-6 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition-colors duration-200 active:scale-95 flex items-center gap-2 max-sm:px-4"
      >
        <span className="max-sm:hidden">Search</span>
        <Search className="h-5 w-5 sm:hidden" />
      </button>
    </form>
  );
};

export default SearchInput;