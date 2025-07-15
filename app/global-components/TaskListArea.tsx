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

export default function TaskListArea() {
  const { token, userName, userIsLoading } = useContext(UserContext);
  const [activeTasklist, setActiveTasklist] = useState<TaskList | null>(null);

  const {
    taskLists,
    setTaskLists,
    addTaskList,
    updateTaskListName,
    deleteTaskList,
  } = useContext(tasklistContext);

  const [isFetching, setIsFetching] = useState(false);
  const tasklistIds = useMemo(
    () => taskLists.map((tasklist: TaskList) => tasklist._id),
    [taskLists]
  );

  const handleDragStart = (event: DragStartEvent) => {
    console.log(event);
    if (event.active.data.current?.type === "tasklist") {
      setActiveTasklist(event.active.data.current?.tasklist || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.active.data.current?.type === "tasklist") {
      setActiveTasklist(null);
    }
    const { active, over } = event;
    console.log(over);
    if (!over) return;
    if (over.data.current?.tasklist.isDefault === true) return;

    if (active.id !== over.id) {
      const oldIndex = tasklistIds.indexOf(active.id as string);
      const newIndex = tasklistIds.indexOf(over.id as string);
      const newTaskLists = structuredClone(taskLists);
      const [movedTaskList] = newTaskLists.splice(oldIndex, 1);
      newTaskLists.splice(newIndex, 0, movedTaskList);
      setTaskLists(newTaskLists);
      localStorage.setItem("taskLists", JSON.stringify(newTaskLists)); //? When should I serialize to local storage
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  }));

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
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                    /> //! Delte tasklist function ?
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
