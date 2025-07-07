"use client";

import { TaskColumn } from "./task-column";
import { useContext, useEffect, useState } from "react";
import type { TaskList, Task } from "../../types/types";
import axios from "axios";
import { tasklistContext } from "../context/tasklist-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { baseUrl } from "../constants";
import { UserContext } from "../context/UserContext";

export default function TaskListArea() {
  // const [activeTask, setActiveTask] = useState<Task | null>(null);

  //TODO Implement login

  const { token, userName } = useContext(UserContext);

  const {
    taskLists,
    setTaskLists,
    addTaskList,
    updateTaskListName,
    deleteTaskList,
  } = useContext(tasklistContext);

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
      console.log(token);
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

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
