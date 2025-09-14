import { state, saveState, loadState } from "./state.js";
import { subscribe } from "valtio/vanilla";
import * as listApp from "./listApp.js";
import * as todoApp from "./todoApp.js";

console.log("main.js loaded");
function main() {
  // Load state from localStorage if available
  state.initFromStorage();
  listApp.init();

  // Initial render
  listApp.renderListApp();
  todoApp.renderTodoApp();

  // Setup event listeners
  listApp.setupListAppEvents();
  todoApp.setupTodoAppEvents();
  todoApp.setupNewItemForm();

  // Subscribe to state changes for reactive UI and persistence
  subscribe(state, () => {
    saveState(state);

    listApp.renderListApp();
    todoApp.renderTodoApp();
  });
}

main();
