import mustache from './mustache.mjs';
import  TodoCollection  from './todoCollection.js';
import { TodoList } from './todoList.js';
export default class App {

    static TODO_TEMPLATE  = ` <div class="input-group">
        <div class="input-row">
          <span class="desc">{{desc}}</span>
          <div class="button-group" role="radiogroup" aria-label="Set status">
            <label>
              <input type="radio" name="status" value="todo" {{#todo}} "checked"{{/todo}} />
              <span>Todo</span>
            </label>
            <label>
              <input type="radio" name="status" value="doing" {{#doing}} "checked"{{/doing}}/>
              <span>Doing</span>
            </label>
            <label>
              <input type="radio" name="status" value="done" {{#done}} "checked"{{/done}}/>
              <span>Done</span>
            </label>
          </div>
        </div>
      </div>`;


    constructor() {
      // this.loadFromLocalStorage();  
      this.collection = new TodoCollection();
      //demo setup
      const added = this.collection.addList('SampleList');
      console.log(this.collection, 'collection',added);
      this.collection.getList(0).addItem('Sample Task 1');
      this.collection.getList(0).addItem('Sample Task 2');
      this.collection.getList(0).setItemStatus(1, TodoList.STATUS_DOING);
      
      // this.render();

        
    }

    setupEventListeners() {
     
        
     
    }

    render() {
        const container =  document.getElementById('current-todos');
        container.innerHTML = mustache.render(
            App.TODO_TEMPLATE,
            this.collection.getList(0).getTemplateData()
        );
    }
};