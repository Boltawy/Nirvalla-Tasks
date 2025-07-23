"use client";

import { TaskColumn } from "./TasklistColumn";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import type { TaskList, Task } from "../../types";
import axios from "axios";
import { tasklistContext } from "../context/TasklistContext";
import { Button } from "@/app/global-components/ui/button";
import { Plus } from "lucide-react";
import { baseUrl } from "../constants";
import { UserContext } from "../context/UserContext";
import Image from "next/image";
import NoWrap from "./NoWrap";
import { interFont } from "../layout";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { list } from "postcss";
import { TaskItem } from "./TaskItem";
import { toast } from "sonner";
import { useDraggable } from "react-use-draggable-scroll";

export default function TaskListArea() {
  const { token, userIsLoading } = useContext(UserContext);
  const [activeTasklist, setActiveTasklist] = useState<TaskList | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // const [dragOverCount, setDragOverCount] = useState<number>(0);

  const {
    tasklists,
    setTaskLists,
    addTaskList,
    updateTaskListName,
    deleteTaskList,
    updateTask,
  } = useContext(tasklistContext);

  const [isFetching, setIsFetching] = useState(false);
  const tasklistIds = useMemo(
    () => tasklists.map((tasklist: TaskList) => tasklist._id),
    [tasklists]
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "tasklist") {
      setActiveTasklist(event.active.data.current?.tasklist || null);
    }
    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current?.task || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    //TODO Could use refactoring for readability.
    const isDraggedATask = event.active.data.current?.type === "task";
    const draggedTask: Task = event.active.data.current?.task;
    const isDraggedATasklist = event.active.data.current?.type === "tasklist";
    const isOverATasklist = event.over?.data.current?.type === "tasklist";
    const activeTasklistId = event.active.id;
    const overTasklistId = event.over?.id;
    const isOverATask = event.over?.data.current?.type === "task";
    const overTask: Task = event.over?.data.current?.task;
    const isDraggedIsInbox = event.active.data.current?.tasklist?.isDefault;
    const isOverInbox = event.over?.data?.current?.tasklist?.isDefault;

    setActiveTask(null);
    setActiveTasklist(null);

    if (isDraggedATasklist) {
      if (!isOverATasklist) return;
      if (activeTasklistId == overTasklistId) return;
      if (isDraggedIsInbox)
        return toast.error("Inbox tasklist cannot be repositioned.");
      if (isOverInbox)
        return toast.error("Inbox tasklist cannot be repositioned.");

      const oldIndex = tasklistIds.indexOf(activeTasklistId as string);
      const newIndex = tasklistIds.indexOf(overTasklistId as string);
      const newTaskLists = structuredClone(tasklists);
      const [movedTaskList] = newTaskLists.splice(oldIndex, 1);
      newTaskLists.splice(newIndex, 0, movedTaskList);
      setTaskLists(newTaskLists);
      // setDragOverCount(0);
      return localStorage.setItem("tasklists", JSON.stringify(newTaskLists)); //? When should I save to local storage
    }

    if (isDraggedATask && isOverATask) {
      if (!overTask) return;
      if (draggedTask._id == overTask._id) return;
      if (draggedTask.tasklistId != overTask.tasklistId) return;

      const listId = draggedTask.tasklistId;
      const tasklist = tasklists.find((list) => list._id == listId);
      const tasks = tasklist?.tasks;
      const draggedTaskIndex = tasks.findIndex(
        (task) => task._id === draggedTask._id
      );
      const overIndex = tasks.findIndex((task) => task._id === overTask._id);
      const newTaskLists: TaskList[] = structuredClone(tasklists);

      const activeTasklist = newTaskLists.find((list) => list._id === listId);
      const removedTask = activeTasklist?.tasks.splice(draggedTaskIndex, 1)[0];
      if (!removedTask) return;
      activeTasklist?.tasks.splice(overIndex, 0, removedTask);

      // newTaskLists = newTaskLists.map((list: TaskList) => {
      //   if (list._id === listId) {
      //     const removedTask =list.tasks.splice(draggedTaskIndex, 1)[0];
      //     if (!removedTask) return;
      //     list.tasks.splice(overIndex, 0, tasks[draggedTaskIndex]);
      //     return list;
      //   }
      //   return list;
      // });

      setTaskLists(newTaskLists);
      // setDragOverCount(0);
      // console.log("Dragged a task over a task")
      return localStorage.setItem("tasklists", JSON.stringify(newTaskLists)); //? When should I save to local storage
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    //TODO Could use refactoring for readability.
    // setDragOverCount((prev) => prev + 1);
    // console.log(dragOverCount);
    // if (dragOverCount > 10) return;
    const isDraggedATask = event.active?.data.current?.type === "task";
    const isOverATask = event.over?.data.current?.type === "task";
    const isDraggedATasklist = event.active?.data.current?.type === "tasklist";
    const isOverATasklist = event.over?.data.current?.type === "tasklist";

    if (isDraggedATasklist) return;

    if (isDraggedATask && isOverATask) {
      const activeTaskTasklistId = event.active.data.current?.task.tasklistId;
      const overTasklistId = event.over.data.current?.task.tasklistId;
      const draggedTask: Task = event.active.data.current?.task;
      const overTask: Task = event.over.data.current?.task;

      if (activeTaskTasklistId == overTasklistId) return;
      if (draggedTask._id == overTask._id) return;

      const newTaskLists = structuredClone(tasklists);
      const draggedTaskList = newTaskLists.find(
        (list) => list._id === activeTaskTasklistId
      );
      const overTaskList = newTaskLists.find(
        (list) => list._id === overTasklistId
      );
      const removedTaskArray = draggedTaskList?.tasks.splice(
        draggedTaskList.tasks.findIndex((task) => task._id === draggedTask._id),
        1
      );
      const removedTask = removedTaskArray?.[0];
      if (!removedTask || removedTask._id != draggedTask._id)
        return console.log("prevented a duplicate key error :D");

      draggedTask.tasklistId = overTasklistId;
      overTaskList?.tasks.push(draggedTask);
      setTimeout(() => {
        setTaskLists(newTaskLists);
      }, 0);
      return;
    }

    if (isDraggedATask && isOverATasklist) {
      //TODO Abstract by implementin findTasklistById
      const overTasklistId: string = event.over.data.current?.tasklist._id;
      const tempOverTaskList: TaskList = tasklists.find(
        (list) => list._id === overTasklistId
      );

      const tasklistHasTasks: boolean = tempOverTaskList.tasks.length > 0;
      if (tasklistHasTasks) return;

      const newTaskLists = structuredClone(tasklists);

      const draggedTask: Task = event.active.data.current?.task;
      const activeTaskTasklistId = event.active.data.current?.task.tasklistId;
      const activeTaskTasklist = newTaskLists.find(
        (list) => list._id === activeTaskTasklistId
      );
      const overTaskList: TaskList = newTaskLists.find(
        (list) => list._id === overTasklistId
      );

      const draggedTaskIndex = activeTaskTasklist.tasks.findIndex(
        (task) => task._id == draggedTask._id
      );

      const removedTaskArray = activeTaskTasklist.tasks.splice(draggedTaskIndex, 1);
      const removedTask = removedTaskArray?.[0];
      if (!removedTask || removedTask._id != draggedTask._id)
        return console.log("prevented a duplicate key error :D");
      draggedTask.tasklistId = overTasklistId;
      overTaskList.tasks.push(draggedTask);
      setTaskLists(newTaskLists);
    }
  };

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 320,
        tolerance: 10,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const {
        data: { data },
      } = await axios.get(`${baseUrl}/sync`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const lists = data.populatedLists;
      setTaskLists(lists);
      localStorage.setItem("tasklists", JSON.stringify(lists));
    } catch (err) {
      //TODO handle error on error fetching
      console.error("Failed to fetch tasks", err);
    } finally {
      setIsFetching(false);
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const { events } = useDraggable(scrollRef, {
    isMounted: !!scrollRef.current,
    applyRubberBandEffect: true,
  });
  useEffect(() => {
    if (token && !userIsLoading) fetchData();
    else {
      const savedTaskLists = localStorage.getItem("tasklists");
      if (savedTaskLists) {
        setTaskLists(JSON.parse(savedTaskLists));
      }
    }
  }, [userIsLoading]);

  return (
    <>
      {userIsLoading || isFetching ? (
        <div className="relative w-full h-screen flex flex-col justify-center gap-2 px-8 items-center overflow-hidden bg-gray-100">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <SortableContext
              items={tasklistIds}
              strategy={horizontalListSortingStrategy}
            >
              {tasklists.length > 0 ? (
                <>
                  <div
                    className=" h-screen bg-gray-100 flex flex-col flex-1 overflow-auto"
                    ref={scrollRef}
                    {...events}
                  >
                    <div className="flex items-start gap-6 p-6 pt-24 min-w-max h-full overflow-x-auto select-none">
                      {tasklists.map((tasklist: TaskList) => (
                        <TaskColumn key={tasklist._id} tasklist={tasklist} />
                      ))}
                      <Button variant="outline" onClick={() => addTaskList()}>
                        <Plus />
                        Add tasklist
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-full h-screen flex flex-col justify-center gap-2 px-8 items-center overflow-hidden bg-gray-100">
                    <Image
                      src="/Task-bro.svg"
                      className="opacity-80"
                      alt="nirvalla logo"
                      width={400}
                      height={400}
                    />
                    <h3
                      className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl pb-1 text-gray-700 text-center"
                      // style={{ fontFamily: interFont.style.fontFamily }}
                    >
                      Welcome to <NoWrap className="">Nirvalla Tasks</NoWrap>
                    </h3>
                    <h4 className="pb-6 text-gray-600">
                      Start organizing your life by creating your first
                      Tasklist.
                    </h4>{" "}
                    <Button
                      variant="medieum"
                      size="lg"
                      onClick={() => addTaskList({ isDefault: true })} //TODO assign list as default, Need to change context handler
                    >
                      <Plus />
                      Add tasklist
                    </Button>
                    <a
                      href="https://storyset.com/work"
                      className="absolute bottom-5 right-5 text-gray-300 hidden md:block"
                    >
                      illustration by Storyset
                    </a>
                  </div>
                </>
              )}
              {createPortal(
                <DragOverlay>
                  {activeTasklist && (
                    <TaskColumn
                      tasklist={activeTasklist}
                      // className={"opacity-50"}
                    />
                  )}
                  {activeTask && (
                    <TaskItem
                      task={activeTask}
                      listId={activeTask.tasklistId}
                      // className={"opacity-50"}
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
            </SortableContext>
          </DndContext>
        </>
      )}
    </>
  );
}
