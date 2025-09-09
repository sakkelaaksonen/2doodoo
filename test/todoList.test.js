import QUnit from 'qunit';
import { TodoItem, TodoList } from '../assets/todoList.js';

QUnit.module('TodoItem', function() {
    QUnit.test('constructor sets text and default status', function(assert) {
        const item = new TodoItem('Test task');
        assert.equal(item.desc, 'Test task', 'Text is set correctly');
        assert.equal(item.status, 'todo', 'Default status is todo');
    });
});

QUnit.module('TodoList', function() {
    QUnit.test('constructor sets name and initializes items', function(assert) {
        const list = new TodoList('My List');
        assert.equal(list.listName, 'My List', 'Name is set correctly');
        assert.deepEqual(list.items, [], 'Items array is initialized empty');
    });

    QUnit.test('addItem adds a new TodoItem', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task 1');
        assert.equal(list.items.length, 1, 'Item added');
        assert.equal(list.items[0].desc, 'Task 1', 'Item text is correct');
    });

    QUnit.test('removeItem removes item at valid index', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task 1');
        list.addItem('Task 2');
        list.removeItem(0);
        assert.equal(list.items.length, 1, 'Item removed');
        assert.equal(list.items[0].desc, 'Task 2', 'Correct item remains');
    });

    QUnit.test('removeItem does nothing for invalid index', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task 1');
        list.removeItem(5);
        assert.equal(list.items.length, 1, 'No item removed for invalid index');
    });

    QUnit.test('setItemStatus sets status for valid index and status', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task 1');
        list.setItemStatus(0, 'doing');
        assert.equal(list.items[0].status, 'doing', 'Status updated');
    });

    QUnit.test('setItemStatus does nothing for invalid index', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task 1');
        list.setItemStatus(5, 'done');
        assert.equal(list.items[0].status, 'todo', 'Status unchanged for invalid index');
    });

    QUnit.test('setItemStatus does nothing for invalid status', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task 1');
        list.setItemStatus(0, 'invalid');
        assert.equal(list.items[0].status, 'todo', 'Status unchanged for invalid status');
    });

    
});