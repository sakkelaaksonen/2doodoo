import { proxy } from 'valtio/vanilla';
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
        // Valtio proxy for lists array
        this.state = proxy({
            lists: []
        });
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
        const errorMsg = TodoCollection.validateListName(newName, this.state.lists);
        if (errorMsg) {
            throw new Error(errorMsg);
        }
        const list = new TodoList(newName);
        this.state.lists.push(list);
        return true;
    }

    /**
     * Removes a TodoList from the collection by index.
     * @param {number} index - The index of the list to remove.
     */
    removeList(index) {
        if (index >= 0 && index < this.state.lists.length) {
            const removed = this.state.lists.splice(index, 1);
        }
    }

    /**
     * Gets a TodoList by index.
     * @param {number} index - The index of the list.
     * @returns {TodoList|null} The TodoList instance or null if not found.
     */
    getList(index) {
        if (index >= 0 && index < this.state.lists.length) {
            return this.state.lists[index];
        }
        return null;
    }

}
