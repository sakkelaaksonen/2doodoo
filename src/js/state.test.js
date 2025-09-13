import { validateListName, STATUS_TODO, STATUS_DOING, STATUS_DONE } from './state.js';


import QUnit from "qunit";
import { state } from './state.js';
import { subscribe } from 'valtio/vanilla';


QUnit.module('state.js', hooks => {
	QUnit.test('getSelectedListItemCount returns correct count', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.selected = listId;
		assert.equal(state.getSelectedListItemCount(), 0, 'Count is 0 for empty list');
		state.addItem(listId, 'Milk');
		assert.equal(state.getSelectedListItemCount(), 1, 'Count is 1 after adding one item');
		state.addItem(listId, 'Bread');
		assert.equal(state.getSelectedListItemCount(), 2, 'Count is 2 after adding two items');
		// Remove one item
		const itemId = state.lists[0].items[0].id;
		state.removeItem(listId, itemId);
		assert.equal(state.getSelectedListItemCount(), 1, 'Count is 1 after removing one item');
	});
	QUnit.test('setItemStatus sets todo status', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.addItem(listId, 'Milk');
		const itemId = state.lists[0].items[0].id;
		state.setItemStatus(listId, itemId, STATUS_TODO);
		assert.equal(state.lists[0].items[0].status, STATUS_TODO, 'Item status set to todo');
	});

	QUnit.test('setItemStatus sets doing status', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.addItem(listId, 'Milk');
		const itemId = state.lists[0].items[0].id;
		state.setItemStatus(listId, itemId, STATUS_DOING);
		assert.equal(state.lists[0].items[0].status, STATUS_DOING, 'Item status set to doing');
	});

	QUnit.test('setItemStatus sets done status', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.addItem(listId, 'Milk');
		const itemId = state.lists[0].items[0].id;
		state.setItemStatus(listId, itemId, STATUS_DONE);
		assert.equal(state.lists[0].items[0].status, STATUS_DONE, 'Item status set to done');
	});
	QUnit.test('validateListName returns empty string for valid name', assert => {
		const lists = [{ name: 'Groceries' }];
		assert.equal(validateListName('New List', lists), '', 'Valid name returns empty string');
	});

	QUnit.test('validateListName returns error for empty name', assert => {
		assert.ok(validateListName('', []), 'Empty name returns error');
	});

	QUnit.test('validateListName returns error for invalid characters', assert => {
		assert.ok(validateListName('List@123', []), 'Invalid characters return error');
	});

	QUnit.test('validateListName returns error for long name', assert => {
		const longName = 'A'.repeat(61);
		assert.ok(validateListName(longName, []), 'Long name returns error');
	});

	QUnit.test('validateListName returns error for duplicate name', assert => {
		const lists = [{ name: 'Groceries' }];
		assert.ok(validateListName('Groceries', lists), 'Duplicate name returns error');
	});

   hooks.beforeEach(() => {
    // Clear lists and set to initial values
    state.lists.splice(0, state.lists.length);
    state.selected = null;
    state.filter = 'all';
  });

  QUnit.test('initial state is correct', assert => {
		assert.deepEqual(state.lists, [], 'Initial lists should be empty');
		assert.equal(state.selected, null, 'Initial selected should be null');
		assert.equal(state.filter, 'all', 'Initial filter should be all');
	});

	QUnit.test('reset sets sample data', assert => {
		state.reset();
		assert.ok(Array.isArray(state.lists), 'Lists is array after reset');
		assert.equal(state.lists.length, 1, 'Sample data has one list');
		assert.equal(state.lists[0].name, 'Sample List', 'Sample list name is correct');
		assert.equal(state.filter, 'all', 'Filter reset to all');
		assert.equal(state.selected, '1aaa', 'Selected reset to null');
	});

	QUnit.test('addItem adds an item to a list', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.addItem(listId, 'Milk');
		assert.equal(state.lists[0].items.length, 1, 'Item added');
		assert.equal(state.lists[0].items[0].desc, 'Milk', 'Item description is correct');
			assert.equal(state.lists[0].items[0].status, STATUS_TODO, 'Item status is todo');
		assert.ok(state.lists[0].items[0].id, 'Item has an id');
	});

	QUnit.test('setItemStatus changes item status', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.addItem(listId, 'Milk');
		const itemId = state.lists[0].items[0].id;
			state.setItemStatus(listId, itemId, STATUS_DONE);
			assert.equal(state.lists[0].items[0].status, STATUS_DONE, 'Item status updated');
	});

	QUnit.test('editItem changes item description', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.addItem(listId, 'Milk');
		const itemId = state.lists[0].items[0].id;
		state.editItem(listId, itemId, 'Oat Milk');
		assert.equal(state.lists[0].items[0].desc, 'Oat Milk', 'Item description updated');
	});

	QUnit.test('removeItem removes an item from a list', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.addItem(listId, 'Milk');
		const itemId = state.lists[0].items[0].id;
		state.removeItem(listId, itemId);
		assert.equal(state.lists[0].items.length, 0, 'Item removed');
	});




	QUnit.test('addList adds a new list', assert => {
		state.addList('Groceries');
		assert.equal(state.lists.length, 1, 'List added');
		assert.equal(state.lists[0].name, 'Groceries', 'List name is correct');
		assert.deepEqual(state.lists[0].items, [], 'List items is empty array');
		assert.ok(state.lists[0].id, 'List has an id');
	});

	QUnit.test('removeList removes a list', assert => {
		state.addList('Groceries');
		const listId = state.lists[0].id;
		state.removeList(listId);
		assert.equal(state.lists.length, 0, 'List removed');
	});



  QUnit.test('Valtio subscription propagates state changes', assert => {
			const done = assert.async();
			let called = false;
			const unsub = subscribe(state, () => {
				called = true;
			});
			state.addItem = 'active';
			setTimeout(() => {
				assert.ok(called, 'Subscription callback was called on state change');
				unsub();
				done();
			}, 10);
	});

});




