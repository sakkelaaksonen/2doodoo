import mustache from './mustache.mjs';
import { TodoList } from './todoList.js';

export default class TodoApp {
    static DEFAULT_FILTER = 'all';
    static TODO_TEMPLATE = `{{#items}}
    <form class="mb-spacer-large"> 
    <div class="input-group" data-index="{{index}}">
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
        this._currentList = null;
        this._onListChange = null;
        this._attachListListener();
        this.setupEventListeners();
        this.render();
        // Listen for external list selection changes
        document.getElementById('todo-list-selector').addEventListener('change', () => {
            this._attachListListener();
            this.render();
        });
    }

    _attachListListener() {
        const list = this.getSelectedList();
        if (this._currentList) {
            this._currentList.removeEventListener(TodoList.CHANGE_EVENT, this._onListChange);
        }
        this._currentList = list;
        if (list) {
            this._onListChange = (e) => {
                const type = e.detail?.type;
                // Only rerender for add, remove, edit, or filter change
                if (type === 'add' || type === 'remove' || type === 'edit') {
                    this.render();
                } else if (type === 'status') {
                    // Only rerender if filter is not 'all' and status change affects visible items
                    if (this.filter !== TodoApp.DEFAULT_FILTER) {
                        this.render();
                    } else {
                        // Just update checked state, preserve focus
                        const container = document.getElementById('current-todos');
                        const index = e.detail?.index;
                        const status = e.detail?.status;
                        if (container && index !== undefined && status) {
                            const radio = container.querySelector(`input[name="status"][data-index="${index}"][value="${status}"]`);
                            if (radio) radio.checked = true;
                        }
                    }
                }
            };
            list.addEventListener(TodoList.CHANGE_EVENT, this._onListChange);
        }
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
                // No render here; handled by event listener
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
                    // No render here; handled by event listener
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
                    // No render here; handled by event listener
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
                    // No render here; handled by event listener
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
                    // No render here; handled by event listener
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
        const container = document.getElementById('current-todos');
        container.innerHTML = mustache.render(TodoApp.TODO_TEMPLATE, data);
    }
}
