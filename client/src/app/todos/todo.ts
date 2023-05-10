export interface Todo {
    _id: string;
    owner: string;
    status: boolean;
    body: string;
    category: TodoCategory;
  }

export type TodoCategory = 'software design' | 'homework' | 'video games' | 'groceries';
