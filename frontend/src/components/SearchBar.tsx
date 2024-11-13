import type { FC, FormEvent } from "react";

interface SearchBarProps {
  drugName: string;
  setDrugName: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const SearchBar: FC<SearchBarProps> = ({ drugName, setDrugName, onSubmit }) => {
  return (
    <form onSubmit={(e) => onSubmit(e)} className="flex gap-4 mb-8">
      <input
        type="text"
        value={drugName}
        onChange={(e) =>
          setDrugName(
            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
          )
        }
        placeholder="Enter drug name (e.g., Tylenol)"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
