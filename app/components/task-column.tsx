"use client";

import type React from "react";
import { useContext, useState } from "react";
import { Plus, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TaskList, Task } from "../../types/types";
import { TaskItem } from "./task-item";
import { tasklistContext } from "../context/tasklist-context";

interface TaskColumnProps {
  tasklist: TaskList;
  onAddTask: (title: string, parentId?: string) => void;
  onToggleTask: (taskId: string, parentId?: string) => void;
  onUpdateTask: (
    taskId: string,
    updates: Partial<Task>,
    parentId?: string
  ) => void;
  onDeleteTask: (taskId: string, parentId?: string) => void;
  onUpdateListName: (name: string) => void;
  onDeleteList: () => void;
}

export function TaskColumn({ tasklist }: TaskColumnProps) {
  const { addTask, updateTaskListName, deleteTaskList } =
    useContext(tasklistContext);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingListName, setEditingListName] = useState(false);
  const [listNameValue, setListNameValue] = useState(tasklist.title);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask(tasklist.id, newTaskTitle);
      setNewTaskTitle("");
    }
  };

  const saveListName = () => {
    if (listNameValue.trim()) {
      updateTaskListName(tasklist.id, newTaskTitle.trim());
    }
    setEditingListName(false);
  };

  const cancelListNameEdit = () => {
    setListNameValue(tasklist.title);
    setEditingListName(false);
  };

  // const incompleteTasks = tasklist.tasks.filter((task) => !task.completedAt);
  // const completedTasks = tasklist.tasks.filter((task) => task.completedAt);

  return (
    <div
      ref={(node) => {}}
      className="w-80 bg-gray-50 rounded-lg border border-gray-200 flex flex-col"
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg cursor-grab active:cursor-grabbing">
        <div className="flex items-center justify-between">
          {editingListName ? (
            <Input
              value={listNameValue}
              onChange={(e) => setListNameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveListName();
                if (e.key === "Escape") cancelListNameEdit();
              }}
              onBlur={saveListName}
              className="text-lg font-medium border-none shadow-none p-0 h-auto focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <h3
              className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setEditingListName(true)}
            >
              {tasklist.title}
            </h3>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingListName(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Rename list
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  deleteTaskList(tasklist.id);
                }}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete list
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <p className="text-sm text-gray-500 mt-1">
          {incompleteTasks.length} of {tasklist.tasks.length} tasks
        </p> */}
      </div>

      {/* Add Task */}
      <div className="p-4 border-b border-gray-100 bg-white">
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
        {tasklist.tasks.map(
          (task) =>
            !task.completedAt && (
              <TaskItem key={task.id} task={task} listId={tasklist.id} />
            )
        )}

        {/* Completed Tasks */}
        <div className="mt-6">
          <div className="text-xs font-medium text-gray-500 mb-2 px-1">
            Completed
            {/* ({tasklist.completedTasks.length}) */}
          </div>
          {tasklist.tasks.map(
            (task) =>
              task.completedAt && (
                <TaskItem key={task.id} task={task} listId={tasklist.id} />
              )
          )}
        </div>

        {tasklist.tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm mb-1">No tasks yet</div>
            <div className="text-xs">Add a task above to get started</div>
          </div>
        )}
      </div>
    </div>
  );
}
