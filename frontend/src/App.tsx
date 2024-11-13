import React, { useState, type FC, FormEvent } from "react";

import SearchBar from "./components/SearchBar";

const App: FC = () => {
  const [drugName, setDrugName] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(drugName);
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
      </div>
    </div>
  );
};

export default App;
