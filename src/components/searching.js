import { rules, createComparison, defaultRules } from "../lib/compare.js";

export function initSearching(searchField) {
  const searchRules = ["skipEmptyTargetValues"];

  // @todo: #5.1 — настроить компаратор
  const compare = createComparison(searchRules, [
    rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false
    ),
  ]);

  return (data, state, action) => {
    if (action?.name === "clear") {
      console.log(action);
    }

    // @todo: #5.2 — применить компаратор
    return data.filter((row) => compare(row, state));
  };
}
