import { loadFromLocalStorage, saveToLocalStorage } from './storage.js';
import TodoCollection from './todoCollection.js';

/**
 * ListApp manages todo lists: creation, selection, and rendering the list selector.
 */
export default class ListApp {
    constructor({ onListSelect }) {
        // Load from localStorage if available
        this.collection = loadFromLocalStorage(TodoCollection);
        this.selectedIndex = 0;
        this.onListSelect = onListSelect;
        this.setupEventListeners();
        this.render();
        // Save to localStorage on page unload
        window.addEventListener('beforeunload', () => saveToLocalStorage(this.collection));
    }

    setupEventListeners() {
        const listForm = document.getElementById('new-list-form');
        const input = document.getElementById('list-name-input');
        const errorDiv = document.getElementById('list-name-error');
        if (listForm && input && errorDiv) {
            listForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const value = input.value.trim();
                let errorMsg = '';
                if (!value) {
                    errorMsg = 'List name is required.';
                } else if (!/^[\p{L}\p{N}\s]+$/u.test(value)) {
                    errorMsg = 'List name must only contain letters, numbers, and spaces.';
                } else if (value.length > 60) {
                    errorMsg = 'List name must be at most 60 characters.';
                } else if (this.collection.lists.some(list => list.listName === value)) {
                    errorMsg = 'A list with this name already exists.';
                }
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
                    saveToLocalStorage(this.collection);
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
                saveToLocalStorage(this.collection);
                if (this.onListSelect) this.onListSelect(this.selectedIndex);
            });
        }
    }

    render() {
        const selector = document.getElementById('todo-list-selector');
        selector.innerHTML = this.collection.lists.map((list, i) =>
            `<option value="${i}" ${i === this.selectedIndex ? 'selected' : ''}>${list.listName}</option>`
        ).join('');
        document.getElementById('form-title').textContent = `Todos: ${this.collection.lists[this.selectedIndex]?.listName || ''}`;
    }

    getSelectedList() {
        return this.collection.getList(this.selectedIndex);
    }
}
