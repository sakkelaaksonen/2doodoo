import Qunit from 'qunit';
import { TodoCollection } from './todoCollection.js';

Qunit.module('TodoCollection', function() {
    Qunit.test('constructor initializes lists array', function(assert) {
        const collection = new TodoCollection();
        assert.deepEqual(collection.lists, [], 'Lists array is initialized empty');
    });

    Qunit.test('addList adds a new TodoList', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List 1');
        assert.equal(collection.lists.length, 1, 'List added');
        assert.equal(collection.lists[0].name, 'List 1', 'List name is correct');
    });

    Qunit.test('removeList removes list at valid index', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List 1');
        collection.addList('List 2');
        collection.removeList(0);
        assert.equal(collection.lists.length, 1, 'List removed');
        assert.equal(collection.lists[0].name, 'List 2', 'Correct list remains');
    });

    Qunit.test('removeList does nothing for invalid index', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List 1');
        collection.removeList(5);
        assert.equal(collection.lists.length, 1, 'No list removed for invalid index');
    });

    Qunit.test('getList returns list at valid index', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List 1');
        const list = collection.getList(0);
        assert.ok(list, 'List returned');
        assert.equal(list.name, 'List 1', 'Correct list returned');
    });

    Qunit.test('getList returns null for invalid index', function(assert) {
        const collection = new TodoCollection();
        collection.addList('List 1');
        const list = collection.getList(5);
        assert.equal(list, null, 'Null returned for invalid index');
    });   
 });