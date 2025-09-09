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

    static CHANGE_EVENT = 'item-changed';

    constructor(listName) {
        this.listName = listName;
        this.items = [];
        this._eventTarget = document.createElement('span');
    }
    addItem(desc) {
        const item = new TodoItem(desc);
        this.items.push(item);
        this._dispatchChange('add', { desc });
    }
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this._dispatchChange('remove', { index });
        }
    }
    setItemStatus(index, status) {
        if (
            index >= 0 &&
            index < this.items.length &&
            TodoList.VALID_STATUSES.includes(status)
        ) {
            this.items[index].status = status;
            this._dispatchChange('status', { index, status });
        }
    }
    editItem(index, newDesc) {
        if (index >= 0 && index < this.items.length && typeof newDesc === 'string' && newDesc.length > 0) {
            this.items[index].desc = newDesc;
            this._dispatchChange('edit', { index, newDesc });
        } else {
          console.error('Invalid index or description for editItem');
        }
    }
    getTemplateData() {
        const items =  this.items.map(({desc,status},index) => ({
            desc,
            todo: status === TodoList.STATUS_TODO,
            doing: status === TodoList.STATUS_DOING,
            done: status === TodoList.STATUS_DONE,
            index
        }));
        return {items}
    }
    addEventListener(...args) {
        this._eventTarget.addEventListener(...args);
    }
    removeEventListener(...args) {
        this._eventTarget.removeEventListener(...args);
    }
    _dispatchChange(type, detail) {
        this._eventTarget.dispatchEvent(new CustomEvent(TodoList.CHANGE_EVENT, {
            detail: { type, ...detail },
            bubbles: false
        }));
    }
}

export { TodoItem, TodoList };