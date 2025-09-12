import ListApp from "./listApp.js";
import TodoApp from "./todoApp.js";

function main() {
        console.log("main.js loaded");   
      const a = document.createElement("a");
  console.log(
    "supports-custom-select",
    CSS.supports("appearance: base-select")
  );

  window.listApp = new ListApp({
    onListSelect: (selectedIndex) => {
      // Re-render todoApp when list changes
      if (window.todoApp) window.todoApp.render();
    },
  });

  window.todoApp = new TodoApp({
    getSelectedList: () => window.listApp.getSelectedList(),
  });
}

document.addEventListener("DOMContentLoaded", main);
