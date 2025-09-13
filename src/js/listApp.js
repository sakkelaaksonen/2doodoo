import { state } from './state.js';
import mustache from 'mustache';
import Menu from './menu.js';
export const OPTIONS_TEMPLATE = `
  {{#lists}}
  <option value="{{id}}" {{#selected}}selected{{/selected}}>{{name}}</option>
  {{/lists}}
`;

export const TITLE_TEMPLATE = `
  <div class="input-group mb-spacer">
   <label for="list-name-display">Selected List Name</label>
    <div class="input-row">
      <input id="list-name-display" class="text-input" type="text" value="{{name}}" maxlength="60" aria-label="Edit list name" required placeholder="Max 60 letters and numbers" aria-describedby="list-name-edit-error" aria-invalid="false" />
      <button id="remove-list-btn" type="button" aria-label="Remove list" >Remove</button>
    </div>
    <div id="list-name-edit-error" aria-live="assertive"></div>
  </div>`;

export function init() {
  // Initialize menu

  Menu();
}

export function renderListApp() {
  
  // Render list selector
  const optgroup = document.getElementById('todo-list-options');
  console.log("state in renderListApp:", state);
  const optionsData = {
    lists: state.lists.map(list => ({
      name: list.name,
      id: list.id,
      selected: list.id === state.selected,
    })),
  };
  optgroup.innerHTML = mustache.render(OPTIONS_TEMPLATE, optionsData);

  // Render title
  const titleElem = document.getElementById('list-title-container');
  const currentList = state.lists.find(list => list.id === state.selected);
  if (titleElem && currentList) {
    titleElem.innerHTML = mustache.render(TITLE_TEMPLATE, {
      name: currentList.name,
    });
  }
}

// Event handlers
export function setupListAppEvents() {
  // Add new list
  const listForm = document.getElementById('new-list-form');
  const input = document.getElementById('list-name-input');
  const errorDiv = document.getElementById('list-name-error');
  if (listForm && input && errorDiv) {
    listForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      try {
        state.addList(value);
        const newList = state.lists[state.lists.length - 1];
        state.selected = newList.id;
        input.value = '';
        setTimeout(() => input.focus(), 0);
      } catch (err) {
        errorDiv.textContent = err.message;
      }
    });
  }

  // List selection
  const selector = document.getElementById('todo-list-selector');
  if (selector) {
    selector.addEventListener('change', (e) => {
      state.selected = e.target.value;
    });
  }

  // Remove list
  const titleElem = document.getElementById('list-title-container');
  if (titleElem) {
    titleElem.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'remove-list-btn') {
        if (state.lists.length === 0) return;
        const currentList = state.lists.find(list => list.id === state.selected);
        if (
          confirm(`Are you sure you want to remove the list "${currentList.name}"? This cannot be undone.`)
        ) {
          state.removeList(currentList.id);
          if (state.lists.length > 0) {
            state.selected = state.lists[0].id;
          } else {
            state.selected = null;
          }
        }
      }
    });
  }

  // Edit list name
  if (titleElem) {
    titleElem.addEventListener('blur', handleListNameEdit, true);
    titleElem.addEventListener('change', handleListNameEdit, true);
    titleElem.addEventListener('keydown', handleListNameEdit, true);
  }
}

function handleListNameEdit(e) {
  const input = e.target;
  if (input.id === 'list-name-display') {
    const currentList = state.lists.find(list => list.id === state.selected);
    const errorDiv = document.getElementById('list-name-edit-error');
    if (
      e.type === 'blur' ||
      e.type === 'change' ||
      (e.type === 'keydown' && e.key === 'Enter')
    ) {
      const newName = input.value.trim();
      if (newName.length > 0 && newName !== currentList.name) {
        const errorMsg = state.lists.some(list => list.name === newName && list.id !== currentList.id)
          ? 'A list with this name already exists.'
          : '';
        if (errorMsg) {
          errorDiv.textContent = errorMsg;
        } else {
          currentList.name = newName;
          errorDiv.textContent = '';
        }
      }
    }
  }
}
