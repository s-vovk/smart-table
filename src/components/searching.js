// import { rules, createComparison, defaultRules } from "../lib/compare.js";

export function initSearching(searchField) {
  /*
  const searchRules = ["skipEmptyTargetValues"];

  // @todo: #5.1 — настроить компаратор
  const compare = createComparison(searchRules, [
    rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false
    ),
  ]);
  */

  return (query, state, action) => {
    // result заменили на query
    return state[searchField]
      ? Object.assign({}, query, {
          // проверяем, что в поле поиска было что-то введено
          search: state[searchField], // устанавливаем в query параметр
        })
      : query; // если поле с поиском пустое, просто возвращаем query без изменений
  };
  /*
  return (data, state, action) => {
    if (action?.name === "clear") {
      console.log(action);
    }

    // @todo: #5.2 — применить компаратор
    return data.filter((row) => compare(row, state));
  };
  */
}
