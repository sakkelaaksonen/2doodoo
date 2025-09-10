
import TodoCollection  from './todoCollection.js';
import { TodoList, TodoItem } from './todoList.js';
import TodoCollectionTests from './todoCollection.test.js';
import TodoListTests from './todoList.test.js';


console.log('running qunit test', TodoCollection);

TodoCollectionTests();
TodoListTests();
