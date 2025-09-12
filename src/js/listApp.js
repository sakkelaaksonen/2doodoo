import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";
import TodoCollection from "./todoCollection.js";
import mustache from "./mustache.mjs";
import Menu from "./menu.js";

// Simple debounce utility
function _debounce(fn, delay) {
  let timer = null;
  
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * ListApp manages todo lists: creation, selection, and rendering the list selector.
 */
export default class ListApp {
  static OPTIONS_TEMPLATE = `
      {{#lists}}
      <option value="{{index}}" {{#selected}}selected{{/selected}}>{{listName}}</option>
      {{/lists}}
    `;

  static TITLE_TEMPLATE = `
      <div class="input-group" style="margin-bottom:0;">
        <div class="input-row">
          <input id="list-name-display" class="text-input" type="text" value="{{listName}}" maxlength="60" aria-label="Edit list name" required placeholder="Max 60 letters and numbers" aria-describedby="list-name-edit-error" aria-invalid="false" />
          <button id="remove-list-btn" type="button" aria-label="Remove list" >Remove</button>
        </div>
        <div id="list-name-edit-error" aria-live="assertive"></div>
      </div>`;

  constructor({ onListSelect }) {
    // Load from localStorage if available
    const loaded = loadFromLocalStorage(TodoCollection);
    this.collection = loaded.collection;
    this.selectedIndex = loaded.selectedIndex;
    this.onListSelect = onListSelect;
    this._debouncedDispatchChange = _debounce(() => {
      this.collection.notifyChange();
    }, 200);

    this.setupEventListeners();

    this.render();
    // Save to localStorage on page unload
    window.addEventListener("beforeunload", () =>
      saveToLocalStorage(this.collection, this.selectedIndex)
    );
    this.menu = Menu();
  }

  setupEventListeners() {



    // Listen to all collection changes and handle render/save
    this.collection.addEventListener(TodoCollection.CHANGE_EVENT, () => {
      this.render();
      saveToLocalStorage(this.collection, this.selectedIndex);
    });

    const listForm = document.getElementById("new-list-form");
    const input = document.getElementById("list-name-input");
    const errorDiv = document.getElementById("list-name-error");

    //New list submit listener
    if (listForm && input && errorDiv) {
      listForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = input.value.trim();
        const errorMsg = TodoCollection.validateListName(
          value,
          this.collection.lists
        );
        if (errorMsg) {
          errorDiv.textContent = errorMsg;
          input.setAttribute("aria-invalid", "true");
          input.focus();
        } else {
          errorDiv.textContent = "";
          input.setAttribute("aria-invalid", "false");
          this.collection.addList(value);
          input.value = "";
          this.selectedIndex = this.collection.lists.length - 1;
          if (this.onListSelect) this.onListSelect(this.selectedIndex);
        }
      });
    }
    // List selection
    const selector = document.getElementById("todo-list-selector");
    if (selector) {
      selector.addEventListener("change", (e) => {
        this.selectedIndex = Number(e.target.value);
        if (this.onListSelect) this.onListSelect(this.selectedIndex);
        this.render(); // still need to render for selection change
      });
    }
    // Delegated listener for list name input
    const titleElem = document.getElementById("list-title-container");
    if (titleElem) {
      titleElem.addEventListener(
        "blur",
        this._handleListNameEdit.bind(this),
        true
      );
      titleElem.addEventListener(
        "change",
        this._handleListNameEdit.bind(this),
        true
      );
      titleElem.addEventListener(
        "keydown",
        this._handleListNameEdit.bind(this),
        true
      );
    }
  }

  _handleListNameEdit(e) {
    const input = e.target;
    if (input.id === "list-name-display") {
      const currentList = this.collection.lists[this.selectedIndex];
      const errorDiv = document.getElementById("list-name-edit-error");
      if (
        e.type === "blur" ||
        e.type === "change" ||
        (e.type === "keydown" && e.key === "Enter")
      ) {
        const newName = input.value.trim();
        const errorMsg = TodoCollection.validateListName(
          newName,
          this.collection.lists,
          currentList.listName
        );
        if (errorMsg) {
          input.setAttribute("aria-invalid", "true");
        } else {
          input.setAttribute("aria-invalid", "false");
        }
        errorDiv.textContent = errorMsg;
        if (!errorMsg && newName !== currentList.listName) {
          currentList.listName = newName;
          if (this.onListSelect) this.onListSelect(this.selectedIndex);
          
          this._debouncedDispatchChange();
        }
      }
    }
  }

  render() {
    const selector = document.getElementById("todo-list-selector");
    if (!this.collection || !Array.isArray(this.collection.lists)) {
      selector.innerHTML = "";
      return;
    }
    // Use mustache to render the list selector options
    const optionsData = {
      lists: this.collection.lists.map((list, i) => ({
        listName: list.listName,
        index: i,
        selected: i === this.selectedIndex,
      })),
    };
    selector.innerHTML = mustache.render(ListApp.OPTIONS_TEMPLATE, optionsData);

    // Update navi-listname only
    const naviListname = document.getElementById("navi-listname");
    const currentList = this.collection.lists[this.selectedIndex];
    if (naviListname && currentList) {
      naviListname.textContent = currentList.listName;
    } else if (naviListname) {
      naviListname.textContent = "Todos";
    }

    // Render list name as directly editable input and remove button using mustache
    const titleElem = document.getElementById("list-title-container");
    if (titleElem && currentList) {
      titleElem.innerHTML = mustache.render(ListApp.TITLE_TEMPLATE, {
        listName: currentList.listName,
      });
      // Remove button logic
      const removeBtn = document.getElementById("remove-list-btn");
      if (removeBtn) {
        removeBtn.onclick = () => {
          if (this.collection.lists.length === 0) return;
          if (
            confirm(
              `Are you sure you want to remove the list "${currentList.listName}"? This cannot be undone.`
            )
          ) {
            this.collection.removeList(this.selectedIndex);
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            if (this.onListSelect) this.onListSelect(this.selectedIndex);
          }
        };
      }
    }
  }

  getSelectedList() {
    return this.collection.getList(this.selectedIndex);
  }
}
