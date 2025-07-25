"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  Pin,
  GripVertical,
} from "lucide-react";
import { Button } from "@/app/global-components/ui/button";
import { Input } from "@/app/global-components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/global-components/ui/dropdown-menu";
import type { TaskList, Task } from "../../types";
import { TaskItem } from "./TaskItem";
import { tasklistContext } from "../context/TasklistContext";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskColumnProps {
  tasklist: TaskList;
  className?: string;
}

export function TaskColumn({ tasklist, className }: TaskColumnProps) {
  const { addTask, updateTaskListName, deleteTaskList } =
    useContext(tasklistContext);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingListName, setEditingListName] = useState(false);
  const [listNameValue, setListNameValue] = useState(tasklist.title);
  const [canPlaySound, setCanPlaySound] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTaskTitle.trim() !== "") {
      addTask(tasklist._id, newTaskTitle);
      setNewTaskTitle("");
    }
  };

  const saveListName = () => {
    setEditingListName(false);
    updateTaskListName(tasklist._id, listNameValue);
  };

  const cancelListNameEdit = () => {
    setListNameValue(tasklist.title);
    setEditingListName(false);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: tasklist._id,
    data: {
      type: "tasklist",
      tasklist,
    },
    disabled: tasklist.isDefault,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      {!isDragging ? (
        <div
          ref={setNodeRef}
          style={style}
          onMouseDown={(e) => e.stopPropagation()}
          className={
            "w-80 max-h-[calc(100vh-10rem)] bg-gray-50 rounded-lg border border-gray-200 flex flex-col cursor-auto " +
            (className ? className : "")
          }
        >
          {/* Column Header */}
          <div
            {...attributes}
            {...listeners}
            className={
              "p-4 border-b border-gray-200 bg-white rounded-t-lg flex justify-between items-center gap-2 touch-none " +
              (tasklist.isDefault
                ? "cursor-auto"
                : "cursor-grab active:cursor-grabbing")
            }
          >
            <div className="flex items-center gap-2">
              {tasklist.isDefault ? (
                <Pin size={14} className="rotate-45" />
              ) : (
                <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
              )}
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
                  className="text-lg font-medium text-gray-900 hover:text-blue-600"
                  onClick={() => {
                    if (!tasklist.isDefault) setEditingListName(true);
                  }}
                >
                  {tasklist.title}
                </h3>
              )}
            </div>

            <div className="flex">
              {!tasklist.isDefault && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4">
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
                        deleteTaskList(tasklist._id);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete list
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                enterKeyHint="enter"
                onKeyDown={handleKeyPress}
                placeholder="Add a task"
                className="px-4 py-2 border-none shadow-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
              />
            </div>
          </div>
          {/* Tasks */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Incomplete Tasks */}
            <SortableContext
              items={
                tasklist.tasks.length > 0
                  ? tasklist.tasks.map((task) => task._id)
                  : []
              }
              strategy={verticalListSortingStrategy}
            >
              {tasklist.tasks.map(
                (task) =>
                  !task.completedAt && (
                    <TaskItem
                      key={task._id}
                      task={task}
                      listId={tasklist._id}
                      canPlaySound={canPlaySound}
                      setCanPlaySound={setCanPlaySound}
                    />
                  )
              )}
            </SortableContext>

            {/* Completed Tasks */}
            <div className="mt-6">
              <div className="text-xs font-medium text-gray-500 mb-2 px-1">
                {/* ({tasklist.completedTasks.length}) */}
              </div>
              {tasklist.tasks.length > 0 &&
                tasklist.tasks.map(
                  (task) =>
                    task.completedAt && (
                      <TaskItem
                        key={task._id}
                        task={task}
                        listId={tasklist._id}
                        canPlaySound={canPlaySound}
                        setCanPlaySound={setCanPlaySound}
                      />
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
      ) : (
        <div
          style={style}
          ref={setNodeRef}
          className="w-80 h-[calc(100vh-10rem)] border-r-4 border-blue-500 flex flex-col"
        ></div>
      )}
    </>
  );
}
