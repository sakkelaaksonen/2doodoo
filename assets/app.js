import mustache from './mustache.mjs';
import  TodoCollection  from './todoCollection.js';
import { TodoList } from './todoList.js';
export default class App {

    static TODO_TEMPLATE  = `{{#items}}<form> <div class="input-group">
        <div class="input-row">
          <span class="desc">{{desc}}</span>
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
      // this.loadFromLocalStorage();  
      this.collection = new TodoCollection();
      //demo setup
      
      this.setupEventListeners();
      this.loadFromLocalStorage();
      this.render();

        
    }

    setupEventListeners() {
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
                this.render();
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
                // Find the index of the form (each todo item is a form)
              targetInput = e.target;
              const index = targetInput.getAttribute('data-index');
              if (index) {
                  this.collection.getList(0).setItemStatus(index, e.target.value);
                  this.render();
                }
            }
        };
        
        todosContainer.addEventListener('change', statusListener);
      
        //Delegated event listener for delete button
        const deleteListener = (e) => {
          if (e.target.matches('button.delete-button')) {
            e.preventDefault();
            const index = e.target.getAttribute('data-index');
            if (index) {
              this.collection.getList(0).removeItem(index);
              this.render();
            }
          }
        };
        
        todosContainer.addEventListener('click', deleteListener);
        
        // Save to localStorage on page unload
        window.addEventListener('beforeunload', () => this.saveToLocalStorage()); 
    }


    render() {
      const data = this.collection.getList(0).getTemplateData();
      console.log(data, 'data');  
      const container =  document.getElementById('current-todos');
        container.innerHTML = mustache.render(
            App.TODO_TEMPLATE,
            data
        );
    }

    saveToLocalStorage() {
      try {
        const data = JSON.stringify(this.collection);
        localStorage.setItem('todoCollection', data);
    } catch(e) {
        console.error('Failed to save to localStorage', e);
        alert('Failed to save data. Your changes may be lost.');
      } 
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('todoCollection');
        if (data) {
          try {
            const obj = JSON.parse(data);
           //check for empty or malformed data
            if (!obj || !Array.isArray(obj.lists)) {
              console.error('Load Error: Empty store or malformed data');
              throw new Error('Empty store or malformed data');
            }
           
            // Reconstruct TodoCollection and its lists/items
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
            //Setup demo data if loading fails
            this.collection = new TodoCollection();
            const added = this.collection.addList('SampleList');
            this.collection.getList(0).addItem('Sample Task 1');
            this.collection.getList(0).addItem('Sample Task 2');
            this.collection.getList(0).setItemStatus(1, TodoList.STATUS_DOING);
            this.saveToLocalStorage
            this.render();

          }
      } 
    }
};