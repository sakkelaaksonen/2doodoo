import mustache from './mustache.mjs';
import  TodoCollection  from './todoCollection.js';
import { TodoList } from './todoList.js';
export default class App {
    static STORAGE_KEY = 'todoCollection';
    static TODO_TEMPLATE  = `{{#items}}<form> <div class="input-group">
        <div class="input-row">
          <input type="text" class="desc" value="{{desc}}"/>
          <div class="button-group" role="radiogroup" aria-label="Set status">
            <label>
              <input type="radio" data-index={{index}} name="status" value="todo" {{#todo}} checked{{/todo}} />
              <span>Todo</span>
            </label>
            <label>
              <input type="radio" data-index={{index}} name="status" value="doing" {{#doing}} checked{{/doing}} />
              <span>Doing</span>
            </label>
            <label>
              <input type="radio" data-index={{index}}  name="status" value="done" {{#done}} checked{{/done}} />
              <span>Done</span>
            </label>
          </div>
          <div class="button-group">
            <button type="button" class="delete-button" value="delete" data-index="{{index}}" aria-label="Delete todo">Remove</button
          </div>
        </div>
      </div></form>{{/items}}`;


    constructor() {
      this.collection = new TodoCollection();
      this.setupEventListeners();
      this.loadFromLocalStorage();
      this.render();

      // Listen for changes in the collection and re-render
      this.collection.addEventListener(TodoCollection.CHANGE_EVENT, () => {
        this.render();
        this.saveToLocalStorage();
      });
    }

    setupEventListeners() {
      
      // const listForm = document.getElementById('new-list-form');
        // const input = document.getElementById('list-name-input');
        // const errorDiv = document.getElementById('list-name-error');
        //  Custom event for rendering upon list changes


        // listForm.addEventListener('submit', (e) => {
        //     e.preventDefault();
        //     const value = input.value.trim();
        //     let errorMsg = '';

        //     if (!value) {
        //         errorMsg = 'List name is required.';
        //     } else if (!/^[\p{L}\p{N}]+$/u.test(value)) {
        //         errorMsg = 'List name must only contain letters and numbers.';
        //     } else if (value.length > 60) {
        //         errorMsg = 'List name must be at most 60 characters.';
        //     } else if (this.collection.lists.some(list => list.listName === value)) {
        //         errorMsg = 'A list with this name already exists.';
        //     }

        //     if (errorMsg) {
        //         errorDiv.textContent = errorMsg;
        //         input.setAttribute('aria-invalid', 'true');
        //         input.focus();
        //     } else {
        //         errorDiv.textContent = '';
        //         input.setAttribute('aria-invalid', 'false');
        //         this.collection.addList(value);
        //         input.value = '';
                
        //     }
        // });

        const itemForm = document.getElementById('new-item-form');
        // Event listener for adding new todo item
        const listener = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const input = document.getElementById('todo-input');
            const value = input.value.trim();
            if (value) {
                this.collection.getList(0).addItem(value);
                input.value = '';
            }
            return false;
        };

        itemForm.addEventListener('submit', listener);

        // Delegated event listener for status change
        const todosContainer = document.getElementById('current-todos');
        const statusListener = (e) => {
          let targetInput;
            if (
                e.target.matches('input[type="radio"][name="status"]')
            ) {
                targetInput = e.target;
                const index = targetInput.getAttribute('data-index');
                if (index) {
                    this.collection.getList(0).setItemStatus(index, e.target.value);
                }
            }
        };
        todosContainer.addEventListener('change', statusListener);

          // Delegated event listener for editing todo item description
          const descListener = (e) => {
            if (e.target.matches('input.desc')) {
              // Find the index from the closest form's radio input
              const form = e.target.closest('form');
              let index = null;
              if (form) {
                const radio = form.querySelector('input[type="radio"][name="status"]');
                if (radio) {
                  index = radio.getAttribute('data-index');
                }
              }
              const newDesc = e.target.value;
              if (index !== null && index !== undefined && newDesc.trim().length > 0) {
                this.collection.getList(0).editItem(Number(index), newDesc.trim());
              }
            }
          };
          todosContainer.addEventListener('change', descListener);

        //Delegated event listener for delete button
        const deleteListener = (e) => {
          if (e.target.matches('button.delete-button')) {
            e.preventDefault();
            const index = e.target.getAttribute('data-index');
            if (index) {
              this.collection.getList(0).removeItem(index);
            }
          }
        };
        todosContainer.addEventListener('click', deleteListener);

        // Save to localStorage on page unload
        window.addEventListener('beforeunload', () => this.saveToLocalStorage()); 
    }

    render() {
      const data = this.collection.getList(0).getTemplateData();
      const container =  document.getElementById('current-todos');
      container.innerHTML = mustache.render(
            App.TODO_TEMPLATE,
            data
        );
    }

    saveToLocalStorage() {
      try {
        const data = JSON.stringify(this.collection);
        localStorage.setItem(App.STORAGE_KEY, data);
      } catch(e) {
        console.error('Failed to save to localStorage', e);
        alert('Failed to save data. Your changes may be lost.');
      } 
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem(App.STORAGE_KEY);
        if (data) {
          try {
            const obj = JSON.parse(data);
            if (!obj || !Array.isArray(obj.lists)) {
              console.error('Load Error: Empty store or malformed data');
              throw new Error('Empty store or malformed data');
            }
            this.collection = new TodoCollection();
            obj.lists.forEach(listData => {
                this.collection.addList(listData.listName);
                const list = this.collection.getList(this.collection.lists.length - 1);
                listData.items.forEach(itemData => {
                    list.addItem(itemData.desc);
                    list.setItemStatus(list.items.length - 1, itemData.status);
                });
            });
          } catch(e) {
            console.error('Failed to load from localStorage', e);
            alert('Failed to load saved data. Starting with a new list.');
            this.collection = new TodoCollection();
            this.collection.addList('SampleList');
            this.collection.getList(0).addItem('Sample Task 1');
            this.collection.getList(0).addItem('Sample Task 2');
            this.collection.getList(0).setItemStatus(1, TodoList.STATUS_DOING);
            this.saveToLocalStorage();
          }
      } 
    }
};