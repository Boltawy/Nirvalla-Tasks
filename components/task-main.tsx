"use client";

import type React from "react";

import { useState } from "react";
import { Plus, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TaskList, Task } from "../types/types";
import { cn } from "@/lib/utils";

interface TaskMainProps {
  tasklist?: TaskList;
  onAddTask: (title: string) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskMain({
  tasklist,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}: TaskMainProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (editingTask) {
      onUpdateTask(editingTask, {
        title: editTitle.trim() || "Untitled task",
        // notes: editNotes,
      });
      setEditingTask(null);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditNotes("");
  };

  if (!tasklist) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a task list to get started
      </div>
    );
  }

  const incompleteTasks = tasklist.tasks.filter((task) => !task.completedAt);
  const completedTasks = tasklist.tasks.filter((task) => task.completedAt);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-medium text-gray-900">{tasklist.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {incompleteTasks.length} of {tasklist.tasks.length} tasks remaining
        </p>
      </div>

      {/* Add Task */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Plus className="h-5 w-5 text-gray-400" />
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a task"
            className="border-none shadow-none text-base placeholder:text-gray-400 focus-visible:ring-0 px-0"
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-1">
          {/* Incomplete Tasks */}
          {incompleteTasks.map((task) => (
            <div key={task.id} className="group">
              {editingTask === task.id ? (
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mb-2 border-none shadow-none bg-transparent p-0 text-base focus-visible:ring-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes"
                    className="border-none shadow-none bg-transparent p-0 text-sm resize-none focus-visible:ring-0"
                    rows={2}
                  />
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
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 group">
                  <Checkbox
                    checked={task.completedAt ? true : false}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className="mt-0.5"
                  />
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => startEditing(task)}
                  >
                    <div
                      className={cn(
                        "text-base",
                        task.completedAt && "line-through text-gray-500"
                      )}
                    >
                      {task.title}
                    </div>
                    {/* {task.notes && <div className="text-sm text-gray-500 mt-1">{task.notes}</div>} */}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEditing(task)}>
                        Edit task
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteTask(task.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="mt-8">
              <div className="text-sm font-medium text-gray-500 mb-3 px-3">
                Completed ({completedTasks.length})
              </div>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 group opacity-60"
                >
                  <Checkbox
                    checked={task.completedAt ? true : false}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-base line-through text-gray-500">
                      {task.title}
                    </div>
                    {/* { G */}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDeleteTask(task.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}

          {tasklist.tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg mb-2">No tasks yet</div>
              <div className="text-sm">Add a task above to get started</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
