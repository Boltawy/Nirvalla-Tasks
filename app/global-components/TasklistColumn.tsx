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
import ClientCard from "./ClientCard";

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

  const [clients, setClients] = useState([
    {
      _id: "1",
      name: "John Doe",
      tier: "Gold",
      email: "janedoe@example.com",
      phone: "+2011000191986",
      address: "New Cairo",
      profit: 350,
      children: 35,
    },
    {
      _id: "2",
      name: "Bob Smith",
      email: "bobsmith@example.com",
      tier: "Silver",
      phone: "+2011000191986",
      address: "Alexandria",
      profit: 600,
      children: 35,
    },
    {
      _id: "3",
      name: "Alice Johnson",
      email: "alicejohnson@example.com",
      tier: "Bronze",
      phone: "+2011000191986",
      address: "Cairo",
      profit: 1200,
      children: 35,
    },
  ]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== "") {
      addTask(tasklist._id, newTaskTitle);
      setNewTaskTitle("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      handleAddTask();
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
            "max-h-[calc(100vh-10rem)] bg-gray-50 rounded-lg border border-gray-200 flex flex-col cursor-auto " +
            (className ? className : "")
          }
        >
          {/* Column Header */}
          <div
            {...attributes}
            {...listeners}
            className={
              "p-4 border-b border-gray-200 bg-white rounded-t-lg flex justify-between items-center gap-2 touch-none" +
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
                  className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
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

          {/* Tasks */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 remove-scrollbar">
            {/* Incomplete Tasks */}
            <SortableContext
              items={
                clients.length > 0 ? clients.map((client) => client._id) : []
              }
              strategy={verticalListSortingStrategy}
            >
              {clients.map((client) => (
                <ClientCard client={client} />
              ))}
            </SortableContext>
          </div>
        </div>
      ) : (
        <div
          style={style}
          ref={setNodeRef}
          className="w-80 h-[calc(100vh-10rem)] flex flex-col"
        ></div>
      )}
    </>
  );
}
