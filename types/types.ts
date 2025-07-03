export interface TaskList {
  id: string;
  title: string;
  tasks: Task[];
  userId: string;
  isDefault: boolean;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  userId: string;
  taskListId: string;
  parentId?: string | null;
  completedAt: Date | null;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface fetchedTaskList {
  _id: string;
  title: string;
  description?: string;
  isDefault: boolean;
  deletedAt: Date | null;
  userId: string;
}

export interface fetchedTask {
  _id: string;
  title: string;
  description?: string;
  taskListId: string;
  parentId?: string | null;
  completedAt: Date | null;
  deletedAt: Date | null;
  userId: string;
}
