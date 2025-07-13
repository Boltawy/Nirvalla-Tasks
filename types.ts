export interface TaskList {
  _id: string;
  title: string;
  tasks: Task[];
  userId: string;
  isDefault: boolean;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  userId: string;
  taskListId: string;
  parentId?: string | null;
  completedAt: Date | null;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  subtasks?: Task[];
}

export interface signupFormData {
  userName: string;
  email: string;
  password: string;
}

export interface loginFormData {
  email: string;
  password: string;
}

export interface tokenPayload {
  _id: string;
  userName: string;
}
