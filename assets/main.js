import { TodoList } from './todoList.js';
import  TodoCollection  from './todoCollection.js';


function main() {      

    const collection = new TodoCollection();
    const list = new TodoList('Sample List');

    collection.addList(list.name);
    console.log('App loaded', collection, list);

    alert('App loaded, check console for details.');
}

export default main;

document.addEventListener('DOMContentLoaded', main);

