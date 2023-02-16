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

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { category?: TodoCategory; status?: boolean; owner?: string}): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.status){
        httpParams = httpParams.set('status', filters.status.toString());
      }
      if (filters.owner){
        httpParams = httpParams.set('owner', filters.owner);
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  //Gets Todo with the specified ID
  getTodoById(id: string): Observable<Todo>{
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: { owner?: string; body?: string}): Todo[] {
    let filteredTodos = todos;

    if (filters.owner){
      filters.owner = filters.owner.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }
    if (filters.body){
      filters.body = filters.body.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }
    return filteredTodos;
  }

  addTodo(newTodo: Todo): Observable<string> {
    return this.httpClient.post<{id: string}>(this.todoUrl, newTodo).pipe(map(res => res.id));
  }
}
