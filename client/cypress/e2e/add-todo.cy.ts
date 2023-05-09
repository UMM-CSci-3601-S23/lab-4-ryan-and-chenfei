import { Todo } from 'src/app/todos/todo';
import { AddTodoPage } from 'cypress/support/add-todo.po';

describe('Add Todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  describe('Adding a new todo', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });
    it('should go to the right page and have the right info', () => {
      const todo: Todo = {
        _id: null,
        owner: 'chenfei',
        status: true,
        body: 'for the purpose of testing',
        category: 'software design'
      };

      page.addTodo(todo);
      page.getSnackBar().should('contain', `Added todo for ${todo.owner}`);
    });
  });
});

