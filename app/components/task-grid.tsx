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
      {taskLists.map((taskList) => (
        <TaskGridCard
          key={taskList.id}
          taskList={taskList}
          onAddTask={(title, parentId) => onAddTask(taskList.id, title, parentId)}
          onToggleTask={(taskId, parentId) => onToggleTask(taskList.id, taskId, parentId)}
          onUpdateTask={(taskId, updates, parentId) => onUpdateTask(taskList.id, taskId, updates, parentId)}
          onDeleteTask={(taskId, parentId) => onDeleteTask(taskList.id, taskId, parentId)}
          onUpdateListName={(name) => onUpdateListName(taskList.id, name)}
          onDeleteList={() => onDeleteList(taskList.id)}
        />
      ))}
    </div>
  )
}
