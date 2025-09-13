import { state } from './state.js';
import { subscribe } from 'valtio/vanilla';
import * as listApp from './listApp.js';


console.log("main.js loaded");
function main() {

  listApp.init();
  state.reset();


  // Initial render
  listApp.renderListApp();

  // Setup event listeners
  listApp.setupListAppEvents();

  // Subscribe to state changes for reactive UI and persistence
  subscribe(state, (a) => {
    console.log("State changed:", a);
    console.log("State after reset:", state.lists);
    listApp.renderListApp();
  });

  console.log("Subcribed to state changes");

  // Initialize menu
  

}

document.addEventListener('DOMContentLoaded', main);
