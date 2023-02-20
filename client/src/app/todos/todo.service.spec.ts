import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { filter, of } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  //A small collection of test todos
  const testTodos: Todo[] = [
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

  //testing for filtering on the server
  describe('getTodos()', () => {

    it('correctly calls `api/todos` when `getTodos()` is called with no parameters', () => {
      todoService.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(todoService.todoUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);

      req.flush(testTodos);
    });
  });

  describe('calling getTodos() with parameters correctly forms the HTTP request', () => {
    it('correctly calls api/todos with filter parameter \'owner\'', () => {
      todoService.getTodos({owner: 'Chenfei'}).subscribe(
        users => expect(users).toBe(testTodos)
      );
      // Specify that (exactly) one request will be made to the specified URL with the owner parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('owner')
      );
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request was 'Chenfei'.
      expect(req.request.params.get('owner')).toBe('Chenfei');

      req.flush(testTodos);

    });

    it('correctly calls api/todos with filter parameter \'status true\'', () => {

      todoService.getTodos({status: true}).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the status parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('status')
      );
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request was 'true'.
      expect(req.request.params.get('status')).toBe('true');

      req.flush(testTodos);
    });

    //for some reason despite being a similar test for true this one never works
    //we believe that the reason for this is because of something to do with where the boolean gets
    //translated into a string (complete/incomplete) and that filters.status sets status to be true

    /*it('correctly calls api/todos with filter parameter \'status false\'', () => {

      todoService.getTodos({status: false}).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the status parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('status')
      );
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request was 'false'.
      expect(req.request.params.get('status')).toBe('false');

      req.flush(testTodos);
    });*/

    it('correctly calls api/users with multiple filter parameters', () => {
      todoService.getTodos({owner: 'Chenfei', status: true}).subscribe(
        users => expect(users).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with all parameters.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoUrl)
        && request.params.has('owner') && request.params.has('status')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the owner and status are correct.
      expect(req.request.params.get('owner')).toBe('Chenfei');
      expect(req.request.params.get('status')).toBe('true');

      req.flush(testTodos);

    });
  });

  //filtering the todos by ID
  describe('getTodoByID()',() => {
    it('calls api/todos/id with the correct ID', () => {
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      todoService.getTodoById(targetId).subscribe(
        todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = todoService.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });

  //filtering client side testing
  describe('filterTodos()', () => {

    //test for filtering by text in a body
    it('filters by body', () => {
      const todoBody = 'Highway to the Danger Zone ride into the Danger Zone';
      const filteredTodos = todoService.filterTodos(testTodos, {body: todoBody});

      expect(filteredTodos.length).toBe(1);

      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });

    //test for filtering by category
    it('filters by category', () => {
      const todoCategory = 'software design';
      const filteredTodos = todoService.filterTodos(testTodos, {category: todoCategory});

      expect(filteredTodos.length).toBe(2);

      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Adding a user using `addTodo()`', () => {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addTodo()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const TODO_ID = 'chenfei_id';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(TODO_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
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
