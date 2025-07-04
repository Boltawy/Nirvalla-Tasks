"use client";

import { Task, TaskList } from "@/types/types";
import { createContext, useContext, useState } from "react";

type TaskListContextType = {
  taskLists: TaskList[];
  tasks: Task[];
  setTaskLists: React.Dispatch<React.SetStateAction<TaskList[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTaskList: (title?: string) => void;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const addTaskList = (title: string) => {
    const newList: TaskList = {
      id: Date.now().toString(),
      title,
      userId: "user-1",
      isDefault: false,
      deletedAt: null,
      tasks: [],
    };
    setTaskLists((prev) => [...prev, newList]);
  };

  const updateTaskListName = (listId: string, title: string) => {
    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) =>
        list.id === listId ? { ...list, title } : list
      )
    );
  };

  const deleteTaskList = (listId: string) => {
    setTaskLists((prev: TaskList[]) =>
      prev.filter((list) => list.id !== listId)
    );
  };

  const addTask = (listId: string, title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completedAt: null,
      deletedAt: null,
      userId: "user-1",
      taskListId: listId,
      parentId: null,
    };

    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) => {
        if (list.id === newTask.taskListId) {
          // Add as main task
          return { ...list, tasks: [...list.tasks, newTask] };
        }
        return list;
      })
    );
  };

  const updateTask = (
    listId: string,
    taskId: string,
    updates: Partial<Task>
  ) => {
    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task: Task) => {
              const targetTask = findTaskInListById(taskId, list);
              if (targetTask) {
                Object.assign(targetTask, updates);
              }
              return task;
            }),
          };
        }
        return list;
      })
    );
  };
  const toggleTask = (task: Task, taskListId: string) => {
    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) => {
        if (list.id === taskListId) {
          return {
            ...list,
            tasks: list.tasks.map((_task: Task) => {
              if (_task.id === task.id) {
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
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.filter((task: Task) => task.id !== taskId),
          };
        }
        return list;
      })
    );
  };

  const findTaskInListById = (task: any, taskList: TaskList): Task | null => {
    // Check main tasks
    const mainTask = taskList.tasks.find((_task) => {
      if (task.id) return _task.id === task.id;
      else return _task.id === task;
    });
    if (mainTask) return mainTask;

    return null;
  };

  return (
    <tasklistContext.Provider
      value={{
        taskLists,
        tasks,
        setTaskLists,
        setTasks,
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
