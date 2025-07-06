"use client"

import type React from "react"
import { useState } from "react"
import { Plus, MoreVertical, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDroppable } from "@dnd-kit/core"
import { TaskItem } from "./task-item"
import { cn } from "@/lib/utils"
import { TaskList } from "./task-sidebar"

interface TaskGridCardProps {
  taskList: TaskList
  onAddTask: (title: string, parentId?: string) => void
  onToggleTask: (taskId: string, parentId?: string) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>, parentId?: string) => void
  onDeleteTask: (taskId: string, parentId?: string) => void
  onUpdateListName: (name: string) => void
  onDeleteList: () => void
}

export function TaskGridCard({
  taskList,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateListName,
  onDeleteList,
}: TaskGridCardProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [editingListName, setEditingListName] = useState(false)
  const [listNameValue, setListNameValue] = useState(taskList.name)

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `list-${taskList.id}`,
  })

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `list-${taskList.id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim())
      setNewTaskTitle("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  const saveListName = () => {
    if (listNameValue.trim()) {
      onUpdateListName(listNameValue.trim())
    }
    setEditingListName(false)
  }

  const cancelListNameEdit = () => {
    setListNameValue(taskList.name)
    setEditingListName(false)
  }

  const incompleteTasks = taskList.tasks.filter((task) => !task.completed)
  const completedTasks = taskList.tasks.filter((task) => task.completed)

  return (
    <div
      ref={(node) => {
        setSortableRef(node)
        setDroppableRef(node)
      }}
      style={style}
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col min-h-[300px] max-h-[600px]",
        isOver && !isDragging && "ring-2 ring-blue-300 ring-opacity-50 border-blue-300",
      )}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <div className="flex items-center justify-between">
          {editingListName ? (
            <Input
              value={listNameValue}
              onChange={(e) => setListNameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveListName()
                if (e.key === "Escape") cancelListNameEdit()
              }}
              onBlur={saveListName}
              className="text-lg font-medium border-none shadow-none p-0 h-auto focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <h3
              className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 truncate"
              onClick={() => setEditingListName(true)}
            >
              {taskList.name}
            </h3>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingListName(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Rename list
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteList} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete list
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {incompleteTasks.length} of {taskList.tasks.length} tasks
        </p>
      </div>

      {/* Add Task */}
      <div className="p-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a task"
            className="border-none shadow-none text-sm placeholder:text-gray-400 focus-visible:ring-0 px-0"
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Incomplete Tasks */}
        {incompleteTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            listId={taskList.id}
            onToggleTask={onToggleTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
            compact
          />
        ))}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-medium text-gray-500 mb-2 px-1">Completed ({completedTasks.length})</div>
            {completedTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                listId={taskList.id}
                onToggleTask={onToggleTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onAddTask={onAddTask}
                isCompleted
                compact
              />
            ))}
          </div>
        )}

        {taskList.tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm mb-1">No tasks yet</div>
            <div className="text-xs">Add a task above to get started</div>
          </div>
        )}
      </div>
    </div>
  )
}
