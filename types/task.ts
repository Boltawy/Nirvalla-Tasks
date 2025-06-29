export interface Task {
  id: string
  title: string
  completed: boolean
  notes: string
}

export interface TaskList {
  id: string
  name: string
  tasks: Task[]
}
