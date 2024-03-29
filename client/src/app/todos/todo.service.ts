import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo, TodoCategory } from './todo';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  readonly todoUrl: string = environment.apiUrl + 'todos';

  // The private `HttpClient` is *injected* into the service
  // by the Angular framework. This allows the system to create
  // only one `HttpClient` and share that across all services
  // that need it, and it allows us to inject a mock version
  // of `HttpClient` in the unit tests so they don't have to
  // make "real" HTTP calls to a server that might not exist or
  // might not be currently running.
  constructor(private httpClient: HttpClient) {
  }

  /**
   * Get all the users from the server, filtered by the information
   * in the `filters` map.
   *
   * It would be more consistent with `UserListComponent` if this
   * only supported filtering on age and role, and left company to
   * just be in `filterUsers()` below. We've included it here, though,
   * to provide some additional examples.
   *
   * @param filters a map that allows us to specify a target role, age,
   *  or company to filter by, or any combination of those
   * @returns an `Observable` of an array of `Users`. Wrapping the array
   *  in an `Observable` means that other bits of of code can `subscribe` to
   *  the result (the `Observable`) and get the results that come back
   *  from the server after a possibly substantial delay (because we're
   *  contacting a remote server over the Internet).
   */
  getTodos(filters?: { category?: TodoCategory; status?: boolean; owner?: string;
    body?: string; sortby?: string; sortdirection?: string;}): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.status !== undefined && filters.status !== null) {
        httpParams = httpParams.set('status', filters.status.toString());
      }
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
      if (filters.body) {
        httpParams = httpParams.set('body', filters.body);
      }
      if (filters.sortby) {
        httpParams = httpParams.set('sortby', filters.sortby);
      }
      if (filters.sortdirection) {
        httpParams = httpParams.set('sortdirection', filters.sortdirection);
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  /**
   * Get the `User` with the specified ID.
   *
   * @param id the ID of the desired user
   * @returns an `Observable` containing the resulting user.
   */
  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  /**
   * A service method that filters an array of `User` using
   * the specified filters.
   *
   * Note that the filters here support partial matches. Since the
   * matching is done locally we can afford to repeatedly look for
   * partial matches instead of waiting until we have a full string
   * to match against.
   *
   * @param todos the array of `Users` that we're filtering
   * @param filters the map of key-value pairs used for the filtering
   * @returns an array of `Users` matching the given filters
   */
  filterTodos(todos: Todo[], filters: {limit?: number;owner?: string; body?: string; status?: string; category?: string}): Todo[] {
    let filteredTodos = todos;

    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }

    if (filters.body) {
      filters.body = filters.body.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }
    if (filters.status) {
      filters.status = filters.status.toLowerCase();
      if (filters.status === 'incomplete'){
        filteredTodos = filteredTodos.filter(todo => !todo.status);
    }
      else{
        filteredTodos = filteredTodos.filter(todo => todo.status);
      }
    }
    if (filters.category){
      filters.category= filters.category.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.category.toLowerCase().indexOf(filters.category.toString()) !== -1);
    }

    if (filters.limit){
      filteredTodos = filteredTodos.slice(0, filters.limit);
    }

    return filteredTodos;
  }

  addTodo(newTodo: Todo): Observable<string> {
    return this.httpClient.post<{id: string}>(this.todoUrl, newTodo).pipe(map(res => res.id));
  }
}
