"use client";

import { TaskColumn } from "./task-column";
import { useContext, useEffect, useState } from "react";
import type {
  TaskList,
  Task,
  fetchedTaskList,
  fetchedTask,
} from "../../types/types";
import axios from "axios";
import { tasklistContext } from "../context/tasklist-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TaskListArea() {
  // const [activeTask, setActiveTask] = useState<Task | null>(null);

  //TODO Implement login
  // const baseUrl = "https://nv-tasks-api.vercel.app/api/v1";
  const baseUrl = "https://nirvalla-tasks.up.railway.app/api/v1";
  // const baseUrl = "http://localhost:3001/api/v1";

  const {
    taskLists,
    tasks,
    setTaskLists,
    setTasks,
    addTaskList,
    updateTaskListName,
    deleteTaskList,
  } = useContext(tasklistContext);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODYyNjM4M2RhNWRiMWRhNTg2NzQ3YzIiLCJ1c2VyTmFtZSI6InRlc3QiLCJpYXQiOjE3NTEyNzkwNzYsImV4cCI6MTc4MjgxNTA3Nn0.STDifspT-Dcsn4qVjIodz2yDdF8Tm2pMUt6DZmfAZ-4";
  const generateTaskLists = (
    fetchedTasks: fetchedTask[],
    fetchedTaskLists: fetchedTaskList[]
  ) => {
    const tasks = fetchedTasks.map((task) => ({
      ...task,
      id: task._id,
    }));
    const taskLists = fetchedTaskLists.map((tasklist) => ({
      ...tasklist,
      id: tasklist._id,
      tasks: [],
    }));
    for (const task of tasks) {
      taskLists.find((list) => list.id === task.taskListId)?.tasks.push(task);
    }
    setTasks(tasks);
    setTaskLists(taskLists);
  };

  const fetchData = async () => {
    try {
      const [tasksRes, taskListsRes] = await Promise.all([
        axios.get(`${baseUrl}/tasks?showCompleted=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseUrl}/tasklists`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const fetchedTasks: fetchedTask[] = tasksRes.data.data.tasks;
      const fetchedTaskLists: fetchedTaskList[] =
        taskListsRes.data.data.taskLists;

      generateTaskLists(fetchedTasks, fetchedTaskLists);
    } catch (err) {
      console.error("Failed to fetch tasks or task lists", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {taskLists.map((tasklist: TaskList) => (
        <TaskColumn key={tasklist.id} tasklist={tasklist} />
      ))}
      <Button variant="outline" onClick={() => addTaskList("New Tasklist")}>
        <Plus />
        Add tasklist
      </Button>
    </>
  );
}
