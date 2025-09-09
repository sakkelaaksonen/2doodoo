class TodoItem {
    constructor(desc) {
        this.desc = desc;
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

    constructor(listName) {
        this.listName = listName;
        this.items = [];
    }
    addItem(desc) {
        const item = new TodoItem(desc);
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