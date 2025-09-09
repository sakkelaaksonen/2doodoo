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
        </div>
      </div></form>{{/items}}`;


    constructor() {
      // this.loadFromLocalStorage();  
      this.collection = new TodoCollection();
      //demo setup
      const added = this.collection.addList('SampleList');
      
      this.collection.getList(0).addItem('Sample Task 1');
      this.collection.getList(0).addItem('Sample Task 2');
      this.collection.getList(0).setItemStatus(1, TodoList.STATUS_DOING);
      this.setupEventListeners();
      this.render();

        
    }

    setupEventListeners() {
        const itemForm = document.getElementById('new-item-form');

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
};