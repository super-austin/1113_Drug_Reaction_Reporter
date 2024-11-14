import React, { useState } from "react";
import axios, { AxiosError } from "axios";

import SearchBar from "./components/SearchBar";
import ReactionsList from "./components/ReactionsList";
import Loading from "./components/Loading";
import ErrorNotification from "./components/ErrorNotification";
import Pagination from "./components/Pagination";

import { Reaction, ApiResponse } from "./common.types";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const itemsPerPage = Number(process.env.REACT_APP_ITEMS_PER_PAGE) || 5;

const App: React.FC = () => {
  const [drugName, setDrugName] = useState<string>("");
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  // Store an array of searchAfter values for each page
  const [searchAfterHistory, setSearchAfterHistory] = useState<
    (string | null)[]
  >([null]);

  const fetchReactions = async (page: number, isNextPage: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        drugName,
        limit: itemsPerPage,
      };

      // If going forward, use the last searchAfter value
      // If going backward, use the second-to-last searchAfter value
      if (page > 1) {
        const searchAfter = isNextPage
          ? searchAfterHistory[searchAfterHistory.length - 1]
          : searchAfterHistory[searchAfterHistory.length - 3];

        if (searchAfter) {
          params.search_after = searchAfter;
        }
      }

      const { data } = await axios.get<ApiResponse>(
        `${apiBaseUrl}/api/drug-reactions`,
        {
          params,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setReactions(data.reactions);
      setTotalResults(data.meta.total);
      setNextPageUrl(data.nextPageUrl);

      // Handle searchAfter history
      if (data.nextPageUrl) {
        const url = new URL(data.nextPageUrl);
        const newSearchAfter = url.searchParams.get("search_after");

        if (isNextPage && newSearchAfter) {
          // Add new searchAfter value to history when going forward
          setSearchAfterHistory((prev) => [...prev, newSearchAfter]);
        } else if (!isNextPage) {
          // Remove the last searchAfter value when going backward
          setSearchAfterHistory((prev) => prev.slice(0, -1));
        }
      }
    } catch (err) {
      setReactions([]);
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<{ error: string; details?: string }>;
        setError(
          error.response?.data?.error ||
            error.message ||
            "An error occurred while fetching the data"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (drugName.trim()) {
      setCurrentPage(1);
      setSearchAfterHistory([null]);
      await fetchReactions(1, true);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page < 1) return;
    if (page > currentPage && !nextPageUrl) return;

    const isNextPage = page > currentPage;
    setCurrentPage(page);
    await fetchReactions(page, isNextPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Medication Adverse Reactions Search
        </h1>
        <SearchBar
          drugName={drugName}
          setDrugName={setDrugName}
          onSubmit={handleSubmit}
        />
        {loading && <Loading />}
        {error && <ErrorNotification error={error} />}
        {reactions.length > 0 && (
          <>
            <div className="text-sm text-gray-600 mt-4 mb-2">
              Total reports found: {totalResults}
            </div>
            <ReactionsList reactions={reactions} drugName={drugName} />
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasNextPage={!!nextPageUrl}
              isLoading={loading}
              overallPages={Math.ceil(totalResults / itemsPerPage)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
