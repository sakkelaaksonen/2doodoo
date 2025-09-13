
import { JSDOM } from 'jsdom';
import TodoCollectionTests  from './todoCollection.test.js';
import TodoListTests  from './todoList.test.js';
import ListAppTests from './listApp.test.js';

const { window } = new JSDOM('');
global.window = window;
global.document = window.document;
global.CustomEvent = window.CustomEvent;
// Provide a global mustache mock for tests
global.mustache = { render: (template, data) => template.replace(/{{\s*listName\s*}}/g, data.listName || '') };
// Mock localStorage for tests
global.localStorage = {
  _data: {},
  getItem(key) { return this._data[key] || null; },
  setItem(key, value) { this._data[key] = String(value); },
  removeItem(key) { delete this._data[key]; },
  clear() { this._data = {}; }
};

// TodoCollectionTests();
// TodoListTests();
// ListAppTests();
