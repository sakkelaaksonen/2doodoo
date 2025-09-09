import { TodoList } from './todoList.js';

// Global mustache added in index.html
export default class TodoCollection {
    constructor() {
        this.lists = [];
    }
    addList(newName) {
        //TODO input validation as well.

        // Only Unicode letters and numbers, max 60 chars.
        //  By spec, spaces are not allowed? 
        // TODO: check with task assigner
        console.error('TODO allow white spaces')
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

        this.lists.push(list);
        console.log(this.lists,'listss')
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