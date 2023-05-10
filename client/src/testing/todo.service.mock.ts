import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { Todo} from 'src/app/todos/todo';
import { TodoService } from 'src/app/todos/todo.service';

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
      _id: 'peter_id',
      owner: 'Peter',
      status: true,
      body: 'Highway to the Danger Zone ride into the Danger Zone',
      category: 'video games',
    },
    {
      _id: 'kk_id',
      owner: 'KK',
      status: false,
      body: 'Headin into twilight spreadin out her wings tonight',
      category: 'software design',
    }
  ];

  constructor(){
    super(null);
  }

  getTodos(filters?: { status?: boolean}): Observable<Todo[]> {
      return of (MockTodoService.testTodos);
  }
    /*
  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for one of the test users,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else if (id === MockTodoService.testTodos[1]._id) {
      return of(MockTodoService.testTodos[1]);
    } else if (id === MockTodoService.testTodos[2]._id) {
      return of(MockTodoService.testTodos[2]);
    } else {
      return of(null);
    }
  }*/
}
