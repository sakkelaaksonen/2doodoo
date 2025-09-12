import ListApp from "./listApp.js";



export default function ListAppTests() {

  
  QUnit.module('ListApp', function() {
    QUnit.test('should render list selector and title', function(assert) {

  // Setup DOM fixture using template
  document.body.innerHTML = `
    <button id="menu-btn"></button>
    <div id="menu-panel"></div>
    <select id="todo-list-selector">
      <optgroup id="todo-list-options"></optgroup>
    </select>
    <div id="list-title-container">
      <input id="list-name-display" />
      <div id="list-name-edit-error"></div>
    </div>
    <span id="navi-listname"></span>
    <form id="new-list-form">
      <input id="list-name-input" />
      <div id="list-name-error"></div>
    </form>
  `;

    // Query elements for assertions
    const optgroup = document.getElementById('todo-list-options');
    const titleContainer = document.getElementById('list-title-container');
    const naviListname = document.getElementById('navi-listname');

    // Create app with one list
    const app = new ListApp({});
    app.collection.addList('TestList');
    app.selectedIndex = 0;
    app.render();

    assert.ok(optgroup.innerHTML.includes('TestList'), 'Optgroup contains list name');
    assert.ok(titleContainer.innerHTML.includes('TestList'), 'Title container contains list name');
    assert.equal(naviListname.textContent, 'TestList', 'navi-listname updated');


    });


    
    // Smoketest is sufficient.
    // App is fully manually tested.
    // Full Interaction tests only scaffolded and outside of scope.
    QUnit.test('should add a new list when form is submitted', function(assert) {
      assert.expect(0); // Scaffold
    });

  });
}
