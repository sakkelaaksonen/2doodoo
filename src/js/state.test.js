import {
  validateListName,
  STATUS_TODO,
  STATUS_DOING,
  STATUS_DONE,
} from "./state.js";
import QUnit from "qunit";
import { state, saveState, loadState } from "./state.js";
import { subscribe } from "valtio/vanilla";

export default function () {
  QUnit.module("state.js", (hooks) => {
    QUnit.test(
      "initFromStorage loads from localStorage or falls back to sample data",
      (assert) => {
        // Case 1: localStorage contains valid state
        localStorage.removeItem("2doodoo-state");
        const testState = {
          lists: [
            {
              id: "testid",
              name: "Test List",
              items: [{ id: "itemid", desc: "Test Item", status: STATUS_TODO }],
            },
          ],
          selected: "testid",
          filter: "all",
        };
        localStorage.setItem("2doodoo-state", JSON.stringify(testState));
        state.initFromStorage();
        assert.equal(state.lists.length, 1, "Loaded lists length matches");
        assert.equal(
          state.lists[0].name,
          "Test List",
          "Loaded list name matches"
        );
        assert.equal(
          state.lists[0].items[0].desc,
          "Test Item",
          "Loaded item description matches"
        );
        assert.equal(state.selected, "testid", "Loaded selected matches");
        assert.equal(state.filter, "all", "Loaded filter matches");

        // Case 2: localStorage is empty, should fallback to sample data
        localStorage.removeItem("2doodoo-state");
        state.initFromStorage();
        assert.equal(state.lists.length, 1, "Sample data has one list");
        assert.equal(
          state.lists[0].name,
          "Sample List",
          "Sample list name is correct"
        );
        assert.equal(
          state.selected,
          "1aaa",
          "Selected is set to sample list id"
        );
        assert.equal(state.filter, "all", "Filter is set to all");
      }
    );

    QUnit.test("saveState persists mutated state to localStorage", (assert) => {
      localStorage.removeItem("2doodoo-state");
      state.reset();
      state.addList("Groceries");
      state.addItem(state.lists[1].id, "Milk");
      state.selected = state.lists[1].id;
      saveState(state);
      const raw = localStorage.getItem("2doodoo-state");
      assert.ok(raw, "Raw state is saved to localStorage");
      const parsed = JSON.parse(raw);
      assert.equal(parsed.lists.length, 2, "Saved lists length matches");
      assert.equal(
        parsed.lists[1].name,
        "Groceries",
        "Saved list name matches"
      );
      assert.equal(
        parsed.lists[1].items[0].desc,
        "Milk",
        "Saved item description matches"
      );
      assert.equal(
        parsed.selected,
        state.lists[1].id,
        "Saved selected matches"
      );
    });

    QUnit.test("loadState loads mutated state from localStorage", (assert) => {
      localStorage.removeItem("2doodoo-state");
      // Save a known mutated state
      const testState = {
        lists: [
          { id: "1aaa", name: "Sample List", items: [] },
          {
            id: "g1",
            name: "Groceries",
            items: [{ id: "i1", desc: "Milk", status: STATUS_TODO }],
          },
        ],
        selected: "g1",
        filter: "all",
      };
      localStorage.setItem("2doodoo-state", JSON.stringify(testState));
      const loaded = loadState();
      assert.ok(loaded, "Loaded state is not null");
      assert.equal(loaded.lists.length, 2, "Loaded lists length matches");
      assert.equal(
        loaded.lists[1].name,
        "Groceries",
        "Loaded list name matches"
      );
      assert.equal(
        loaded.lists[1].items[0].desc,
        "Milk",
        "Loaded item description matches"
      );
      assert.equal(loaded.selected, "g1", "Loaded selected matches");
    });
    QUnit.test("getListById returns correct sample list", (assert) => {
      state.reset();
      const sampleList = state.lists[0];
      const list = state.getListById(sampleList.id);
      assert.ok(list, "List found by id");
      assert.equal(list.id, "1aaa", "Returned list has correct id");
      assert.equal(list.name, "Sample List", "Returned list has correct name");
    });

    QUnit.test("getCurrentList returns sample selected list", (assert) => {
      state.reset();
      state.selected = "1aaa";
      const currentList = state.getCurrentList();
      assert.ok(currentList, "Current list found");
      assert.equal(currentList.id, "1aaa", "Current list id matches sample");
      assert.equal(
        currentList.name,
        "Sample List",
        "Current list name matches sample"
      );
    });

    QUnit.test("getItemById returns correct sample item", (assert) => {
      state.reset();
      const sampleList = state.lists[0];
      const sampleItem = sampleList.items[0];
      const item = state.getItemById(sampleList, sampleItem.id);
      assert.ok(item, "Item found by id");
      assert.equal(item.id, "1abc", "Returned item has correct id");
      assert.equal(
        item.desc,
        "Sample Task 1",
        "Returned item has correct description"
      );
      assert.equal(
        item.status,
        STATUS_TODO,
        "Returned item has correct status"
      );
    });
    QUnit.test("getSelectedListItemCount returns correct count", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.selected = listId;
      assert.equal(
        state.getSelectedListItemCount(),
        0,
        "Count is 0 for empty list"
      );
      state.addItem(listId, "Milk");
      assert.equal(
        state.getSelectedListItemCount(),
        1,
        "Count is 1 after adding one item"
      );
      state.addItem(listId, "Bread");
      assert.equal(
        state.getSelectedListItemCount(),
        2,
        "Count is 2 after adding two items"
      );
      // Remove one item
      const itemId = state.lists[0].items[0].id;
      state.removeItem(listId, itemId);
      assert.equal(
        state.getSelectedListItemCount(),
        1,
        "Count is 1 after removing one item"
      );
    });
    QUnit.test("setItemStatus sets todo status", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.addItem(listId, "Milk");
      const itemId = state.lists[0].items[0].id;
      state.setItemStatus(listId, itemId, STATUS_TODO);
      assert.equal(
        state.lists[0].items[0].status,
        STATUS_TODO,
        "Item status set to todo"
      );
    });

    QUnit.test("setItemStatus sets doing status", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.addItem(listId, "Milk");
      const itemId = state.lists[0].items[0].id;
      state.setItemStatus(listId, itemId, STATUS_DOING);
      assert.equal(
        state.lists[0].items[0].status,
        STATUS_DOING,
        "Item status set to doing"
      );
    });

    QUnit.test("setItemStatus sets done status", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.addItem(listId, "Milk");
      const itemId = state.lists[0].items[0].id;
      state.setItemStatus(listId, itemId, STATUS_DONE);
      assert.equal(
        state.lists[0].items[0].status,
        STATUS_DONE,
        "Item status set to done"
      );
    });
    QUnit.test(
      "validateListName returns empty string for valid name",
      (assert) => {
        const lists = [{ name: "Groceries" }];
        assert.equal(
          validateListName("New List", lists),
          "",
          "Valid name returns empty string"
        );
      }
    );

    QUnit.test("validateListName returns error for empty name", (assert) => {
      assert.ok(validateListName("", []), "Empty name returns error");
    });

    QUnit.test(
      "validateListName returns error for invalid characters",
      (assert) => {
        assert.ok(
          validateListName("List@123", []),
          "Invalid characters return error"
        );
      }
    );

    QUnit.test("validateListName returns error for long name", (assert) => {
      const longName = "A".repeat(61);
      assert.ok(validateListName(longName, []), "Long name returns error");
    });

    QUnit.test(
      "validateListName returns error for duplicate name",
      (assert) => {
        const lists = [{ name: "Groceries" }];
        assert.ok(
          validateListName("Groceries", lists),
          "Duplicate name returns error"
        );
      }
    );

    hooks.beforeEach(() => {
      // Clear lists and set to initial values
      state.lists.splice(0, state.lists.length);
      state.selected = null;
      state.filter = "all";
    });

    QUnit.test("initial state is correct", (assert) => {
      assert.deepEqual(state.lists, [], "Initial lists should be empty");
      assert.equal(state.selected, null, "Initial selected should be null");
      assert.equal(state.filter, "all", "Initial filter should be all");
    });

    QUnit.test("reset sets sample data", (assert) => {
      state.reset();
      assert.ok(Array.isArray(state.lists), "Lists is array after reset");
      assert.equal(state.lists.length, 1, "Sample data has one list");
      assert.equal(
        state.lists[0].name,
        "Sample List",
        "Sample list name is correct"
      );
      assert.equal(state.filter, "all", "Filter reset to all");
      assert.equal(state.selected, "1aaa", "Selected reset to null");
    });

    QUnit.test("addItem adds an item to a list", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.addItem(listId, "Milk");
      assert.equal(state.lists[0].items.length, 1, "Item added");
      assert.equal(
        state.lists[0].items[0].desc,
        "Milk",
        "Item description is correct"
      );
      assert.equal(
        state.lists[0].items[0].status,
        STATUS_TODO,
        "Item status is todo"
      );
      assert.ok(state.lists[0].items[0].id, "Item has an id");
    });

    QUnit.test("setItemStatus changes item status", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.addItem(listId, "Milk");
      const itemId = state.lists[0].items[0].id;
      state.setItemStatus(listId, itemId, STATUS_DONE);
      assert.equal(
        state.lists[0].items[0].status,
        STATUS_DONE,
        "Item status updated"
      );
    });

    QUnit.test("editItem changes item description", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.addItem(listId, "Milk");
      const itemId = state.lists[0].items[0].id;
      state.editItem(listId, itemId, "Oat Milk");
      assert.equal(
        state.lists[0].items[0].desc,
        "Oat Milk",
        "Item description updated"
      );
    });

    QUnit.test("removeItem removes an item from a list", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.addItem(listId, "Milk");
      const itemId = state.lists[0].items[0].id;
      state.removeItem(listId, itemId);
      assert.equal(state.lists[0].items.length, 0, "Item removed");
    });

    QUnit.test("addList adds a new list", (assert) => {
      state.addList("Groceries");
      assert.equal(state.lists.length, 1, "List added");
      assert.equal(state.lists[0].name, "Groceries", "List name is correct");
      assert.deepEqual(state.lists[0].items, [], "List items is empty array");
      assert.ok(state.lists[0].id, "List has an id");
    });

    QUnit.test("removeList removes a list", (assert) => {
      state.addList("Groceries");
      const listId = state.lists[0].id;
      state.removeList(listId);
      assert.equal(state.lists.length, 0, "List removed");
    });

    QUnit.test("Valtio subscription propagates state changes", (assert) => {
      const done = assert.async();
      let called = false;
      const unsub = subscribe(state, () => {
        called = true;
      });
      state.addItem = "active";
      setTimeout(() => {
        assert.ok(called, "Subscription callback was called on state change");
        unsub();
        done();
      }, 10);
    });
  });
}
