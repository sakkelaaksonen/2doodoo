import { state, STATUS_TODO, STATUS_DOING, STATUS_DONE, isValidStatus } from './state.js';
import mustache from 'mustache';

export const TODO_TEMPLATE = `{{#items}}
<form class="mb-spacer-large"> 
<div class="input-group" data-id="{{id}}">
  <div class="input-row">
    <input class="text-input" type="text" name="user-input" required minlength="1" maxlength="60" placeholder="Max 60 letters and numbers" aria-errormessage="Only letters and numbers are allowed." aria-required="true" aria-label="New Todo item" value="{{desc}}"/>
  </div>
  <div class="input-row">
    <div class="toggle-button" role="radiogroup" aria-label="Set status">
        <label class="toggle-buttonlabel">
          <input type="radio" data-id="{{id}}" name="status" value="todo" {{#todo}} checked{{/todo}} />
          <span>Todo</span>
        </label>
        <label class="toggle-buttonlabel">
          <input type="radio" data-id="{{id}}" name="status" value="doing" {{#doing}} checked{{/doing}} />
          <span>Doing</span>
        </label>
        <label class="toggle-buttonlabel">
          <input type="radio" data-id="{{id}}"  name="status" value="done" {{#done}} checked{{/done}} />
          <span>Done</span>
        </label>
      </div>
      <div class="button-group">
        <button type="button" class="delete-button" value="delete" data-id="{{id}}" aria-label="Delete todo">Remove</button>
      </div>
    </div>
  </div></form>{{/items}}
  {{^items}}<p>{{#filter}} No items yet with status "{{filter}}"{{/filter}} {{^filter}}No items yet{{/filter}} </p>{{/items}}`;

export function renderTodoApp() {
  const currentList = state.lists.find(list => list.id === state.selected);
  const container = document.getElementById('current-todos');
  if (!container) return;
  let items = [];
  if (currentList) {
    items = currentList.items.map(item => ({
      ...item,
      todo: item.status === STATUS_TODO,
      doing: item.status === STATUS_DOING,
      done: item.status === STATUS_DONE
    }));
  }
  container.innerHTML = mustache.render(TODO_TEMPLATE, { items });
}

export function setupTodoAppEvents() {
  const container = document.getElementById('current-todos');
  if (!container) return;

  // Status change
  container.addEventListener('change', (e) => {
    if (e.target.matches('input[type="radio"][name="status"]')) {
      const itemId = e.target.getAttribute('data-id');
      const status = e.target.value;
      const currentList = state.lists.find(list => list.id === state.selected);
      if (currentList && itemId && isValidStatus(status)) {
        state.setItemStatus(currentList.id, itemId, status);
      }
    }
    // Edit description
    if (e.target.matches('input.text-input')) {
      const itemId = e.target.closest('.input-group').getAttribute('data-id');
      const newDesc = e.target.value;
      const currentList = state.lists.find(list => list.id === state.selected);
      if (currentList && itemId && newDesc.trim().length > 0) {
        state.editItem(currentList.id, itemId, newDesc.trim());
      }
    }
  });

  // Delete item
  container.addEventListener('click', (e) => {
    if (e.target.matches('button.delete-button')) {
      const itemId = e.target.getAttribute('data-id');
      const currentList = state.lists.find(list => list.id === state.selected);
      if (currentList && itemId) {
        state.removeItem(currentList.id, itemId);
      }
    }
  });
}

export function setupNewItemForm() {
  const itemForm = document.getElementById('new-item-form');
  if (!itemForm) return;
  itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const value = input.value.trim();
    const currentList = state.lists.find(list => list.id === state.selected);
    if (currentList && value) {
      state.addItem(currentList.id, value);
      input.value = '';
    }
  });
}
