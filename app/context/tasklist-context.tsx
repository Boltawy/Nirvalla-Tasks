"use client";

import { Task, TaskList } from "@/types/types";
import { createContext, useContext, useState } from "react";
import { UserContext } from "./UserContext";

type TaskListContextType = {
  taskLists: TaskList[];
  // tasks: Task[];
  setTaskLists: React.Dispatch<React.SetStateAction<TaskList[]>>;
  // setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTaskList: (tasklist?: Partial<TaskList>) => void;
  updateTaskListName: (listId: string, title: string) => void;
  toggleTask: (task: Task, tasklistId: string) => void;
  deleteTaskList: (listId: string) => void;
  addTask: (listId: string, title: string, parentId?: string | null) => void;
  updateTask: (listId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (
    listId: string,
    taskId: string,
    parentId?: string | null
  ) => void;
  findTaskInListById: (task: any, taskList: TaskList) => Task | null;
};

type TaskListProviderProps = {
  children: React.ReactNode;
};

const tasklistContext = createContext<TaskListContextType>(
  {} as TaskListContextType
);

const TaskListProvider = ({ children }: TaskListProviderProps) => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const { userId, userName } = useContext(UserContext);
  const addTaskList = (tasklist?: Partial<TaskList>) => {
    const newList: TaskList = {
      _id: Date.now().toString(),
      title: tasklist?.isDefault ? "Inbox" : tasklist?.title || "New Tasklist",
      userId,
      isDefault: tasklist?.isDefault || false,
      deletedAt: null,
      tasks: [],
    };
    setTaskLists((prev) => [...prev, newList]);
  };

  const updateTaskListName = (listId: string, title: string) => {
    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) => {
        if (list._id != listId) return list;
        else return { ...list, title };
      })
    );
  };

  const deleteTaskList = (listId: string) => {
    setTaskLists((prev: TaskList[]) =>
      prev.filter((list) => list._id !== listId)
    );
  };

  const addTask = (listId: string, title: string) => {
    const newTask: Task = {
      _id: Date.now().toString(),
      title,
      completedAt: null,
      deletedAt: null,
      userId,
      taskListId: listId,
      parentId: null,
      subtasks: [],
    };

    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) => {
        if (list._id === newTask.taskListId) {
          // Add as main task
          return { ...list, tasks: [...list.tasks, newTask] };
        }
        return list;
      })
    );
  };

  const updateTask = (
    listId: string,
    prevTask: Task,
    updates: Partial<Task>
  ) => {
    setTaskLists((prev) =>
      prev.map((list) => {
        if (list._id != listId) return list;

        return {
          ...list,
          tasks: list.tasks.map((task) => {
            if (task._id !== prevTask._id) return task;
            return { ...task, ...updates }; // ✅ New object
          }),
        };
      })
    );
  };

  const toggleTask = (task: Task, taskListId: string) => {
    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) => {
        if (list._id === taskListId) {
          return {
            ...list,
            tasks: list.tasks.map((_task: Task) => {
              if (_task._id === task._id) {
                return {
                  ..._task,
                  completedAt: _task.completedAt === null ? new Date() : null, // Calculate new completedAt
                };
              }
              return _task;
            }),
          };
        }
        return list;
      })
    );
  };

  const deleteTask = (listId: string, taskId: string) => {
    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) => {
        if (list._id === listId) {
          return {
            ...list,
            tasks: list.tasks.filter((task: Task) => task._id !== taskId),
          };
        }
        return list;
      })
    );
  };

  const findTaskInListById = (task: any, taskList: TaskList): Task | null => {
    // Check main tasks
    const mainTask = taskList.tasks.find((_task) => {
      if (task._id) return _task._id === task._id;
      else return _task._id === task;
    });
    if (mainTask) return mainTask;

    return null;
  };

  return (
    <tasklistContext.Provider
      value={{
        taskLists,
        // tasks,
        setTaskLists,
        // setTasks,
        addTaskList,
        updateTaskListName,
        deleteTaskList,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        findTaskInListById,
      }}
    >
      {children}
    </tasklistContext.Provider>
  );
};

export { tasklistContext, TaskListProvider };
