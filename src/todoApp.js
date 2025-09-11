import mustache from './mustache.mjs';
import { TodoList } from './todoList.js';
import { loadFromLocalStorage, saveToLocalStorage } from './storage.js';

export default class TodoApp {
    static DEFAULT_FILTER = 'all';
    static TODO_TEMPLATE = `{{#items}}<form> <div class="input-group">
      <div class="input-row">
        <input class="text-input" type="text" name="user-input" required minlength="1" maxlength="60" placeholder="Max 60 letters and numbers" aria-errormessage="Only letters and numbers are allowed." aria-required="true" aria-label="New Todo item" value="{{desc}}"/>
      </div>
      <div class="input-row">
        <div class="toggle-button" role="radiogroup" aria-label="Set status">
            <label class="toggle-buttonlabel">
              <input type="radio" data-index={{index}} name="status" value="todo" {{#todo}} checked{{/todo}} />
              <span>Todo</span>
            </label>
            <label class="toggle-buttonlabel">
              <input type="radio" data-index={{index}} name="status" value="doing" {{#doing}} checked{{/doing}} />
              <span>Doing</span>
            </label>
            <label class="toggle-buttonlabel">
              <input type="radio" data-index={{index}}  name="status" value="done" {{#done}} checked{{/done}} />
              <span>Done</span>
            </label>
          </div>
          <div class="button-group">
            <button type="button" class="delete-button" value="delete" data-index="{{index}}" aria-label="Delete todo">Remove</button>
          </div>
        </div>
      </div></form>{{/items}}
      {{^items}}<p>{{#filter}} No items yet with status "{{filter}}"{{/filter}} {{^filter}}No items yet{{/filter}} </p>{{/items}}`;

    constructor({ getSelectedList }) {
        this.filter = TodoApp.DEFAULT_FILTER;
        this.getSelectedList = getSelectedList;
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Filter changes
        const filterGroup = document.querySelector('.toggle-button[role="radiogroup"][aria-label="Set status"]');
        if (filterGroup) {
            filterGroup.addEventListener('change', (e) => {
                if (e.target.matches('input[type="radio"][name="filter"]')) {
                    this.setFilter(e.target.value);
                }
            });
        }
        // Add item
        const itemForm = document.getElementById('new-item-form');
        itemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('todo-input');
            const value = input.value.trim();
            const list = this.getSelectedList();
            if (list && value) {
                list.addItem(value);
                input.value = '';
                this.render();
            }
        });
        // Status change
        const todosContainer = document.getElementById('current-todos');
        todosContainer.addEventListener('change', (e) => {
            if (e.target.matches('input[type="radio"][name="status"]')) {
                const index = e.target.getAttribute('data-index');
                const list = this.getSelectedList();
                if (list && index !== null) {
                    list.setItemStatus(index, e.target.value);
                    this.render();
                }
            }
        });
        // Edit description
        todosContainer.addEventListener('change', (e) => {
            if (e.target.matches('input.text-input')) {
                const form = e.target.closest('form');
                const radio = form.querySelector('input[type="radio"][name="status"]');
                const index = radio?.getAttribute('data-index');
                const newDesc = e.target.value;
                const list = this.getSelectedList();
                if (list && index !== null && newDesc.trim().length > 0) {
                    list.editItem(Number(index), newDesc.trim());
                    this.render();
                }
            }
        });
        // Delete item
        todosContainer.addEventListener('click', (e) => {
            if (e.target.matches('button.delete-button')) {
                const index = e.target.getAttribute('data-index');
                const list = this.getSelectedList();
                if (list && index !== null) {
                    list.removeItem(index);
                    this.render();
                }
            }
        });
        // Clear completed
        const clearCompletedBtn = document.getElementById('clear-completed-button');
        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener('click', () => {
                const list = this.getSelectedList();
                if (list) {
                    for (let i = list.items.length - 1; i >= 0; i--) {
                        if (list.items[i].status === TodoList.STATUS_DONE) {
                            list.removeItem(i);
                        }
                    }
                    this.render();
                }
            });
        }
    }

    setFilter(newFilter) {
        this.filter = newFilter;
        this.render();
    }

    render() {
        const list = this.getSelectedList();
        let data = list?.getTemplateData() ?? { items: [] };
        if (this.filter && this.filter !== TodoApp.DEFAULT_FILTER && TodoList.isValidStatus(this.filter)) {
            data = {
                ...data,
                filter: this.filter,
                items: data.items.filter(item => item[this.filter])
            };
        }
        // Update the Current Todos heading with the list name
        const currentTodosTitle = document.getElementById('current-todos-title');
        if (currentTodosTitle) {
            currentTodosTitle.textContent = `Current Todos: ${list?.listName || ''}`;
        }
        const container = document.getElementById('current-todos');
        container.innerHTML = mustache.render(TodoApp.TODO_TEMPLATE, data);
    }
}
