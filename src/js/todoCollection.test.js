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

    QUnit.test('list name must only contain Unicode letters, numbers, and spaces and be at most 60 characters', function(assert) {
        const collection = new TodoCollection();
        // Valid names
        assert.ok(collection.addList('List123'), 'Valid name: letters and numbers');
        assert.ok(collection.addList('ÄäÖö123'), 'Valid name: Unicode letters');
        assert.ok(collection.addList('List With Spaces'), 'Valid name: contains spaces');
        // Invalid names
        assert.throws(() => collection.addList('List!@#'), /List name must only contain letters, numbers, and spaces/, 'Invalid name: contains symbols throws error');
        assert.throws(() => collection.addList('A'.repeat(61)), /List name must be at most 60 characters/, 'Invalid name: too long throws error');
    });

    QUnit.test('cannot add two lists with the same name', function(assert) {
        const collection = new TodoCollection();
        assert.ok(collection.addList('UniqueName'), 'First list added');
        assert.throws(() => collection.addList('UniqueName'), /already exists/, 'Duplicate list name throws error');
    });

    QUnit.test('validateListName returns correct error messages and passes valid names', function(assert) {
        const lists = [ { listName: 'List1' }, { listName: 'ÄäÖö123' } ];
        // Valid names
        assert.equal(TodoCollection.validateListName('NewList', lists), '', 'Valid name: NewList');
        assert.equal(TodoCollection.validateListName('ÄäÖö123', lists, 'ÄäÖö123'), '', 'Valid name: unchanged name allowed');
        // Invalid: empty and whitespace
        assert.equal(TodoCollection.validateListName('', lists), 'List name is required.', 'Empty name');
        assert.equal(TodoCollection.validateListName('   ', lists), 'List name is required.', 'Whitespace only name');
        // Invalid: symbols
        assert.equal(TodoCollection.validateListName('List!@#', lists), 'List name must only contain letters, numbers, and spaces.', 'Symbols not allowed');
        // Invalid: too long
        assert.equal(TodoCollection.validateListName('A'.repeat(61), lists), 'List name must be at most 60 characters.', 'Too long');
        // Invalid: duplicate
        assert.equal(TodoCollection.validateListName('List1', lists), 'A list with this name already exists.', 'Duplicate name');
    });
 });


}
