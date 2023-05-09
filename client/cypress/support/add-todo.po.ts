import {Todo} from 'src/app/todos/todo';

export class AddTodoPage {
  navigateTo() {
    return cy.visit('/todos/new');
  }

  getTitle() {
    return cy.get('.add-todo-title');
  }

  addUserButton() {
    return cy.get('[data-test=confirmAddTodoButton]');
  }

  selectMatSelectValueBoolean(select: Cypress.Chainable, value: boolean) {
    // Find and click the drop down
     return select.click()
       // Select and click the desired value from the resulting menu
       .get(`mat-option[value="${value}"]`).click();
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }



  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }

  getSnackBar() {
    return cy.get('.mat-mdc-simple-snack-bar');
  }

  addTodo(newTodo: Todo) {
    this.getFormField('owner').type(newTodo.owner);
    if (newTodo.body) {
      this.getFormField('body').type('This is a test body');
    }
    this.selectMatSelectValue(this.getFormField('category'), newTodo.category);
    this.selectMatSelectValueBoolean(this.getFormField('status'), true || false);
    return this.addUserButton().click();
  }
}
