"use client";
import dynamic from "next/dynamic";

// Import the components individually
const DragDropContext = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.DragDropContext),
  { ssr: false }
);

const Droppable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Droppable),
  { ssr: false }
);

const Draggable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Draggable),
  { ssr: false }
);

// src/components/MockTable.js

import React from "react";

import { mockData } from "../helpers/mock-data";
import { TagStyles } from "../helpers/tag-styles";
const MockTable = () => {
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [sortColumn, setSortColumn] = React.useState("company");
  const [sortedData, setSortedData] = React.useState(mockData);
  const [showMenu, setShowMenu] = React.useState(false);
  const [activeColumn, setActiveColumn] = React.useState(null);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState({
    column: "",
    value: "",
  });
  const menuRef = React.useRef(null);
  const [columnOrder, setColumnOrder] = React.useState([
    "company",
    "name",
    "domain",
    "categories",
  ]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleColumnClick = (column, e) => {
    e.stopPropagation();
    setActiveColumn(column);
    setShowMenu(!showMenu);
  };

  const handleSort = (newOrder) => {
    setSortOrder(newOrder);
    setSortColumn(activeColumn);
    const sorted = [...sortedData].sort((a, b) => {
      if (newOrder === "asc") {
        return a[activeColumn].localeCompare(b[activeColumn]);
      }
      return b[activeColumn].localeCompare(a[activeColumn]);
    });
    setSortedData(sorted);
    setShowMenu(false);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
    setShowMenu(false);
  };

  const applyFilter = () => {
    const filtered = mockData.filter((item) =>
      item[activeColumn].toLowerCase().includes(filterValue.toLowerCase())
    );
    setSortedData(filtered);
    setActiveFilter({ column: activeColumn, value: filterValue });
    setShowFilterModal(false);
  };

  const clearFilter = () => {
    setSortedData(mockData);
    setActiveFilter({ column: "", value: "" });
    setFilterValue("");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newColumnOrder = Array.from(columnOrder);
    const [removed] = newColumnOrder.splice(result.source.index, 1);
    newColumnOrder.splice(result.destination.index, 0, removed);

    setColumnOrder(newColumnOrder);
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      {activeFilter.value && (
        <div className="bg-gray-50 dark:bg-gray-700 p-3 mb-2 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Filtered by {activeFilter.column}:{" "}
              <strong>{activeFilter.value}</strong>
            </span>
          </div>
          <button
            onClick={clearFilter}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear filter
          </button>
        </div>
      )}
      <table className="min-w-full border-collapse bg-white dark:bg-gray-800">
        <DragDropContext onDragEnd={onDragEnd} isCombineEnabled={false}>
          <Droppable
            droppableId="thead"
            direction="horizontal"
            isDropDisabled={false}
          >
            {(provided) => (
              <thead ref={provided.innerRef} {...provided.droppableProps}>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  {columnOrder.map((column, index) => (
                    <Draggable key={column} draggableId={column} index={index}>
                      {(provided, snapshot) => (
                        <th
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-6 py-3 cursor-pointer select-none relative dark:text-gray-200 ${
                            snapshot.isDragging
                              ? "bg-gray-100 dark:bg-gray-600"
                              : ""
                          }`}
                          onClick={
                            column !== "categories"
                              ? (e) => handleColumnClick(column, e)
                              : undefined
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                {column === "company" && (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                )}
                                {column === "name" && (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                )}
                                {column === "domain" && (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                  />
                                )}
                                {column === "categories" && (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                  />
                                )}
                              </svg>
                              <span className="capitalize">{column}</span>
                            </div>
                            {column !== "categories" && (
                              <svg
                                className={`w-4 h-4 text-gray-500 transform ${
                                  sortOrder === "desc" && sortColumn === column
                                    ? "rotate-180"
                                    : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                          </div>
                          {showMenu &&
                            activeColumn === column &&
                            column !== "categories" && (
                              <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu">
                                  <button
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSort("asc")}
                                  >
                                    Sort ascending
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSort("desc")}
                                  >
                                    Sort descending
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={handleFilter}
                                  >
                                    Filter
                                  </button>
                                </div>
                              </div>
                            )}
                        </th>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tr>
              </thead>
            )}
          </Droppable>
        </DragDropContext>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedData.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              {columnOrder.map((column) => (
                <td key={column} className="px-6 py-4">
                  {column === "company" && (
                    <div className="flex items-center gap-3">
                      <img
                        src={item.logo}
                        alt={`${item.company} logo`}
                        className="w-8 h-8 rounded object-contain bg-white"
                      />
                      <span className="font-medium">{item.company}</span>
                    </div>
                  )}
                  {column === "name" && item.name}
                  {column === "domain" && (
                    <a
                      href={`https://${item.domain}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.domain}
                    </a>
                  )}
                  {column === "categories" && (
                    <div className="flex flex-wrap gap-1">
                      {item.categories.map((category, catIndex) => (
                        <span
                          key={catIndex}
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            TagStyles[category] || TagStyles.default
                          }`}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4 dark:text-gray-200">
              Filter by{" "}
              {activeColumn.charAt(0).toUpperCase() + activeColumn.slice(1)}
            </h3>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="Type to filter..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={() => setShowFilterModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={applyFilter}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTable;
