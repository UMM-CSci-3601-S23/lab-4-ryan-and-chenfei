import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
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
  public viewType: 'card' | 'list' = 'card';

  private ngUnsubscribe = new Subject<void>();

  constructor(private todoService: TodoService, private snackBar: MatSnackBar) {

  }

}
