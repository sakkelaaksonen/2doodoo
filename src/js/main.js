
import { state, saveState, loadState } from './state.js';
import { subscribe } from 'valtio/vanilla';
import * as listApp from './listApp.js';
import * as todoApp from './todoApp.js';


console.log("main.js loaded");
function main() {
  // Load state from localStorage if available
  const loaded = loadState();
  if (loaded && Array.isArray(loaded.lists)) {
    state.lists = loaded.lists;
    state.selected = loaded.selected;
    state.filter = loaded.filter;
  } else {
    state.reset();
  }

  listApp.init();

  // Initial render
  listApp.renderListApp();
  todoApp.renderTodoApp();

  // Setup event listeners
  listApp.setupListAppEvents();
  todoApp.setupTodoAppEvents();
  todoApp.setupNewItemForm();

  // Subscribe to state changes for reactive UI and persistence
  subscribe(state, (a) => {
    console.log("State changed:", a);
    console.log("State after reset:", state.lists);
    saveState(state);
    
    listApp.renderListApp();
    todoApp.renderTodoApp();
  });

  console.log("Subscribed to state changes");

}

main();
