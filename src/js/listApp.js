import { state, validateListName } from "./state.js";
import mustache from "mustache";
import Menu from "./menu.js";
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
  <button id="remove-list-btn" type="button" class="icon-btn icon-remove" aria-label="Remove list"></button>
    </div>
    <div id="list-name-edit-error" aria-live="assertive"></div>
  </div>`;

export function init() {
  // Initialize menu

  Menu();
}

export function renderListApp() {
  // Render list selector

  const selector = document.getElementById("todo-list-selector-group");
  const optgroup = document.getElementById("todo-list-options");
  if (!selector || !optgroup) {
    console.error("Todo list selector or options not found");
    return;
  }

  const optionsData = {
    lists: state.lists.map((list) => ({
      name: list.name,
      id: list.id,
      selected: list.id === state.selected,
    })),
  };
  // Could use getListById for selected, but template expects this structure
  optgroup.innerHTML = mustache.render(OPTIONS_TEMPLATE, optionsData);

  // Render title
  const titleElem = document.getElementById("list-title-container");
  const currentList = state.getCurrentList();
  if (!currentList) {
    selector.classList.add("hidden");
  } else {
    selector.classList.remove("hidden");
  }

  if (titleElem && currentList) {
    titleElem.innerHTML = mustache.render(TITLE_TEMPLATE, {
      //name doesnt exist if no list is selected. template handles that.
      name: currentList.name,
    });
  } else if (titleElem) {
    titleElem.innerHTML = "";
  }
  // Update navi-listname in navigation bar
  const naviListNameElem = document.getElementById("navi-listname");
  if (naviListNameElem) {
    naviListNameElem.textContent = currentList ? currentList.name : "";
  }
}

// Event handlers
export function setupListAppEvents() {
  // Add new list
  const listForm = document.getElementById("new-list-form");
  const input = document.getElementById("list-name-input");
  const errorDiv = document.getElementById("list-name-error");
  if (listForm && input && errorDiv) {
    listForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      try {
        state.addList(value);
        // state.addList already sets selected to the new list
        input.value = "";
        errorDiv.textContent = "";
        input.closest(".input-row").classList.remove("error");
        setTimeout(() => input.focus(), 0);
        //show label message and hide title.
        const label = document.querySelector('label[for="list-name-input"]');
        if (label) {
          label.classList.add("success");
          const messageSpan = label.querySelector("span.message");
          messageSpan.textContent = "New list added";

          setTimeout(() => {
            label.classList.remove("success");
            messageSpan.textContent = "";
          }, 1500);
        }
      } catch (err) {
        errorDiv.textContent = err.message;
        input.closest(".input-row").classList.add("error");
      }
    });
  }

  // List selection
  const selector = document.getElementById("todo-list-selector");
  if (selector) {
    selector.addEventListener("change", (e) => {
      state.selected = e.target.value;
      // Use getCurrentList for further logic if needed
    });
  }

  // Remove list
  const titleElem = document.getElementById("list-title-container");
  if (titleElem) {
    titleElem.addEventListener("click", (e) => {
      if (e.target && e.target.id === "remove-list-btn") {
        if (state.lists.length === 0) return;
        const currentList = state.getCurrentList();
        if (
          confirm(
            `Are you sure you want to remove the list "${currentList.name}"? This cannot be undone.`
          )
        ) {
          state.removeList(currentList.id);
        }
      }
    });
  }

  // Edit list name
  if (titleElem) {
    titleElem.addEventListener("blur", handleListNameEdit, true);
    titleElem.addEventListener("change", handleListNameEdit, true);
    titleElem.addEventListener("keydown", handleListNameEdit, true);
  }
}

function handleListNameEdit(e) {
  const input = e.target;
  if (input.id === "list-name-display") {
    const currentList = state.getCurrentList();
    const errorDiv = document.getElementById("list-name-edit-error");
    if (
      e.type === "blur" ||
      e.type === "change" ||
      (e.type === "keydown" && e.key === "Enter")
    ) {
      const newName = input.value.trim();
      if (newName.length > 0 && newName !== currentList.name) {
        // Use validateListName for all checks
        const errorMsg = validateListName(
          newName,
          state.lists,
          currentList.name
        );
        if (errorMsg) {
          errorDiv.textContent = errorMsg;
          input.closest(".input-row").classList.add("error");
        } else {
          // Could add a state.editListName method for this, but for now:
          currentList.name = newName;
          errorDiv.textContent = "";
          input.closest(".input-row").classList.remove("error");
        }
      }
      if (e.type === "keydown" && e.key === "Enter") {
        input.focus();
      }
    }
  }
}
