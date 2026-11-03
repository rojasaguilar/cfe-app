import { List, Network } from "lucide-react";

export const ViewToggle = ({ view, setView }) => {
  return (
    <div className="flex bg-gray-200 p-1 rounded-lg w-max mb-6">
      <button
        onClick={() => setView("list")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
          view === "list"
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <List size={18} />
        <span>Lista</span>
      </button>
      <button
        onClick={() => setView("tree")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
          view === "tree"
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Network size={18} />
        <span>Árbol</span>
      </button>
    </div>
  );
};