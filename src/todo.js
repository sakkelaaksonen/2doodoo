class TodoItem {
    constructor(text) {
        this.text = text;
        this.status = 'todo'; // 'todo', 'doing', 'done'
    }
}

class TodoList {
    constructor(name) {
        this.name = name;
        this.items = [];
    }
    addItem(text) {
        const item = new TodoItem(text);
        this.items.push(item);
    }
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
    }
    setItemStatus(index, status) {
        const validStatuses = ['todo', 'doing', 'done'];
        if (
            index >= 0 &&
            index < this.items.length &&
            validStatuses.includes(status)
        ) {
            this.items[index].status = status;
        }
    }
}

export { TodoItem, TodoList };