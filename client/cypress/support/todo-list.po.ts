export class TodoListPage{
  navigateTo() {
    return cy.visit('/todos');
  }

  getTodoTitle() {
    return cy.get('.todo-list-title');
  }

  getTodoListItems() {
    return cy.get('.todo-nav-list .todo-list-item');
  }

  selectStatus(value: 'complete'| 'incomplete') {
    cy.get('[data-test=todoStatusSelect]').click();
    return cy.get(`mat-option[value="${value}"]`).click();
  }

  selectCategory(value: 'software design' | 'homework' | 'video games' | 'groceries') {
    cy.get('[data-test=todoCategorySelect]').click();
    return cy.get(`mat-option[value="${value}"]`).click();;
  }

  selectSortDirection(value: 'asc' | 'desc') {
    cy.get('[data-test=todoSortDirectionSelect]').click();
    return cy.get(`mat-option[value="${value}"]`).click();
  }

}
