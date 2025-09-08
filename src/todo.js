class TodoItem {
    constructor(text) {
        this.text = text;
        this.status = TodoList.STATUS_TODO;
    }
}

class TodoList {

    static STATUS_TODO = 'todo';
    static STATUS_DOING = 'doing';
    static STATUS_DONE = 'done';    

    static VALID_STATUSES = [
        TodoList.STATUS_TODO,
        TodoList.STATUS_DOING,
        TodoList.STATUS_DONE
    ];

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
      
        if (
            index >= 0 &&
            index < this.items.length &&
            TodoList.VALID_STATUSES.includes(status)
        ) {
            this.items[index].status = status;
        }
    }
}

export { TodoItem, TodoList };