import { proxy } from "valtio/vanilla";

/**
 *
 * Choosing valtio for state management for its simplicity and reactivity.
 * Could do reducer actions wrappers but not really needed for this app.
 */

const STORAGE_KEY = "2doodoo-state";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.lists)) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lists: state.lists,
        selected: state.selected,
        filter: state.filter,
      })
    );
  } catch (e) {
    console.error("Error saving state", e);
    // ignore on this demo app
  }
}

export const STATUS_TODO = "todo";
export const STATUS_DOING = "doing";
export const STATUS_DONE = "done";
export const VALID_STATUSES = [STATUS_TODO, STATUS_DOING, STATUS_DONE];
export const DEFAULT_FILTER = "all";

export function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

function newId() {
  //random enough for this app
  return Math.random().toString(36).substring(2, 11);
}

export function getSampleData() {
  return [
    {
      id: "1aaa",
      name: "Sample List",
      items: [
        { desc: "Sample Task 1", status: STATUS_TODO, id: "1abc" },
        { desc: "Sample Task 2", status: STATUS_DOING, id: "2abc" },
        { desc: "Sample Task 3", status: STATUS_DONE, id: "3abc" },
      ],
    },
  ];
}

export function validateListName(name, lists, currentName = undefined) {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return "List name is required.";
  }
  if (!/^[\p{L}\p{N}\s]+$/u.test(name)) {
    return "List name must only contain letters, numbers, and spaces.";
  }
  if (name.length > 60) {
    return "List name must be at most 60 characters.";
  }
  if (lists.some((list) => list.name === name && name !== currentName)) {
    return "A list with this name already exists.";
  }
  return "";
}

const initial = loadState() || {
  lists: getSampleData(),
  selected: null,
  filter: DEFAULT_FILTER,
};
if (!initial.selected && initial.lists.length > 0) {
  initial.selected = initial.lists[0].id;
}

export const state = proxy({
  getCurrentList() {
    return this.getListById(this.selected);
  },
  getItemById(list, itemId) {
    return list.items.find((i) => i.id === itemId);
  },
  getListById(listId) {
    return this.lists.find((l) => l.id === listId);
  },
  lists: initial.lists,
  selected: initial.selected,
  filter: initial.filter,
  reset() {
    this.lists = getSampleData();
    this.filter = DEFAULT_FILTER;
    this.selected = this.lists.length > 0 ? this.lists[0].id : null;
    saveState(this);
  },
  addList(name) {
    const errorMsg = validateListName(name, this.lists);
    if (errorMsg) {
      throw new Error(errorMsg);
    }
    const id = newId();
    this.lists.push({ id, name, items: [] });
    this.selected = id;
  },
  addItem(listId, desc) {
    const list = this.getListById(listId);
    if (list) {
      const id = newId();
      list.items.push({ id, desc, status: STATUS_TODO });
    }
  },
  setItemStatus(listId, itemId, status) {
    if (!isValidStatus(status)) return;
    const list = this.getListById(listId);
    if (list) {
      const item = this.getItemById(list, itemId);
      if (item) item.status = status;
    }
  },
  editItem(listId, itemId, newDesc) {
    const list = this.getListById(listId);
    if (list) {
      const item = this.getItemById(list, itemId);
      if (item) item.desc = newDesc;
    }
  },
  removeItem(listId, itemId) {
    const list = this.getListById(listId);
    if (list) {
      const idx = list.items.findIndex((i) => i.id === itemId);
      if (idx !== -1) list.items.splice(idx, 1);
    }
  },
  removeList(listId) {
    const idx = this.lists.findIndex((l) => l.id === listId);
    if (idx !== -1) this.lists.splice(idx, 1);
    if (this.lists.length > 0) {
      this.selected = this.lists[0].id;
    } else {
      this.selected = null;
    }
  },

  getSelectedListItemCount() {
    const list = this.getListById(this.selected);
    return list ? list.items.length : 0;
  },
});
// removeList function no longer needed, use state.removeList(listId)
