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
export class AddTodoComponent implements OnInit {

  addTodoForm: UntypedFormGroup;

  todo: Todo;

    // not sure if this name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  addTodoValidationMessages = {
    owner: [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 50 characters long'},
      {type: 'existingOwner', message: 'Owner has already been taken'}
    ],

    category: [
      { type: 'required', message: 'Category is required' },
      { type: 'pattern', message: 'Category must be Software Design, Homework, Video Games, or Groceries' },
    ],

    body: [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least 2 characters long'},
      {type: 'maxlength', message: 'Body cannot be more than 50 characters long'},
      {type: 'existingBody', message: 'Body has already been taken'}
    ],

    status: [
      { type: 'required', message: 'Status is required' },
      { type: 'pattern', message: 'Status must be Complete or Imcomplete' },
    ],
  };

  constructor(private fb: UntypedFormBuilder, private todoService: TodoService, private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {

    // add todo form validations
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      name: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({existingName: true});
          } else {
            return null;
          }
        },
      ])),

      // Since this is for a company, we need workers to be old enough to work, and probably not older than 200.
      age: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.min(15),
        Validators.max(200),
        // In the HTML, we set type="number" on this field. That guarantees that the value of this field is numeric,
        // but not that it's a whole number. (The todo could still type -27.3232, for example.) So, we also need
        // to include this pattern.
        Validators.pattern('^[0-9]+$')
      ])),

      // We don't care much about what is in the company field, so we just add it here as part of the form
      // without any particular validation.
      company: new UntypedFormControl(),

      // We don't need a special validator just for our app here, but there is a default one for email.
      // We will require the email, though.
      email: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.email,
      ])),

      role: new UntypedFormControl('viewer', Validators.compose([
        Validators.required,
        Validators.pattern('^(admin|editor|viewer)$'),
      ])),
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe({
      next: (newID) => {
        this.snackBar.open(
          `Added todo ${this.addTodoForm.value.name}`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/todos/', newID]);
      },
      error: err => {
        this.snackBar.open(
          'Failed to add the todo',
          'OK',
          { duration: 5000 }
        );
      },
      // complete: () => console.log('Add todo completes!')
    });
  }

}
