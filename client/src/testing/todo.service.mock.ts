import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo, TodoCategory } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service. It needs to be `Injectable` since
 * that's how services are typically provided to components.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
        _id: 'chenfei_id',
        owner: 'Chenfei',
        status: true,
        body: 'Revvin up your engine listen to her howlin roar',
        category: 'homework',
        },
        {
          _id: 'ryan_id',
          owner: 'Ryan',
          status: false,
          body: 'Metal under tension beggin you to touch and go',
          category: 'software design',
        },
        {
          _id: 'kk_id',
          owner: 'KK',
          status: false,
          body: 'Headin into twilight spreadin out her wings tonight',
          category: 'video games',
        },
        {
          _id: 'peter_id',
          owner: 'Peter',
          status: true,
          body: 'Peter is the best teacher in the world',
          category: 'groceries',
        },
      ];
  constructor() {
    super(null);
  }

  getTodos(filters: { status?: boolean; body?: string; category?: TodoCategory}): Observable<Todo[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test todos regardless of what
    // filters are passed in.
    //
    // The `of()` function converts a regular object or value into an
    // `Observable` of that object or value.
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for one of the test todos,
    // return that todo, otherwise return `null` so
    // we can test illegal todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else if (id === MockTodoService.testTodos[1]._id) {
      return of(MockTodoService.testTodos[1]);
    } else if (id === MockTodoService.testTodos[2]._id) {
      return of(MockTodoService.testTodos[2]);
    } else {
      return of(null);
    }
  }
}
