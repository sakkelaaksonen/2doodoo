import { subscribe } from 'valtio/vanilla';

// Track last status change for focus restoration
let lastStatusChange = null;

import { state, STATUS_TODO, STATUS_DOING, STATUS_DONE, isValidStatus, DEFAULT_FILTER } from './state.js';
import mustache from 'mustache';

export const TODO_TEMPLATE = `{{#items}}
<form class="mb-spacer-large"> 
<div class="input-group" data-id="{{id}}">
  <div class="input-row">
    <input class="text-input" type="text" name="user-input" required minlength="1" maxlength="60" placeholder="Max 60 letters and numbers" aria-errormessage="Only letters and numbers are allowed." aria-required="true" aria-label="New Todo item" value="{{desc}}"/>
     <button type="button" class="delete-button" value="delete" data-id="{{id}}" aria-label="Delete todo">Remove</button>
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

    // Filter items by state.filter if not 'all'
    if (state.filter && state.filter !== DEFAULT_FILTER && isValidStatus(state.filter)) {
      items = items.filter(item => item.status === state.filter);
    }
  }

  // Render item count in filter title
  const filterTitle = document.getElementById('current-todos-count');
  if (filterTitle) {
    const titleTemplate = '{{filtered}}/{{total}} items';
    const totalCount = currentList ? currentList.items.length : 0;
    filterTitle.innerHTML = mustache.render(titleTemplate, {
      filtered: items.length,
      total: totalCount
    });
  }

  // Enable/disable clear completed button
  const clearCompletedBtn = document.getElementById('clear-completed-button');
  if (clearCompletedBtn) {
    let hasCompleted = false;
    if (currentList && currentList.items.some(item => item.status === STATUS_DONE)) {
      hasCompleted = true;
    }
    clearCompletedBtn.disabled = !hasCompleted;
  }

  container.innerHTML = mustache.render(TODO_TEMPLATE, { items, filter: state.filter });
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
      // Store the active element to restore focus after state update
      const activeElement = document.activeElement;
      if (currentList && itemId && isValidStatus(status)) {
  lastStatusChange = { itemId, status };
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
// Subscribe to state changes to restore focus after status change
subscribe(state, () => {
  if (lastStatusChange) {
    // After rerender, restore focus to the changed radio input
    setTimeout(() => {
      const { itemId, status } = lastStatusChange;
      const radio = document.querySelector(`input[type="radio"][name="status"][data-id="${itemId}"][value="${status}"]`);
      if (radio) radio.focus();
      lastStatusChange = null;
    }, 0);
  }
});

  const filterForm = document.querySelector('#todo-list-header .toggle-button[role="radiogroup"][aria-label="Set status"]');
  if (filterForm) {
    filterForm.addEventListener('change', (e) => {
      console.log("Filter change event:", e);
      if (e.target.matches('input[type="radio"][name="filter"]')) {
        const filterValue = e.target.value;
        if (filterValue === DEFAULT_FILTER || isValidStatus(filterValue)) {
          state.filter = filterValue;
        }
      }
    });
  }

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

  // Clear completed items
  const clearCompletedBtn = document.querySelector('button#clear-completed-button');
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      const currentList = state.lists.find(list => list.id === state.selected);
      if (currentList) {
        // Remove all items with status STATUS_DONE
        // Iterate backwards to avoid index issues
        for (let i = currentList.items.length - 1; i >= 0; i--) {
          if (currentList.items[i].status === STATUS_DONE) {
            state.removeItem(currentList.id, currentList.items[i].id);
          }
        }
      }
    });
  }
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
