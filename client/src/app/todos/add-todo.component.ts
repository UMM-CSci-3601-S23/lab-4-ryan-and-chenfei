import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit{

  addTodoForm: UntypedFormGroup;

  todo: Todo;

  addTodoValidationMessages = {
    owner: [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least a character long'},
      {type: 'maxlength', message: 'Owner cannot be more than 50 characters long'},
      {type: 'existingName', message: 'Owner already exists'},
    ],

    status: [
      {type: 'required', message: 'Must have a status'}
    ],

    body: [
      {type: 'required', message: 'A body is required'},
      {type: 'minlength', message: 'A body must be at least a character long'},
      {type: 'maxlength', message: 'A body cannot be more than 150 characters long'},
    ],

    category: [
      {type: 'required', message: 'A category is required'},
      {type: 'pattern', message: 'Category must be homework, groceries, software design, or video games'},
    ]
  };

  constructor(private fb: UntypedFormBuilder, private todoService: TodoService, private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {
    this.addTodoForm = this.fb.group({
      owner: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({existingName: true});
          } else {
            return null;
          }
        }
      ])),

      status: new UntypedFormControl('', Validators.compose([
      ])),

      body: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150),
      ])),

      category: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(homework|groceries|software design|video games)$'),
      ]))
    });
  }

  ngOnInit(): void {
      this.createForms();
  }

  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe({
      next: (newID) => {
        this.snackBar.open(
          `Added todo for ${this.addTodoForm.value.owner}`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/todos/', newID]);
      },
      error: err => {
        this.snackBar.open(
          'Failed to add the Todo',
          'OK',
          { duration: 5000 }
        );
      },
    });
  }
}

