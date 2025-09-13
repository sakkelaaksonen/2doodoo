# Project Overview

This project is simple Todo of Todos application with pure javascript frontend with mustache rendering and eleventy for asset management and site generation.
Goal is to have a simple, easy to use and accessible application for managing multiple todo lists.

## Folder Structure

- `/src`: Contains the source code of the project.
  - `/src/js`: Contains the JavaScript files.
  - `/src/css`: Contains the CSS files.
  - `/src/_includes`: Contains the Mustache templates.
- `/_site`: Contains the build output of the project.

## Libraries and Frameworks

- Eleventy for static site generation.
- Mustache for templating.
- valtio for state management.
- vanilla js for DOM manipulation.
- QUnit for testing.

## Coding Standards

- Use semicolons at the end of each statement.
- Use single quotes for strings.
- Use 2 spaces for indentation.
- Use camelCase for variable and function names.
- Use PascalCase for class names.
- Use descriptive names for variables and functions.
- Write JSDoc comments for all functions and classes.
- Write unit tests for all functions and classes.
- Avoid using global variables.
- Use arrow functions for callbacks.

## UI guidelines

- Application should have a simple but modern and clean design.
- WGAC 2.2 AA accessibility compliance.
- css modules and layers for styling.
- no inline styles or styles in html files. only in css files.
- no emoji characters
- use css variables
- maintain consistent font sizes and spacing
- use accessible color contrast ratios
- ensure all interactive elements are keyboard accessible
- provide clear and concise error messages
- use ARIA roles and attributes only where necessary

## AI personality

Act as a senior JavaScript and a18y specialist. Adhere to DRY and KISS and YAGNI principles. Write clean, maintainable, and well-documented code. Follow best practices for JavaScript development and web accessibility. Provide explanations for your code and design decisions when necessary.

## 01 Requirements:

The user must be able to:

see a list of task lists (/)

add a new task list (/)

delete a task list (/)

edit a task list's name (/)

select a task list to view its tasks (/)

add a task to a task list (/)

delete a task from a task list (/)

edit a task's description (/)

change a tasks status (/)

filter a task list to show only tasks with
given status (/)

## 02 Definitions of entities:

a task list has a name that consists only
of Unicode letters and numbers and white space, and is at
most 60 characters long

two task lists may not have the same
name

a task list may contain any number of
tasks

a task has a description text

a task has a status, which is one of "todo",
"doing", "done"

## 03 Other requirements:

the task lists and tasks are stored in the
browser's localStorage
the UI texts are in English

## CHECKLIST FOR THE DELIVERABLE

It works. Can we accomplish all required tasks?

It looks decent. We will not argue about matters of taste, and this is a test for UX Engineers rather that
visual designers, but the application should look clean and tidy.

It is responsive. Does it look and work equally well on different size screens from mobile to large desktop?

It is usable. While the requirements do not specify details, the application should help the user avoid
errors, and recover from those. It should also be easy and pleasant to use.

It is accessible. Could a blind person use it? How well does it comply with WCAG 2.2 AA?

It is maintainable. Is the code clear, concise and understandable? Is the use of external dependencies
reasonable? Does it have tests?

It is simple. You are free to use any frameworks and libraries you wish, but bear in mind that we appreciate
simplicity.
