import EventBase from "./EventBase.js";
class TodoItem {
    constructor(desc) {
        this.desc = desc;
        this.status = TodoList.STATUS_TODO;
    }
}

class TodoList extends EventBase {
    static STATUS_TODO = 'todo';
    static STATUS_DOING = 'doing';
    static STATUS_DONE = 'done';    

    static VALID_STATUSES = [
        TodoList.STATUS_TODO,
        TodoList.STATUS_DOING,
        TodoList.STATUS_DONE
    ];

    static CHANGE_EVENT = 'item-changed';
    static isValidStatus(status) {
      return TodoList.VALID_STATUSES.includes(status);
    }
    constructor(listName) {
        super();
        this.listName = listName;
        this.items = [];
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
            TodoList.isValidStatus(status)
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
          // silent error for now
          // console.error('Invalid index or description for editItem');
        }
    }
    getTemplateData() {
        const items =  this.items.map(({desc,status},index) => ({
            desc,
            status,
            todo: status === TodoList.STATUS_TODO,
            doing: status === TodoList.STATUS_DOING,
            done: status === TodoList.STATUS_DONE,
            index
        }));
        return {items}
    }
  
    _dispatchChange(type, detail) {
        this._eventTarget.dispatchEvent(new CustomEvent(TodoList.CHANGE_EVENT, {
            detail: { type, ...detail },
            bubbles: false
        }));
    }
}

export { TodoItem, TodoList };
