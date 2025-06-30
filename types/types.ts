export interface TaskList {
  id: string;
  name: string;
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
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}
