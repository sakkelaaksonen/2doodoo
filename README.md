# 2doodoo
Todo ^ 2. A JS Todo of todos


## TODO for 2doodoo

  - UI
 - UI testing?
  - a18y
 - visual design

## Tech Stack

Browser based as much as possible. Publish to github pages and share repository.

## QUnit 
Use browser based qunit testing framework to allow instant review without installation. TODO: convert node tests to browser. Think about two setups

## App and Data model

- state machine?: todo, doing , done
- weak map of todos.
- weak map of items.
- store in localstorage, find useful microlib?
- custom events: addList, updateList, removeList, addItem, updateItem, removeItem
- happycase validation, considering task scope.
- store data in html attributes and persist in local storage.

## UI
 
- Mobile first, stickymenu with logo and list-button and +button: list of lists, selected todolist. Nothing quirky. Also, two accordions might work, KISS.
- confirmation on delete if task is not done.
- 
- Semantic to a degree. Application scope, not document scope. Look for reasonable markup solution, not showing off.
- A18y: WGAC 2.2 Primary concern: Tab navigation and titles. Consider emulating Screen reader but within reasonable effort, considering the scope.


