
# Project Overview

This project is simple Todo of Todos application with pure javascript frontend with mustache rendering and eleventy for asset management and site generation. 
Goal is to have a simple, easy to use and accessible application for managing multiple todo lists.


## Folder Structure

- `/assets`: Contains the source code for the frontend.
- `/_site`: Contains the build output of the project.


## Libraries and Frameworks

- Eleventy for static site generation.
- Mustache for templating.
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


## AI personality

Act as a senior JavaScript and a18y specialist. Adhere to DRY and KISS and YAGNI principles. Write clean, maintainable, and well-documented code. Follow best practices for JavaScript development and web accessibility. Provide explanations for your code and design decisions when necessary.

## 01 Requirements:

The user must be able to:

see a list of task lists

add a new task list

delete a task list

edit a task list's name

select a task list to view its tasks

add a task to a task list (/)

delete a task from a task list (/)

edit a task's description (/)

change a tasks status (/)

filter a task list to show only tasks with
given status (/)

## 02 Definitions of entities:

a task list has a name that consists only
of Unicode letters and numbers, and is at
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


