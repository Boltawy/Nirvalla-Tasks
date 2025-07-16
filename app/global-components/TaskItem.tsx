"use client";

import type React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/app/global-components/ui/button";
import { Input } from "@/app/global-components/ui/input";
import { Textarea } from "@/app/global-components/ui/textarea";
import { Checkbox } from "@/app/global-components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/global-components/ui/dropdown-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import type { Task } from "../../types";
import { tasklistContext } from "../context/TasklistContext";

interface TaskItemProps {
  task: Task;
  listId: string;
  parentId?: string;
  depth?: number;
  compact?: boolean;
  canPlaySound?: boolean;
  setCanPlaySound?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export function TaskItem({
  task,
  listId,
  parentId,
  depth = 0,
  compact = false,
  canPlaySound,
  setCanPlaySound,
  className,
}: TaskItemProps) {
  const { toggleTask, updateTask, deleteTask } = useContext(tasklistContext);
  const audioRef = useRef(null);
  const audioRef2 = useRef(null);
  const checkSounds = [audioRef, audioRef2];

  const [editingTask, setEditingTask] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const startEditing = () => {
    setEditingTask(true);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    setEditingTask(false);
    updateTask(listId, task, { title: editTitle });
  };

  const cancelEdit = () => {
    setEditingTask(false);
    setEditTitle(task.title);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task,
    } as { type: "task"; task: Task },
    disabled: Boolean(task.completedAt),
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleCheckTask = () => {
    setCanPlaySound(true);
    toggleTask(task, listId);
  };
  useEffect(() => {
    if (task.completedAt && canPlaySound) {
      audioRef.current.volume = 0.3;
      audioRef2.current.volume = 0.3;
      const selectedSound = Math.floor(Math.random() * checkSounds.length);
      checkSounds[selectedSound].current.play();
    }
  }, []);

  return (
    <div className={cn("space-y-1", depth > 0 && "ml-4")}>
      <audio ref={audioRef} src="/task-check.mp3" preload="auto" />
      <audio ref={audioRef2} src="/task-check2.mp3" preload="auto" />
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        className={cn(
          "group transition-all duration-200 touch-none ",
          task.completedAt !== null ? "opacity-60" : " " + className
          // isDragging ? "border-2 border-blue-600/50 rounded-lg" : ""
        )}
      >
        <>
          {editingTask ? (
            // Task Edit Input
            <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mb-2 border-none shadow-none bg-transparent p-0 text-sm focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                autoFocus
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
            <>
              {isDragging ? (
                // Drag overlay
                <div
                  className={
                    "h-9 hover:shadow-sm border-2 rounded-lg border-blue-500 cursor-grab active:cursor-grabbing"
                  }
                ></div>
              ) : (
                // Task Item
                <div
                  className={
                    //TODOTEST Removed cn(), Might cause errors
                    "bg-white p-2 rounded-lg border border-gray-200 hover:shadow-sm hover:border-gray-400/50 transition-shadow cursor-grab active:cursor-grabbing"
                  }
                >
                  <div className={"flex items-start gap-2"}>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Checkbox
                        checked={task.completedAt !== null}
                        onCheckedChange={() => handleCheckTask()}
                        className="flex-shrink-0"
                      />
                    </div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={startEditing}
                    >
                      <div
                        className={cn(
                          "text-sm",
                          task.completedAt && "line-through text-gray-500",
                          compact && "text-xs"
                        )}
                      >
                        {task.title}
                      </div>
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
                        <DropdownMenuItem onClick={startEditing}>
                          Edit task
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteTask(listId, task._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
}
