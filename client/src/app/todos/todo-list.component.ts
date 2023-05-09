import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { max, Subject, takeUntil } from 'rxjs';
import { Todo, TodoCategory } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: []
})
export class TodoListComponent implements OnInit, OnDestroy {

  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];

  public todoOwner: string;
  public todoStatus: boolean;
  public todoCategory: TodoCategory;
  public todoBody: string;
  public viewType: 'card' | 'list' = 'list';
  public todoMaxResponseLimit: number;
  public sortDirection: string;
  public sortField: any;

  private ngUnsubscribe = new Subject<void>();


  constructor(private todoService: TodoService, private snackBar: MatSnackBar) {

  }

  /**
   * Get the todos from the server, filtered by the role and age specified
   * in the GUI.
   */
  getTodosFromServer(): void {
    this.todoService.getTodos({
      category: this.todoCategory,
      status: this.todoStatus,
      sortby: this.sortField,
      sortdirection: this.sortDirection
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedTodos) => {
        this.serverFilteredTodos = returnedTodos;
        this.updateFilter();
      },
      error: (e) => {
        this.snackBar.open('Problem contacting the server – try again',
          'OK',
          { duration: 3000 });
        console.error('We couldn\'t get the list of todos; the server might be down');
      },
    });
  }
//Functionality for sorting
  sortTodos(): void {
    if (!this.sortField) {
      return;
    }
    this.filteredTodos.sort((a, b) => {
      const valueA = a[this.sortField].toLowerCase();
      const valueB = b[this.sortField].toLowerCase();
      const sortOrder = this.sortDirection === 'desc' ? -1 : 1;
      if (valueA < valueB) {
        return -1 * sortOrder;
      }
      if (valueA > valueB) {
        return 1 * sortOrder;
      }
      return 0;
    });
  }

  /**
   * Called when the filtering information is changed in the GUI so we can
   * get an updated list of `filteredTodos`.
   */
  public updateFilter(): void {
    this.filteredTodos = this.todoService.filterTodos(
      this.serverFilteredTodos, { limit: this.todoMaxResponseLimit, owner: this.todoOwner, body: this.todoBody,
        category: this.todoCategory});
    this.sortTodos();
  }

  /**
   * Starts an asynchronous operation to update the todos list
   *
   */
  ngOnInit(): void {
    this.getTodosFromServer();
  }

  /**
   * When this component is destroyed, we should unsubscribe to any
   * outstanding requests.
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
