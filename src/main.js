import { TodoApp } from './todoApp.js';

const app = new TodoApp();

// Add a new list
const listId = app.addList('Work');

// Add items to the list
app.getList(listId).addItem('Finish report');
app.getList(listId).addItem('Email client');

// Set item status
app.getList(listId).setItemStatus(0, 'doing');

// Remove an item
app.getList(listId).removeItem(1);  

// Remove a list
app.removeList(listId);
