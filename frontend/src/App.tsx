import React, { useState, useMemo, type FC, FormEvent } from "react";
import axios, { type AxiosError } from "axios";

import SearchBar from "./components/SearchBar";
import ReactionsList from "./components/ReactionsList";
import Loading from "./components/Loading";
import ErrorNotification from "./components/ErrorNotification";
import Pagination from "./components/Pagination";

import type { Reaction, ApiResponse } from "./common.types";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const itemsPerPage = Number(process.env.REACT_APP_ITEMS_PER_PAGE) || 5;

const App: FC = () => {
  const [drugName, setDrugName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pagesCache, setPagesCache] = useState<
    Map<
      number,
      {
        reactions: Reaction[];
        nextPageUrl: string | null;
      }
    >
  >(new Map());

  const reactions = useMemo(() => {
    return pagesCache.get(currentPage)?.reactions || [];
  }, [pagesCache, currentPage]);

  const nextPageUrl = useMemo(() => {
    return pagesCache.get(currentPage)?.nextPageUrl || null;
  }, [pagesCache, currentPage]);

  const fetchReactions = async (
    page: number,
    isNextPage: boolean,
    cache: Map<number, any>
  ) => {
    if (cache.has(page)) {
      setCurrentPage(page);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        drugName,
        limit: itemsPerPage,
      };

      if (page > 1 && isNextPage) {
        const prevPageInfo = cache.get(page - 1);
        if (prevPageInfo?.nextPageUrl) {
          const url = new URL(prevPageInfo.nextPageUrl);
          const searchAfter = url.searchParams.get("search_after");
          if (searchAfter) {
            params.search_after = searchAfter;
          }
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

      const { reactions, nextPageUrl, meta } = data;

      if (reactions.length === 0 && page === 1) {
        setError("No match found");
        setTotalResults(0);
        setPagesCache(new Map());
        return;
      }

      setPagesCache((prev) => {
        const newMap = new Map(prev);
        newMap.set(page, {
          reactions,
          nextPageUrl,
        });
        return newMap;
      });

      setTotalResults(meta.total);
    } catch (err) {
      setPagesCache((prev) => {
        const newMap = new Map(prev);
        newMap.delete(page);
        return newMap;
      });

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (drugName.trim()) {
      setCurrentPage(1);
      const newCache = new Map();
      setPagesCache(newCache);
      setError(null);
      await fetchReactions(1, true, newCache);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page < 1) return;
    if (page > currentPage && !nextPageUrl) return;

    const isNextPage = page > currentPage;

    if (pagesCache.has(page)) {
      setCurrentPage(page);
      return;
    }

    await fetchReactions(page, isNextPage, pagesCache);
    setCurrentPage(page);
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
        {!loading && !error && reactions.length > 0 && (
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
