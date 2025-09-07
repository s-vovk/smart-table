import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initPagination } from "./components/pagination.js";
import { initSearching } from "./components/searching.js";
// @todo: подключение

// Исходные данные используемые в render()
const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    // расширьте существующий return вот так
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  // let result = [...data]; // копируем для последующего изменения
  let query = {};

  // @todo: использование
  // result = applySearching(result, state, action);
  // result = applyFiltering(result, state, action);
  // result = applySorting(result, state, action);
  // result = applyPagination(result, state, action);

  query = applyPagination(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySearching(query, state, action);
  query = applySorting(query, state, action);

  const { total, items } = await api.getRecords(query);
  updatePagination(total, query);

  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

const applySearching = initSearching(sampleTable.search);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

const init = async () => {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
};

init().then(render);
