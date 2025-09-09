import { TodoList } from './todoList.js';

export default class TodoCollection {
    constructor() {
        this.lists = [];
    }
    addList(newName) {
        //TODO input validation as well.

        // Only Unicode letters and numbers, max 60 chars.
        //  By spec, spaces are not allowed? 
        // TODO: check with task assigner
        const validName = typeof newName === 'string' &&
            newName.length > 0 &&
            newName.length <= 60 &&
            /^[\p{L}\p{N}]+$/u.test(newName);


        // Check for duplicate names
        const duplicate = this.lists.some(({listName}) => listName === newName);

        //TODO return error message or throw exception
        if (!validName || duplicate) {
            return false;
        }

        const list = new TodoList(newName);
        this.lists.push(list);
        return true;
    }
    removeList(index) {
        if (index >= 0 && index < this.lists.length) {
            this.lists.splice(index, 1);
        }
    }
    getList(index) {
        if (index >= 0 && index < this.lists.length) {
            return this.lists[index];
        }
        return null;
    }
}