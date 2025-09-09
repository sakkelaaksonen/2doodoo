import { TodoList } from './todoList.js';

// Global mustache added in index.html
export default class TodoCollection {
    static CHANGE_EVENT = 'list-changed';
    constructor() {
        this.lists = [];
        this._eventTarget = document.createElement('span');
    }
    addList(newName) {
        // Only Unicode letters and numbers, max 60 chars.
        const validName = typeof newName === 'string' &&
            newName.length > 0 &&
            newName.length <= 60 &&
            /^[\p{L}\p{N}]+$/u.test(newName);

        // Check for duplicate names
        const duplicate = this.lists.some(({listName}) => listName === newName);

        if(!validName) {
            throw new Error('List name must only contain Unicode letters and numbers and be at most 60 characters long.');
        }
        if(duplicate) {
            throw new Error('A list with this name already exists.');
        }

        const list = new TodoList(newName);
        // Listen for item changes and bubble up
        list.addEventListener(TodoList.CHANGE_EVENT, (e) => {
            this._dispatchChange('item', { listName: newName, item: e.detail });
        });
        this.lists.push(list);
        this._dispatchChange('add', { listName: newName });
        return true;
    }
    removeList(index) {
        if (index >= 0 && index < this.lists.length) {
            const removed = this.lists.splice(index, 1);
            this._dispatchChange('remove', { index, listName: removed[0]?.listName });
        }
    }
    getList(index) {
        if (index >= 0 && index < this.lists.length) {
            return this.lists[index];
        }
        return null;
    }
    addEventListener(...args) {
        this._eventTarget.addEventListener(...args);
    }
    removeEventListener(...args) {
        this._eventTarget.removeEventListener(...args);
    }
    _dispatchChange(type, detail) {
        this._eventTarget.dispatchEvent(new CustomEvent(TodoCollection.CHANGE_EVENT, {
            detail: { type, ...detail },
            bubbles: false
        }));
    }
}