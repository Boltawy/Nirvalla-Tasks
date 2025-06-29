"use client"

import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, rectSortingStrategy } from "@dnd-kit/sortable"
import { TaskColumn } from "./components/task-column"
import { TaskGrid } from "./components/task-grid"
import { TaskHeader } from "./components/task-header"
import type { TaskList, Task } from "./components/task-column"

const initialTaskLists: TaskList[] = [
  {
    id: "1",
    name: "My Tasks",
    tasks: [
      {
        id: "1",
        title: "Complete project proposal",
        completed: false,
        notes: "Include budget and timeline",
        subtasks: [
          { id: "1-1", title: "Research competitors", completed: true, notes: "", subtasks: [] },
          { id: "1-2", title: "Create budget breakdown", completed: false, notes: "", subtasks: [] },
          { id: "1-3", title: "Write executive summary", completed: false, notes: "", subtasks: [] },
        ],
      },
      { id: "2", title: "Review team feedback", completed: true, notes: "", subtasks: [] },
      { id: "3", title: "Schedule client meeting", completed: false, notes: "Discuss Q4 goals", subtasks: [] },
      { id: "4", title: "Update documentation", completed: false, notes: "", subtasks: [] },
    ],
  },
  {
    id: "2",
    name: "Personal",
    tasks: [
      { id: "5", title: "Buy groceries", completed: false, notes: "Milk, bread, eggs", subtasks: [] },
      { id: "6", title: "Call dentist", completed: true, notes: "", subtasks: [] },
      { id: "7", title: "Plan weekend trip", completed: false, notes: "", subtasks: [] },
    ],
  },
  {
    id: "3",
    name: "Work",
    tasks: [
      { id: "8", title: "Prepare presentation", completed: false, notes: "Sales figures for Q3", subtasks: [] },
      { id: "9", title: "Team standup", completed: true, notes: "", subtasks: [] },
    ],
  },
]

export type ViewMode = "list" | "grid"

export default function TasksApp() {
  const [taskLists, setTaskLists] = useState<TaskList[]>(initialTaskLists)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const findTaskById = (taskId: string): { task: Task; listId: string; parentId?: string } | null => {
    for (const list of taskLists) {
      // Check main tasks
      const mainTask = list.tasks.find((task) => task.id === taskId)
      if (mainTask) {
        return { task: mainTask, listId: list.id }
      }

      // Check subtasks recursively
      for (const task of list.tasks) {
        const result = findSubtask(task, taskId, list.id)
        if (result) return result
      }
    }
    return null
  }

  const findSubtask = (
    task: Task,
    targetId: string,
    listId: string,
  ): { task: Task; listId: string; parentId: string } | null => {
    const subtask = task.subtasks.find((sub) => sub.id === targetId)
    if (subtask) {
      return { task: subtask, listId, parentId: task.id }
    }

    // Check nested subtasks
    for (const sub of task.subtasks) {
      const result = findSubtask(sub, targetId, listId)
      if (result) return result
    }

    return null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    if (active.id.toString().startsWith("task-")) {
      const taskId = active.id.toString().replace("task-", "")
      const result = findTaskById(taskId)
      if (result) {
        setActiveTask(result.task)
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    // Handle task dragging over other tasks or lists
    if (activeId.startsWith("task-")) {
      const taskId = activeId.replace("task-", "")
      const result = findTaskById(taskId)
      if (!result) return

      // Dragging over a list
      if (overId.startsWith("list-")) {
        const targetListId = overId.replace("list-", "")
        if (result.listId !== targetListId) {
          moveTaskBetweenLists(taskId, result.listId, targetListId, result.parentId)
        }
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveTask(null)

    if (!over) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    // Handle task list reordering
    if (activeId.startsWith("list-") && overId.startsWith("list-")) {
      const activeListId = activeId.replace("list-", "")
      const overListId = overId.replace("list-", "")

      if (activeListId !== overListId) {
        reorderTaskLists(activeListId, overListId)
      }
    }

    // Handle task reordering and nesting
    if (activeId.startsWith("task-")) {
      const taskId = activeId.replace("task-", "")
      const result = findTaskById(taskId)
      if (!result) return

      if (overId.startsWith("task-")) {
        const overTaskId = overId.replace("task-", "")
        const overResult = findTaskById(overTaskId)
        if (!overResult) return

        // If both tasks are in the same parent, reorder them
        if (result.listId === overResult.listId && result.parentId === overResult.parentId) {
          reorderTasks(taskId, overTaskId, result.listId, result.parentId)
        }
        // Otherwise, nest task under another task (make it a subtask)
        else if (result.listId === overResult.listId && !overResult.parentId) {
          nestTaskUnderTask(taskId, overTaskId, result.listId, result.parentId)
        }
      } else if (overId.startsWith("list-")) {
        const targetListId = overId.replace("list-", "")
        if (result.listId !== targetListId) {
          moveTaskBetweenLists(taskId, result.listId, targetListId, result.parentId)
        }
      }
    }
  }

  const reorderTaskLists = (activeListId: string, overListId: string) => {
    setTaskLists((prev) => {
      const activeIndex = prev.findIndex((list) => list.id === activeListId)
      const overIndex = prev.findIndex((list) => list.id === overListId)

      const newLists = [...prev]
      const [removed] = newLists.splice(activeIndex, 1)
      newLists.splice(overIndex, 0, removed)

      return newLists
    })
  }

  const reorderTasks = (activeTaskId: string, overTaskId: string, listId: string, parentId?: string) => {
    setTaskLists((prev) => {
      const newLists = [...prev]
      const list = newLists.find((l) => l.id === listId)
      if (!list) return prev

      if (parentId) {
        // Reorder subtasks
        const parentTask = findTaskInList(list, parentId)
        if (parentTask) {
          const activeIndex = parentTask.subtasks.findIndex((task) => task.id === activeTaskId)
          const overIndex = parentTask.subtasks.findIndex((task) => task.id === overTaskId)

          if (activeIndex !== -1 && overIndex !== -1) {
            const [removed] = parentTask.subtasks.splice(activeIndex, 1)
            parentTask.subtasks.splice(overIndex, 0, removed)
          }
        }
      } else {
        // Reorder main tasks
        const activeIndex = list.tasks.findIndex((task) => task.id === activeTaskId)
        const overIndex = list.tasks.findIndex((task) => task.id === overTaskId)

        if (activeIndex !== -1 && overIndex !== -1) {
          const [removed] = list.tasks.splice(activeIndex, 1)
          list.tasks.splice(overIndex, 0, removed)
        }
      }

      return newLists
    })
  }

  const findTaskInList = (list: TaskList, taskId: string): Task | null => {
    // Check main tasks
    const mainTask = list.tasks.find((task) => task.id === taskId)
    if (mainTask) return mainTask

    // Check subtasks recursively
    for (const task of list.tasks) {
      const result = findTaskInTaskSubtasks(task, taskId)
      if (result) return result
    }

    return null
  }

  const findTaskInTaskSubtasks = (task: Task, targetId: string): Task | null => {
    if (task.id === targetId) return task

    for (const subtask of task.subtasks) {
      const result = findTaskInTaskSubtasks(subtask, targetId)
      if (result) return result
    }

    return null
  }

  const moveTaskBetweenLists = (taskId: string, sourceListId: string, targetListId: string, parentId?: string) => {
    setTaskLists((prev) => {
      const newLists = [...prev]
      const sourceList = newLists.find((list) => list.id === sourceListId)
      const targetList = newLists.find((list) => list.id === targetListId)

      if (!sourceList || !targetList) return prev

      let taskToMove: Task | null = null

      if (parentId) {
        // Moving a subtask
        const parentTask = findTaskInList(sourceList, parentId)
        if (parentTask) {
          const subtaskIndex = parentTask.subtasks.findIndex((sub) => sub.id === taskId)
          if (subtaskIndex !== -1) {
            taskToMove = parentTask.subtasks.splice(subtaskIndex, 1)[0]
          }
        }
      } else {
        // Moving a main task
        const taskIndex = sourceList.tasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          taskToMove = sourceList.tasks.splice(taskIndex, 1)[0]
        }
      }

      if (taskToMove) {
        // Add to target list as main task
        targetList.tasks.push(taskToMove)
      }

      return newLists
    })
  }

  const nestTaskUnderTask = (taskId: string, parentTaskId: string, listId: string, currentParentId?: string) => {
    setTaskLists((prev) => {
      const newLists = [...prev]
      const list = newLists.find((l) => l.id === listId)
      if (!list) return prev

      let taskToNest: Task | null = null

      if (currentParentId) {
        // Moving from subtask to subtask
        const currentParent = findTaskInList(list, currentParentId)
        if (currentParent) {
          const subtaskIndex = currentParent.subtasks.findIndex((sub) => sub.id === taskId)
          if (subtaskIndex !== -1) {
            taskToNest = currentParent.subtasks.splice(subtaskIndex, 1)[0]
          }
        }
      } else {
        // Moving from main task to subtask
        const taskIndex = list.tasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          taskToNest = list.tasks.splice(taskIndex, 1)[0]
        }
      }

      if (taskToNest) {
        const parentTask = findTaskInList(list, parentTaskId)
        if (parentTask) {
          parentTask.subtasks.push(taskToNest)
        }
      }

      return newLists
    })
  }

  const addTask = (listId: string, title: string, parentId?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      notes: "",
      subtasks: [],
    }

    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          if (parentId) {
            // Add as subtask
            return {
              ...list,
              tasks: list.tasks.map((task) => {
                const targetTask = findTaskInTaskSubtasks(task, parentId)
                if (targetTask) {
                  targetTask.subtasks.push(newTask)
                }
                return task
              }),
            }
          } else {
            // Add as main task
            return { ...list, tasks: [...list.tasks, newTask] }
          }
        }
        return list
      }),
    )
  }

  const toggleTask = (listId: string, taskId: string, parentId?: string) => {
    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              const targetTask = findTaskInTaskSubtasks(task, taskId)
              if (targetTask) {
                targetTask.completed = !targetTask.completed
              }
              return task
            }),
          }
        }
        return list
      }),
    )
  }

  const updateTask = (listId: string, taskId: string, updates: Partial<Task>, parentId?: string) => {
    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              const targetTask = findTaskInTaskSubtasks(task, taskId)
              if (targetTask) {
                Object.assign(targetTask, updates)
              }
              return task
            }),
          }
        }
        return list
      }),
    )
  }

  const deleteTask = (listId: string, taskId: string, parentId?: string) => {
    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          if (parentId) {
            return {
              ...list,
              tasks: list.tasks.map((task) => {
                const parentTask = findTaskInTaskSubtasks(task, parentId)
                if (parentTask) {
                  parentTask.subtasks = parentTask.subtasks.filter((subtask) => subtask.id !== taskId)
                }
                return task
              }),
            }
          } else {
            return { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }
          }
        }
        return list
      }),
    )
  }

  const addTaskList = (name: string) => {
    const newList: TaskList = {
      id: Date.now().toString(),
      name,
      tasks: [],
    }
    setTaskLists((prev) => [...prev, newList])
  }

  const updateTaskListName = (listId: string, name: string) => {
    setTaskLists((prev) => prev.map((list) => (list.id === listId ? { ...list, name } : list)))
  }

  const deleteTaskList = (listId: string) => {
    setTaskLists((prev) => prev.filter((list) => list.id !== listId))
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <TaskHeader onAddList={addTaskList} viewMode={viewMode} onViewModeChange={setViewMode} />
      <div className="flex-1 overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {viewMode === "list" ? (
            <div className="flex items-start gap-6 p-6 min-w-max h-full overflow-x-auto">
              <SortableContext
                items={taskLists.map((list) => `list-${list.id}`)}
                strategy={horizontalListSortingStrategy}
              >
                {taskLists.map((taskList) => (
                  <TaskColumn
                    key={taskList.id}
                    taskList={taskList}
                    onAddTask={(title, parentId) => addTask(taskList.id, title, parentId)}
                    onToggleTask={(taskId, parentId) => toggleTask(taskList.id, taskId, parentId)}
                    onUpdateTask={(taskId, updates, parentId) => updateTask(taskList.id, taskId, updates, parentId)}
                    onDeleteTask={(taskId, parentId) => deleteTask(taskList.id, taskId, parentId)}
                    onUpdateListName={(name) => updateTaskListName(taskList.id, name)}
                    onDeleteList={() => deleteTaskList(taskList.id)}
                  />
                ))}
              </SortableContext>
            </div>
          ) : (
            <div className="p-6">
              <SortableContext items={taskLists.map((list) => `list-${list.id}`)} strategy={rectSortingStrategy}>
                <TaskGrid
                  taskLists={taskLists}
                  onAddTask={addTask}
                  onToggleTask={toggleTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onUpdateListName={updateTaskListName}
                  onDeleteList={deleteTaskList}
                />
              </SortableContext>
            </div>
          )}

          <DragOverlay>
            {activeTask && (
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg opacity-90 max-w-64">
                <div className="text-sm font-medium truncate">{activeTask.title}</div>
                {activeTask.notes && <div className="text-xs text-gray-500 mt-1 truncate">{activeTask.notes}</div>}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
