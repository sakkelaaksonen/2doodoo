import Qunit from 'qunit';  
import { JSDOM } from 'jsdom';
import TodoCollectionTests  from './todoCollection.test.js';
import TodoListTests  from './todoList.test.js';
const { window } = new JSDOM('');
global.document = window.document;
global.CustomEvent = window.CustomEvent;


TodoCollectionTests();
TodoListTests();
