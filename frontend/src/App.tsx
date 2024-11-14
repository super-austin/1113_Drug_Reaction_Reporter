import React, { useState, type FC, FormEvent } from "react";
import axios from "axios";

import SearchBar from "./components/SearchBar";
import ReactionsList from "./components/ReactionsList";

import type { Reaction, ApiResponse } from "./common.types";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const App: FC = () => {
  const [drugName, setDrugName] = useState<string>("");
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const fetchReactions = async () => {
    setReactions([]);
    try {
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
      console.error(err);
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
        <ReactionsList reactions={reactions} drugName={drugName} />
      </div>
    </div>
  );
};

export default App;
