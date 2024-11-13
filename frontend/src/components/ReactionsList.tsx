import type { FC } from "react";

import type { Reaction } from "../common.types";

interface ReactionsListProps {
  reactions: Reaction[];
  drugName: string;
}

const ReactionsList: FC<ReactionsListProps> = ({ reactions, drugName }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        Adverse Reactions for {drugName}
      </h2>
      <div className="space-y-2">
        {!reactions.length && <span>No List</span>}
        {reactions.map((reaction, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
          >
            <span className="text-gray-800">{reaction.term}</span>
            <span className="font-semibold text-blue-600">
              {reaction.count.toLocaleString()} reports
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionsList;
