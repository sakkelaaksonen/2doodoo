import { loadFromLocalStorage, saveToLocalStorage } from './storage.js';
import TodoCollection from './todoCollection.js';
import mustache from './mustache.mjs';

/**
 * ListApp manages todo lists: creation, selection, and rendering the list selector.
 */
export default class ListApp {
    static TITLE_TEMPLATE = `Todos:
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
        this.setupEventListeners();
        this.render();
        // Save to localStorage on page unload
        window.addEventListener('beforeunload', () => saveToLocalStorage(this.collection, this.selectedIndex));
    }

    setupEventListeners() {
        const listForm = document.getElementById('new-list-form');
        const input = document.getElementById('list-name-input');
        const errorDiv = document.getElementById('list-name-error');

        //New list submit listener
        if (listForm && input && errorDiv) {
            listForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const value = input.value.trim();
                const errorMsg = TodoCollection.validateListName(value, this.collection.lists);
                if (errorMsg) {
                    errorDiv.textContent = errorMsg;
                    input.setAttribute('aria-invalid', 'true');
                    input.focus();
                } else {
                    errorDiv.textContent = '';
                    input.setAttribute('aria-invalid', 'false');
                    this.collection.addList(value);
                    input.value = '';
                    this.selectedIndex = this.collection.lists.length - 1;
                    this.render();
                    saveToLocalStorage(this.collection, this.selectedIndex);
                    if (this.onListSelect) this.onListSelect(this.selectedIndex);
                }
            });
        }
        // List selection
        const selector = document.getElementById('todo-list-selector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.selectedIndex = Number(e.target.value);
                this.render();
                saveToLocalStorage(this.collection, this.selectedIndex);
                if (this.onListSelect) this.onListSelect(this.selectedIndex);
            });
        }
    }

    render() {
        const selector = document.getElementById('todo-list-selector');
        if (!this.collection || !Array.isArray(this.collection.lists)) {
            selector.innerHTML = '';
            return;
        }
        selector.innerHTML = this.collection.lists.map((list, i) =>
            `<option value="${i}" ${i === this.selectedIndex ? 'selected' : ''}>${list.listName}</option>`
        ).join('');
        // Render list name as directly editable input and remove button using mustache
        const titleElem = document.getElementById('form-title');
        const currentList = this.collection.lists[this.selectedIndex];
        if (titleElem && currentList) {
            titleElem.innerHTML = mustache.render(ListApp.TITLE_TEMPLATE, { listName: currentList.listName });
            // Directly editable input logic
            const input = document.getElementById('list-name-display');
            const errorDiv = document.getElementById('list-name-edit-error');
            if (input) {
                input.onblur = input.onchange = input.onkeydown = (e) => {
                    if (e.type === 'blur' || e.type === 'change' || (e.type === 'keydown' && e.key === 'Enter')) {
                        const newName = input.value.trim();
                        const errorMsg = TodoCollection.validateListName(newName, this.collection.lists, currentList.listName);
                        if (errorMsg) {
                            input.setAttribute('aria-invalid', 'true');
                        } else {
                            input.setAttribute('aria-invalid', 'false');
                        }
                        errorDiv.textContent = errorMsg;
                        if (!errorMsg && newName !== currentList.listName) {
                            currentList.listName = newName;
                            saveToLocalStorage(this.collection, this.selectedIndex);
                            this.render();
                            if (this.onListSelect) this.onListSelect(this.selectedIndex);
                        }
                    }
                };
            }
            // Remove button logic
            const removeBtn = document.getElementById('remove-list-btn');
            if (removeBtn) {
                removeBtn.onclick = () => {
                    if (this.collection.lists.length === 0) return;
                    if (confirm(`Are you sure you want to remove the list "${currentList.listName}"? This cannot be undone.`)) {
                        this.collection.removeList(this.selectedIndex);
                        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
                        saveToLocalStorage(this.collection, this.selectedIndex);
                        this.render();
                        if (this.onListSelect) this.onListSelect(this.selectedIndex);
                    }
                };
            }
        } else if (titleElem) {
            titleElem.textContent = 'Todos:';
        }
    }

    getSelectedList() {
        return this.collection.getList(this.selectedIndex);
    }
}
