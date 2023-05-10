import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { filter, of } from 'rxjs';

import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  //small collection of test todos

  const testTodos: Todo[] = [
    {
      _id: 'chenfei_id',
      owner: 'Chenfei',
      status: false,
      body: 'Revvin up your engine listen to her howlin roar',
      category: 'software design',
    },
    {
      _id: 'ryan_id',
      owner:'Ryan',
      status: true,
      body: 'Metal under tension beggin you to touch and go',
      category: 'homework',
    },
    {
      _id: 'kk_id',
      owner: 'KK',
      status: true,
      body: 'Highway to the Danger Zone ride into the Danger Zone',
      category: 'video games',
    },
    {
      _id: 'peter_id',
      owner: 'Peter',
      status: false,
      body: 'Headin into twilight spreadin out her wings tonight',
      category: 'groceries',
    },
  ];
  let todoService: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
  });
  httpClient = TestBed.inject(HttpClient);
  httpTestingController = TestBed.inject(HttpTestingController);
  //create an instance of the server with the mock HTTP client
  todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    //after each test, assert that there are no more pending requests
    httpTestingController.verify();
  });

  //testing for filtering on the database
  describe('getTodos()', () => {
    it('correctly call api/todos with filter parameter \'true\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));
      todoService.getTodos({status: true}).subscribe((todos: Todo[]) => {
        expect(todos)
          .withContext('expected todos')
          .toEqual(testTodos);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(todoService.todoUrl, { params: new HttpParams().set('status', 'true') });
    });
  });
});

  describe('filterTodos()', () => {
    it('filters by body', () => {
      const todoBody = 'Revvin up your engine listen to her howlin roar';
      const filteredTodos = todoService.filterTodos(testTodos, {
        body: todoBody,
        limit: 0
      });
      expect(filteredTodos.length).toBe(1);
      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });
    it('filters by category',()=>{
      const todoCategory = 'video games';
      const filteredTodos = todoService.filterTodos(testTodos,{
        category: todoCategory,
        limit: 0
      });
      expect(filteredTodos.length).toBe(1);
      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });
    it('filters by owner', () => {
      const todoOwner = 'Nic';
      const filteredTodos = todoService.filterTodos(testTodos, {
        owner: todoOwner,
        limit: 0
      });
      expect(filteredTodos.length).toBe(0);
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Adding a todo using addTodo()', () => {
    it('talks to the correct endpoint and is called once', waitForAsync(() => {
      const TODO_ID = 'chenfei_id';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(TODO_ID));

      todoService.addTodo(testTodos[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(todoService.todoUrl, testTodos[1]);
      });
    }));
  });

});

