import React, { useState, type FC, FormEvent } from "react";
import axios, { type AxiosError } from "axios";

import SearchBar from "./components/SearchBar";
import ReactionsList from "./components/ReactionsList";
import Loading from "./components/Loading";
import ErrorNotification from "./components/ErrorNotification";

import type { Reaction, ApiResponse } from "./common.types";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const App: FC = () => {
  const [drugName, setDrugName] = useState<string>("");
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReactions = async () => {
    setReactions([]);
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get<ApiResponse>(
        `${apiBaseUrl}/api/drug-reactions`,
        {
          params: {
            drugName,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setReactions(data.reactions);
    } catch (err) {
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
      await fetchReactions();
    }
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
        <ReactionsList reactions={reactions} drugName={drugName} />
      </div>
    </div>
  );
};

export default App;
