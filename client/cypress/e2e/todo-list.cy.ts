import { TodoListPage } from 'cypress/support/todo-list.po';

const page = new TodoListPage();

function isTodoListSorted(order: 'asc' | 'desc') {
  page.getTodoListItems().then($listItems => {
    const ownerNames = $listItems.map((_, el) => Cypress.$(el).find('.todoOwnerInput').text()).get();
    const sortedOwnerNames = [...ownerNames].sort((a, b) => (
      order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
    ));

    expect(ownerNames).to.deep.equal(sortedOwnerNames);
  });
}





describe('Todo list', () => {
  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('should return the correct todos with the given name \'Dawn\'', () => {
    //input Fry into the filter
    cy.get('[data-test=todoOwnerInput]').type('Dawn');

    //check if all returned todos have owner Fry
    page.getTodoListItems().each($list => {
      cy.wrap($list).find('.todo-list-owner').should('contain.text', 'Dawn');
    });
  });

  it('Should type something into the Body filter and return the correct elements', () => {
    //get body 'In sunt'
    cy.get('[data-test=todoBodyInput]').type('In sunt');

    page.getTodoListItems().should('have.length', 2);
    //All of the listed todos should have the name we are filtering for
    page.getTodoListItems().each($list => {
      cy.wrap($list).find('.todo-list-body').should('contain.text', 'In sunt');
    });


  });

  // it('Should pick a category and check that it has returned the correct elements', () => {
  //   //get category 'homework'
  //   page.selectCategory('homework');

  //   page.getTodoListItems().should('have.length.above', 1);
  //   //All of the listed todos should have the name we are filtering for
  //   page.getTodoListItems().each($list => {
  //     cy.wrap($list).find('.todo-list-category').should('contain','homework');
  //   });


  // });

  // it('should pick a status and check that it has returned the correct elements', () => {
  //   //select status complete
  //   page.selectStatus('complete');

  //   //check if todos are being displayed
  //   page.getTodoListItems().should('have.length.above', 10);

  //   //check if all given todos are complete
  //   page.getTodoListItems().each($todo => {
  //     cy.wrap($todo).find('.todo-list-status').should('contain.text', 'Completion: true');
  //   });

  // });

  it('should sort todos in descending order', () => {
    page.selectSortDirection('desc');
    isTodoListSorted('desc');
  });

  it('should sort todos in ascending order', () => {
    page.selectSortDirection('asc');
    isTodoListSorted('asc');
  });

});
