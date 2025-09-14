import { subscribe } from "valtio/vanilla";

// Track last status change for focus restoration
let lastStatusChange = null;

import {
  state,
  STATUS_TODO,
  STATUS_DOING,
  STATUS_DONE,
  isValidStatus,
  DEFAULT_FILTER,
} from "./state.js";
import mustache from "mustache";

let setupDone = false;

export const TODO_TEMPLATE = `{{#items}}
<form class="mb-spacer-large"> 
<div class="input-group" data-id="{{id}}">
  <div class="input-row">
    <input class="text-input" data-status="{{status}}" type="text" name="user-input" required minlength="1" maxlength="60" placeholder="Max 60 letters and numbers" aria-errormessage="Only letters and numbers are allowed." aria-required="true" aria-label="New Todo item" value="{{desc}}"/>
     <button type="button" class="delete-button" value="remove" data-id="{{id}}" >Remove</button>
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
  const currentList = state.getCurrentList();
  const container = document.getElementById("current-todos");
  const staticForms = document.querySelectorAll("#new-item-form, #filter-form");

  if (!currentList) {
    staticForms.forEach((form) => form.classList.add("hidden"));
    container.innerHTML = `<p>Please select or create a list to get started.</p>`;
    return;
  } else {
    staticForms.forEach((form) => form.classList.remove("hidden"));
  }

  if (!container) return;
  let items = [];
  if (currentList) {
    // Use state.getFilteredItems for filtering
    items = state
      .getFilteredItems(currentList.id, state.filter)
      .slice() // create a copy to avoid mutating original
      .reverse() // show latest first
      .map((item) => ({
        ...item,
        todo: item.status === STATUS_TODO,
        doing: item.status === STATUS_DOING,
        done: item.status === STATUS_DONE,
      }));
  }

  // Render item count in filter title
  const filterTitle = document.getElementById("current-todos-count");
  if (filterTitle) {
    const titleTemplate = "{{filtered}}/{{total}}";
    const totalCount = currentList ? currentList.items.length : 0;
    filterTitle.innerHTML = mustache.render(titleTemplate, {
      filtered: items.length,
      total: totalCount,
    });
  }

  // Enable/disable clear completed button
  const clearCompletedBtn = document.getElementById("clear-completed-button");
  if (clearCompletedBtn) {
    let hasCompleted = false;
    if (
      currentList &&
      currentList.items.some((item) => item.status === STATUS_DONE)
    ) {
      hasCompleted = true;
    }
    clearCompletedBtn.disabled = !hasCompleted;
  }

  container.innerHTML = mustache.render(TODO_TEMPLATE, {
    items,
    filter: state.filter,
  });
}

export function setupTodoAppEvents() {
  if (setupDone) {
    console.error("setupTodoAppEvents already called");
    return;
  }

  const container = document.getElementById("current-todos");
  if (!container) {
    console.error("No current-todos container found");
    return;
  }

  // --- Set filter radio to correct state on load ---
  const filterRadios = document.querySelectorAll(
    '#todo-list-header input[type="radio"][name="filter"]'
  );
  filterRadios.forEach((radio) => {
    radio.checked = radio.value === state.filter;
  });

  // Status change
  container.addEventListener("change", (e) => {
    if (e.target.matches('input[type="radio"][name="status"]')) {
      const itemId = e.target.getAttribute("data-id");
      const status = e.target.value;
      const currentList = state.getCurrentList();
      // Store the active element to restore focus after state update
      const activeElement = document.activeElement;
      if (currentList && itemId && isValidStatus(status)) {
        lastStatusChange = { itemId, status };
        state.setItemStatus(currentList.id, itemId, status);
      }
    }
    // Edit description
    if (e.target.matches("input.text-input")) {
      const itemId = e.target.closest(".input-group").getAttribute("data-id");
      const newDesc = e.target.value;
      const currentList = state.getCurrentList();
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
        const radio = document.querySelector(
          `input[type="radio"][name="status"][data-id="${itemId}"][value="${status}"]`
        );
        if (radio) radio.focus();
        lastStatusChange = null;
      }, 0);
    }
  });

  const filterForm = document.querySelector(
    '#todo-list-header .toggle-button[role="radiogroup"]'
  );
  if (filterForm) {
    filterForm.addEventListener("change", (e) => {
      if (e.target.matches('input[type="radio"][name="filter"]')) {
        const filterValue = e.target.value;
        if (filterValue === DEFAULT_FILTER || isValidStatus(filterValue)) {
          state.filter = filterValue;
        }
      }
    });
  }

  // Delete item
  container.addEventListener("click", (e) => {
    if (e.target.matches("button.delete-button")) {
      const itemId = e.target.getAttribute("data-id");
      const currentList = state.getCurrentList();
      if (currentList && itemId) {
        state.removeItem(currentList.id, itemId);
      }
    }
  });

  // Clear completed items
  const clearCompletedBtn = document.querySelector(
    "button#clear-completed-button"
  );
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
      const currentList = state.getCurrentList();
      if (currentList) {
        state.removeCompletedItems(currentList.id);
      }
    });
  }
  setupDone = true;
}

export function setupNewItemForm() {
  const itemForm = document.getElementById("new-item-form");
  if (!itemForm) return;
  itemForm.addEventListener("submit", handleAddNewItem);
}

function handleAddNewItem(e) {
  e.preventDefault();
  const input = document.getElementById("todo-input");
  const value = input.value.trim();
  const currentList = state.getCurrentList();
  if (currentList && value) {
    state.addItem(currentList.id, value);
    input.value = "";
  }
  //show label message and hide title.
  const label = document.querySelector('label[for="todo-input"]');
  if (label) {
    label.classList.add("success");
    const messageSpan = label.querySelector("span.message");
    messageSpan.textContent = "New item added";
    setTimeout(() => {
      label.classList.remove("success");
      messageSpan.textContent = "";
    }, 1500);
  }
}
