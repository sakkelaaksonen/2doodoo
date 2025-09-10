
import TodoCollection from "./todoCollection.js";

export default function TodoCollectionTests() {
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


}
