import { TodoItem, TodoList } from "./todoList.js";
export default function TodoCollectionTests() {

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

    QUnit.test('getTemplateData returns correct template data', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task 1');
        list.addItem('Task 2');
        list.setItemStatus(0, 'doing');
        list.setItemStatus(1, 'done');
        const data = list.getTemplateData();
        assert.deepEqual(data,{items: [
            { desc: 'Task 1', todo: false, doing: true, done: false ,index:0},
            { desc: 'Task 2', todo: false, doing: false, done: true, index:1}
        ]}, 'getTemplateData returns correct status flags for each item');
    });

    QUnit.test('editItem updates item description for valid index and non-empty string', function(assert) {
        const list = new TodoList('List');
        list.addItem('Old Task');
        list.editItem(0, 'New Task');
        assert.equal(list.items[0].desc, 'New Task', 'Item description updated');
    });

    QUnit.test('editItem does nothing for invalid index', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task');
        list.editItem(5, 'New Task');
        assert.equal(list.items[0].desc, 'Task', 'Description unchanged for invalid index');
    });

    QUnit.test('editItem does nothing for empty string', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task');
        list.editItem(0, '');
        assert.equal(list.items[0].desc, 'Task', 'Description unchanged for empty string');
    });

    QUnit.test('editItem does nothing for non-string description', function(assert) {
        const list = new TodoList('List');
        list.addItem('Task');
        list.editItem(0, 12345);
        assert.equal(list.items[0].desc, 'Task', 'Description unchanged for non-string description');
    });
});
}
