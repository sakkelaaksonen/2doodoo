
import { state } from './state.js';
import { subscribe } from 'valtio/vanilla';
import * as listApp from './listApp.js';
import * as todoApp from './todoApp.js';


console.log("main.js loaded");
function main() {

  listApp.init();
  state.reset();

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
    listApp.renderListApp();
    todoApp.renderTodoApp();
  });

  console.log("Subscribed to state changes");
}

document.addEventListener('DOMContentLoaded', main);
