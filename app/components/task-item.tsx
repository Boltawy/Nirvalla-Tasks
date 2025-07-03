"use client"

import type React from "react"
import { useState } from "react"
import { Plus, MoreVertical, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"
import type { Task } from "./task-column"

interface TaskItemProps {
  task: Task
  listId: string
  parentId?: string
  onToggleTask: (taskId: string, parentId?: string) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>, parentId?: string) => void
  onDeleteTask: (taskId: string, parentId?: string) => void
  onAddTask: (title: string, parentId?: string) => void
  isCompleted?: boolean
  depth?: number
  compact?: boolean
}

export function TaskItem({
  task,
  listId,
  parentId,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  isCompleted = false,
  depth = 0,
  compact = false,
}: TaskItemProps) {
  const [editingTask, setEditingTask] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editNotes, setEditNotes] = useState(task.notes)
  const [isExpanded, setIsExpanded] = useState(true)
  const [addingSubtask, setAddingSubtask] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${task.id}`,
  })

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `task-${task.id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const startEditing = () => {
    setEditingTask(true)
    setEditTitle(task.title)
    setEditNotes(task.notes)
  }

  const saveEdit = () => {
    onUpdateTask(
      task
    )
    setEditingTask(false)
  }

  const cancelEdit = () => {
    setEditingTask(false)
    setEditTitle(task.title)
    setEditNotes(task.notes)
  }

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAddTask(newSubtaskTitle.trim(), task.id)
      setNewSubtaskTitle("")
      setAddingSubtask(false)
      setIsExpanded(true)
    }
  }

  const handleSubtaskKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSubtask()
    } else if (e.key === "Escape") {
      setAddingSubtask(false)
      setNewSubtaskTitle("")
    }
  }

  const hasSubtasks = task.subtasks && task.subtasks.length > 0

  return (
    <div className={cn("space-y-1", depth > 0 && "ml-4")}>
      <div
        ref={(node) => {
          setSortableRef(node)
          setDroppableRef(node)
        }}
        style={style}
        className={cn(
          "group transition-all duration-200",
          isOver && !isDragging && "ring-2 ring-blue-300 ring-opacity-50",
          isCompleted && "opacity-60",
        )}
      >
        {editingTask ? (
          <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mb-2 border-none shadow-none bg-transparent p-0 text-sm focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit()
                if (e.key === "Escape") cancelEdit()
              }}
              autoFocus
            />
            {!compact && (
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes"
                className="border-none shadow-none bg-transparent p-0 text-xs resize-none focus-visible:ring-0"
                rows={2}
              />
            )}
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={saveEdit}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "bg-white p-2 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-grab active:cursor-grabbing",
              isOver && !isDragging && "border-blue-300 bg-blue-50",
              compact && "p-2",
            )}
            {...attributes}
            {...listeners}
          >
            <div className="flex items-start gap-2">
              <div className="flex items-center gap-1 flex-shrink-0">
                {hasSubtasks && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsExpanded(!isExpanded)
                    }}
                  >
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </Button>
                )}
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(task.id, parentId)}
                  className="flex-shrink-0"
                />
              </div>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={startEditing}>
                <div className={cn("text-sm", task.completed && "line-through text-gray-500", compact && "text-xs")}>
                  {task.title}
                </div>
                {task.notes && !compact && <div className="text-xs text-gray-500 mt-1">{task.notes}</div>}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={startEditing}>Edit task</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAddingSubtask(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add subtask
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteTask(task.id, parentId)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Add Subtask Input */}
      {addingSubtask && (
        <div className={cn("p-2 border border-gray-200 rounded-lg bg-gray-50", depth > 0 ? "ml-4" : "ml-6")}>
          <div className="flex items-center gap-2">
            <Plus className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <Input
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={handleSubtaskKeyPress}
              onBlur={() => {
                if (!newSubtaskTitle.trim()) {
                  setAddingSubtask(false)
                }
              }}
              placeholder="Add a subtask"
              className="border-none shadow-none text-xs placeholder:text-gray-400 focus-visible:ring-0 px-0 h-6"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Subtasks */}
      {hasSubtasks && isExpanded && (
        <div className="space-y-1">
          <SortableContext items={task.subtasks.map((sub) => `task-${sub.id}`)} strategy={verticalListSortingStrategy}>
            {task.subtasks.map((subtask) => (
              <TaskItem
                key={subtask.id}
                task={subtask}
                listId={listId}
                parentId={task.id}
                onToggleTask={onToggleTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onAddTask={onAddTask}
                isCompleted={subtask.completed}
                depth={depth + 1}
                compact={compact}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  )
}
