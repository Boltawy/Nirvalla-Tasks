"use client";

import { TaskColumn } from "./TasklistColumn";
import { useContext, useEffect, useMemo, useState } from "react";
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
  PointerSensor,
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

export default function TaskListArea() {
  const { token, userName, userIsLoading } = useContext(UserContext);
  const [activeTasklist, setActiveTasklist] = useState<TaskList | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const {
    taskLists,
    setTaskLists,
    addTaskList,
    updateTaskListName,
    deleteTaskList,
    updateTask,
  } = useContext(tasklistContext);

  const [isFetching, setIsFetching] = useState(false);
  const tasklistIds = useMemo(
    () => taskLists.map((tasklist: TaskList) => tasklist._id),
    [taskLists]
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
    const isDraggedATask = event.active.data.current?.type === "task";
    const isDraggedATasklist = event.active.data.current?.type === "tasklist";
    const isOverATasklist = event.over?.data.current?.type === "tasklist";
    const isOverATask = event.over?.data.current?.type === "task";
    if (isDraggedATasklist) {
      setActiveTasklist(null);
      const { active, over } = event;
      if (!over) return;
      if (over.data.current?.tasklist.isDefault === true) return;

      if (active.id !== over.id) {
        const oldIndex = tasklistIds.indexOf(active.id as string);
        const newIndex = tasklistIds.indexOf(over.id as string);
        const newTaskLists = structuredClone(taskLists);
        const [movedTaskList] = newTaskLists.splice(oldIndex, 1);
        newTaskLists.splice(newIndex, 0, movedTaskList);
        setTaskLists(newTaskLists);
        return localStorage.setItem("taskLists", JSON.stringify(newTaskLists)); //? When should I serialize to local storage
      }
    }

    if (isDraggedATask && isOverATask) {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      if (
        active.id !== over.id &&
        active.data.current?.task.taskListId ==
          over.data.current?.task.taskListId
      ) {
        const listId = active.data.current?.task.taskListId;
        const tasklist = taskLists.find((list) => list._id == listId);
        const tasks = tasklist?.tasks;
        const taskIndex = tasks.findIndex((task) => task._id === active.id);
        const overIndex = tasks.findIndex((task) => task._id === over.id);
        let newTaskLists: TaskList[] = structuredClone(taskLists);
        newTaskLists = newTaskLists.map((list: TaskList) => {
          if (list._id === listId) {
            list.tasks.splice(taskIndex, 1);
            list.tasks.splice(overIndex, 0, tasks[taskIndex]);
            return list;
          }
          return list;
        });
        setActiveTask(null);
        setTaskLists(newTaskLists);
        return localStorage.setItem("taskLists", JSON.stringify(newTaskLists)); //? When should I serialize to local storage
      }
      if (isDraggedATask && isOverATasklist) {
        console.log("Dropped over a Tasklist");
        const activeTaskTasklistId = event.active.data.current?.task.taskListId;
        const overTasklistId = event.over.id;
        const draggedTask = event.active.data.current?.task;
        const newTaskLists = structuredClone(taskLists);
        const draggedTaskList = newTaskLists.find(
          (list) => list._id === activeTaskTasklistId
        );
        const overTaskList = newTaskLists.find(
          (list) => list._id === overTasklistId
        );
        draggedTaskList?.tasks.splice(
          draggedTaskList.tasks.findIndex(
            (task) => task._id === draggedTask._id
          ),
          1
        );
        overTaskList?.tasks.push(draggedTask);
        setTaskLists(newTaskLists);
        updateTask(overTasklistId, draggedTask, {
          taskListId: overTasklistId,
        });
        return localStorage.setItem("taskLists", JSON.stringify(newTaskLists)); //? When should I serialize to local storage
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // console.log("active: ", event.active?.id);
    // console.log("over: ", event.over?.id);

    const isDraggedATask = event.active?.data.current?.type === "task";
    const isOverATask = event.over?.data.current?.type === "task";
    const isDraggedATasklist = event.active?.data.current?.type === "tasklist";
    const isOverATasklist = event.over?.data.current?.type === "tasklist";

    if (isDraggedATask && isOverATask) {
      const activeTaskTasklistId = event.active.data.current?.task.taskListId;
      const overTasklistId = event.over.data.current?.task.taskListId;
      const draggedTask = event.active.data.current?.task;
      const overTask = event.over.data.current?.task;
      //STEP Push the dragged task in the appropriate array
      if (
        activeTaskTasklistId !== overTasklistId &&
        draggedTask._id != overTask._id
      ) {
        const newTaskLists = structuredClone(taskLists);
        const draggedTaskList = newTaskLists.find(
          (list) => list._id === activeTaskTasklistId
        );
        const overTaskList = newTaskLists.find(
          (list) => list._id === overTasklistId
        );
        draggedTaskList?.tasks.splice(
          draggedTaskList.tasks.findIndex(
            (task) => task._id === draggedTask._id
          ),
          1
        );
        overTaskList?.tasks.push(draggedTask);
        setTaskLists(newTaskLists);
        return updateTask(overTasklistId, draggedTask, {
          taskListId: overTasklistId,
        });
      }
    }

    if (isDraggedATask && isOverATasklist) { //TODO Abstract by implementin findTasklistById
      const overTasklistId: string = event.over.data.current?.tasklist._id;
      const tempOverTaskList: TaskList = taskLists.find(
        (list) => list._id === overTasklistId
      );

      const tasklistHasTasks: boolean = tempOverTaskList.tasks.length > 0;
      if (tasklistHasTasks) return;

      const newTaskLists = structuredClone(taskLists);

      const draggedTask = event.active.data.current?.task;
      const activeTaskTasklistId = event.active.data.current?.task.taskListId;
      const activeTaskTasklist = newTaskLists.find(
        (list) => list._id === activeTaskTasklistId
      );
      const overTaskList: TaskList = newTaskLists.find(
        (list) => list._id === overTasklistId
      );

      const draggedTaskIndex = activeTaskTasklist.tasks.findIndex(
        (task) => task._id == draggedTask._id
      );

      activeTaskTasklist.tasks.splice(draggedTaskIndex, 1);
      overTaskList.tasks.push(draggedTask);
      setTaskLists(newTaskLists);
      updateTask(overTasklistId, draggedTask, { taskListId: overTasklistId });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
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
      localStorage.setItem("taskLists", JSON.stringify(lists));
    } catch (err) {
      //TODO handle error on error fetching
      console.log(token);
      console.error("Failed to fetch tasks", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (token && !userIsLoading) fetchData();
    else {
      const savedTaskLists = localStorage.getItem("taskLists");
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
              {taskLists.length > 0 ? (
                <>
                  <div className=" h-screen bg-gray-100 flex flex-col flex-1 overflow-auto">
                    <div className="flex items-start gap-6 p-6 pt-24 min-w-max h-full overflow-x-auto">
                      {taskLists.map((tasklist: TaskList) => (
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
                      className={"opacity-50"}
                    />
                  )}
                  {activeTask && (
                    <TaskItem
                      task={activeTask}
                      listId={activeTask.taskListId}
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
