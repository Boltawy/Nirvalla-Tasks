"use client";

import { TaskColumn } from "./task-column";
import { useContext, useEffect, useState } from "react";
import type { TaskList, Task } from "../../types/types";
import axios from "axios";
import { tasklistContext } from "../context/tasklist-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { baseUrl, token } from "../constants";

export default function TaskListArea() {
  // const [activeTask, setActiveTask] = useState<Task | null>(null);

  //TODO Implement login

  const {
    taskLists,
    tasks,
    setTaskLists,
    setTasks,
    addTaskList,
    updateTaskListName,
    deleteTaskList,
  } = useContext(tasklistContext);

  // const generateTaskLists = (
  //   fetchedTasks: fetchedTask[],
  //   fetchedTaskLists: fetchedTaskList[]
  // ) => {
  //   const tasks = fetchedTasks.map((task) => ({
  //     ...task,
  //     id: task._id,
  //   }));
  //   const taskLists = fetchedTaskLists.map((tasklist) => ({
  //     ...tasklist,
  //     id: tasklist._id,
  //     tasks: [],
  //   }));
  //   for (const task of tasks) {
  //     taskLists.find((list) => list.id === task.taskListId)?.tasks.push(task);
  //   }
  //   setTasks(tasks);
  //   setTaskLists(taskLists);
  // };

  // const fetchData = async () => {
  //   try {
  //     const [tasksRes, taskListsRes] = await Promise.all([
  //       axios.get(`${baseUrl}/tasks?showCompleted=true`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //       axios.get(`${baseUrl}/tasklists`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //     ]);

  //     const fetchedTasks: fetchedTask[] = tasksRes.data.data.tasks;
  //     const fetchedTaskLists: fetchedTaskList[] =
  //       taskListsRes.data.data.taskLists;

  //     generateTaskLists(fetchedTasks, fetchedTaskLists);
  //   } catch (err) {
  //     console.error("Failed to fetch tasks or task lists", err);
  //   }
  // };

  const fetchData = async () => {
    try {
      const {
        data: { data },
      } = await axios.get(`${baseUrl}/sync`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const lists = data.populatedLists;
      setTaskLists(lists);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, []);

  return (
    <>
      {taskLists.map((tasklist: TaskList) => (
        <TaskColumn key={tasklist._id} tasklist={tasklist} />
      ))}
      <Button variant="outline" onClick={() => addTaskList("New Tasklist")}>
        <Plus />
        Add tasklist
      </Button>
    </>
  );
}
