
import TodoCollection  from './todoCollection.js';
import { TodoList, TodoItem } from './todoList.js';

console.log('running qunit test', TodoCollection);

QUnit.module('TodoCollection', function() {
    QUnit.test('constructor initializes lists array', function(assert) {
        const collection = new TodoCollection();
        assert.deepEqual(collection.lists, [], 'Lists array is initialized empty');
    });

    QUnit.test('addList adds a new TodoList', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List1');
        assert.equal(collection.lists.length, 1, 'List added');
        assert.equal(collection.lists[0].listName, 'List1', 'List name is correct');
    });

    QUnit.test('removeList removes list at valid index', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List1');
        collection.addList('List2');
        collection.removeList(0);
        assert.equal(collection.lists.length, 1, 'List removed');
        assert.equal(collection.lists[0].listName, 'List2', 'Correct list remains');
    });

    QUnit.test('removeList does nothing for invalid index', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List1');
        collection.removeList(5);
        assert.equal(collection.lists.length, 1, 'No list removed for invalid index');
    });

    QUnit.test('getList returns list at valid index', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List1');
        const list = collection.getList(0);
        assert.ok(list, 'List returned');
        assert.equal(list.listName, 'List1', 'Correct list returned');
    });

    QUnit.test('getList returns null for invalid index', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List1');
        const list = collection.getList(5);
        assert.equal(list, null, 'Null returned for invalid index');
    });

    QUnit.test('list name must only contain Unicode letters and numbers and be at most 60 characters', function(assert) {
        const collection = new TodoCollection();
        // Valid names
        assert.ok(collection.addList('List123'), 'Valid name: letters and numbers');
        assert.ok(collection.addList('ÄäÖö123'), 'Valid name: Unicode letters');
        // Invalid names
        assert.throws(() => collection.addList('List!@#'), /must only contain Unicode letters and numbers/, 'Invalid name: contains symbols throws error');
        assert.throws(() => collection.addList('List With Spaces'), /must only contain Unicode letters and numbers/, 'Invalid name: contains spaces throws error');
        assert.throws(() => collection.addList('A'.repeat(61)), /must only contain Unicode letters and numbers/, 'Invalid name: too long throws error');
    });

    QUnit.test('cannot add two lists with the same name', function(assert) {
        const collection = new TodoCollection();
        assert.ok(collection.addList('UniqueName'), 'First list added');
        assert.throws(() => collection.addList('UniqueName'), /already exists/, 'Duplicate list name throws error');
    });
 });


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
