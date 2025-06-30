"use client"
import { TaskGridCard } from "./task-grid-card"
import type { TaskList, Task } from "./task-column"

interface TaskGridProps {
  taskLists: TaskList[]
  onAddTask: (listId: string, title: string, parentId?: string) => void
  onToggleTask: (listId: string, taskId: string, parentId?: string) => void
  onUpdateTask: (listId: string, taskId: string, updates: Partial<Task>, parentId?: string) => void
  onDeleteTask: (listId: string, taskId: string, parentId?: string) => void
  onUpdateListName: (listId: string, name: string) => void
  onDeleteList: (listId: string) => void
}

export function TaskGrid({
  taskLists,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateListName,
  onDeleteList,
}: TaskGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
      {taskLists.map((tasklist) => (
        <TaskGridCard
          key={tasklist.id}
          tasklist={tasklist}
          onAddTask={(title, parentId) => onAddTask(tasklist.id, title, parentId)}
          onToggleTask={(taskId, parentId) => onToggleTask(tasklist.id, taskId, parentId)}
          onUpdateTask={(taskId, updates, parentId) => onUpdateTask(tasklist.id, taskId, updates, parentId)}
          onDeleteTask={(taskId, parentId) => onDeleteTask(tasklist.id, taskId, parentId)}
          onUpdateListName={(name) => onUpdateListName(tasklist.id, name)}
          onDeleteList={() => onDeleteList(tasklist.id)}
        />
      ))}
    </div>
  )
}
