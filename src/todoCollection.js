import { TodoList } from './todoList.js';
import EventBase from './EventBase.js';
/**
 * Manages a collection of TodoList instances and dispatches custom events on changes.
 * @class
 */
export default class TodoCollection extends EventBase {
    /**
     * The custom event name for collection changes.
     * @type {string}
     */
    static CHANGE_EVENT = 'list-changed';

    /**
     * Creates a new TodoCollection.
     */
    constructor() {
      super();
        /**
         * Array of TodoList instances.
         * @type {TodoList[]}
         */
        this.lists = [];

    }

    /**
     * Serializes the collection to a JSON string.
     * @returns {string} JSON representation of the collection.
     */
    stringify() {
      return JSON.stringify({lists: this.lists});
    }

    /**
     * Validates a list name and returns an error message if invalid, or empty string if valid.
     * @param {string} name - The list name to validate.
     * @param {TodoList[]} lists - The array of lists to check for duplicates.
     * @param {string} [currentName] - The current name (for edit, to allow unchanged name).
     * @returns {string} Error message if invalid, or empty string if valid.
     */
    static validateListName(name, lists, currentName = undefined) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return 'List name is required.';
        }
        if (!/^[\p{L}\p{N}\s]+$/u.test(name)) {
            return 'List name must only contain letters, numbers, and spaces.';
        }
        if (name.length > 60) {
            return 'List name must be at most 60 characters.';
        }
        if (lists.some(list => list.listName === name && name !== currentName)) {
            return 'A list with this name already exists.';
        }
        return '';
    }

    /**
     * Adds a new TodoList to the collection.
     * @param {string} newName - The name of the new list.
     * @throws {Error} If the name is invalid or already exists.
     * @returns {boolean} True if the list was added.
     */
    addList(newName) {
        const errorMsg = TodoCollection.validateListName(newName, this.lists);
        if (errorMsg) {
            throw new Error(errorMsg);
        }
        const list = new TodoList(newName);
        // Listen for item changes and bubble up
        list.addEventListener(TodoList.CHANGE_EVENT, (e) => {
            console.log('Item changed in list', newName, e.detail);
            this._dispatchChange('item', { listName: newName, item: e.detail });
        });
        this.lists.push(list);
        this._dispatchChange('add', { listName: newName });
        return true;
    }

    /**
     * Removes a TodoList from the collection by index.
     * @param {number} index - The index of the list to remove.
     */
    removeList(index) {
        if (index >= 0 && index < this.lists.length) {
            const removed = this.lists.splice(index, 1);
            this._dispatchChange('remove', { index, listName: removed[0]?.listName });
        }
    }

    /**
     * Gets a TodoList by index.
     * @param {number} index - The index of the list.
     * @returns {TodoList|null} The TodoList instance or null if not found.
     */
    getList(index) {
        if (index >= 0 && index < this.lists.length) {
            return this.lists[index];
        }
        return null;
    }

  

    /**
     * Dispatches a custom change event.
     * @param {string} type - The type of change ('add', 'remove', 'item').
     * @param {Object} detail - Additional event details.
     * @private
     */
    _dispatchChange(type, detail) {
        this._eventTarget.dispatchEvent(new CustomEvent(TodoCollection.CHANGE_EVENT, {
            detail: { type, ...detail },
            bubbles: false
        }));
    }
}
