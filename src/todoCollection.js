import { TodoList } from './todoList.js';

/**
 * Manages a collection of TodoList instances and dispatches custom events on changes.
 * @class
 */
export default class TodoCollection {
    /**
     * The custom event name for collection changes.
     * @type {string}
     */
    static CHANGE_EVENT = 'list-changed';

    /**
     * Creates a new TodoCollection.
     */
    constructor() {
        /**
         * Array of TodoList instances.
         * @type {TodoList[]}
         */
        this.lists = [];
        /**
         * Internal event target for custom event dispatching.
         * @type {EventTarget}
         * @private
         */
        this._eventTarget = document.createElement('span');
    }

    /**
     * Serializes the collection to a JSON string.
     * @returns {string} JSON representation of the collection.
     */
    stringify() {
      return JSON.stringify({lists: this.lists});
    }

    /**
     * Adds a new TodoList to the collection.
     * @param {string} newName - The name of the new list.
     * @throws {Error} If the name is invalid or already exists.
     * @returns {boolean} True if the list was added.
     */
    addList(newName) {
        // Only Unicode letters, numbers, and spaces, max 60 chars.
        const validName = typeof newName === 'string' &&
            newName.length > 0 &&
            newName.length <= 60 &&
            /^[\p{L}\p{N}\s]+$/u.test(newName);

        // Check for duplicate names
        const duplicate = this.lists.some(({listName}) => listName === newName);

        if(!validName) {
            throw new Error('List name must only contain Unicode letters, numbers, and spaces and be at most 60 characters long.');
        }
        if(duplicate) {
            throw new Error('A list with this name already exists.');
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
     * Adds an event listener for collection changes.
     * @param {string} type - The event type.
     * @param {Function} listener - The event handler.
     * @param {Object|boolean} [options] - Optional options.
     */
    addEventListener(...args) {
        this._eventTarget.addEventListener(...args);
    }

    /**
     * Removes an event listener for collection changes.
     * @param {string} type - The event type.
     * @param {Function} listener - The event handler.
     * @param {Object|boolean} [options] - Optional options.
     */
    removeEventListener(...args) {
        //Not needed atm but keeping for symmetry
        this._eventTarget.removeEventListener(...args);
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
