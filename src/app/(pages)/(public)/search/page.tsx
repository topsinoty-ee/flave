"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";

// Mock database of searchable items
const MOCK_DATABASE = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Nectarine",
  "Orange",
  "Peach",
  "Quince",
  "Raspberry",
  "Strawberry",
  "Tangerine",
  "Ugli fruit",
  "Watermelon",
];

// SearchResults component to handle the search logic
function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Update URL with debounce
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      const path = searchTerm
        ? `/search?q=${encodeURIComponent(searchTerm)}`
        : "/search";
      router.replace(path);
      setIsSearching(false);
    }, 300),
    [router]
  );

  // Handle input changes
  const handleSearch = (term: string) => {
    setQuery(term);
    setIsSearching(true);
    debouncedSearch(term);
  };

  // Sync state with URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  // Filter results
  useEffect(() => {
    if (query) {
      const filtered = MOCK_DATABASE.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Instant Search
        </h1>

        <div className="relative">
          <input
            type="text"
            placeholder="Search fruits..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm 
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                     transition-all duration-200"
          />

          {isSearching && (
            <div className="absolute right-4 top-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Results for: {query}
            </h2>
            <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
              {results.map((item, index) => (
                <li
                  key={index}
                  className="p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <span className="text-blue-600">#{index + 1}</span>
                  <span className="ml-3 text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : query ? (
          <div className="text-center p-8 text-gray-500">
            No results found for: {query}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-400">
            Start typing to search our fruit database
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton for suspense fallback
function SearchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Instant Search
        </h1>
        <div className="w-full h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="p-4">
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
}

function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number
) {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
