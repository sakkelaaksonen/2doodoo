import { TodoList } from './todoList.js';

export default class TodoCollection {
    constructor() {
        this.lists = [];
    }
    addList(name) {
        const list = new TodoList(name);
        this.lists.push(list);
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