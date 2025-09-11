import ListApp from './listApp.js';
import TodoApp from './todoApp.js';



function main() {      

    window.listApp = new ListApp({
        onListSelect: (selectedIndex) => {

            // Re-render todoApp when list changes
            if (window.todoApp) window.todoApp.render();
        }
    });

    window.todoApp = new TodoApp({
        getSelectedList: () => window.listApp.getSelectedList()
    });
  
}


document.addEventListener('DOMContentLoaded', main);
