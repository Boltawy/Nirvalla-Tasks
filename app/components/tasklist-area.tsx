"use client";

import { Task, TaskList } from "@/types/types";
import { TaskColumn } from "./task-column";
import { use, useEffect } from "react";

export default function TaskListArea({
  tasklists,
  tasks,
  setTaskLists,
  //   tasksData,
}) {
  // const tasks = use(tasksData);
  const addTask = (taskListId: string, title: string, parentId?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completedAt: null,
      deletedAt: null,
      userId: "user-1",
      taskListId,
      parentId,
    };

    setTaskLists((prev) =>
      prev.map((list) => {
        // if (list.id === listId) {
        //   if (parentId) {
        //     // Add as subtask
        //     return {
        //       ...list,
        //       tasks: list.tasks.map((task) => {
        //         const targetTask = findTaskInList(task, parentId);
        //         if (targetTask) {
        //           targetTask.subtasks.push(newTask);
        //         }
        //         return task;
        //       }),
        //     };
        //   } else {
        // Add as main task
        return { ...list, tasks: [...list.tasks, newTask] };
        //   }
        // }
        return list;
      })
    );
  };

  const toggleTask = (listId: string, taskId: string, parentId?: string) => {
    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              const targetTask = findTaskInList(task, taskId);
              if (targetTask && targetTask.completedAt === null) {
                targetTask.completedAt = new Date();
              }
              return task;
            }),
          };
        }
        return list;
      })
    );
  };

  const updateTask = (
    listId: string,
    taskId: string,
    updates: Partial<Task>,
    parentId?: string
  ) => {
    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              const targetTask = findTaskInList(task, taskId);
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

  const deleteTask = (listId: string, taskId: string, parentId?: string) => {
    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          if (parentId) {
            return {
              ...list,
              tasks: list.tasks.map((task) => {
                const parentTask = findTaskInList(task, parentId);
                // if (parentTask) {
                //   parentTask.subtasks = parentTask.subtasks.filter(
                //     (subtask) => subtask.id !== taskId
                //   );
                // }
                return task;
              }),
            };
          } else {
            return {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== taskId),
            };
          }
        }
        return list;
      })
    );
  };
  const updateTaskListName = (listId: string, name: string) => {
    setTaskLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, name } : list))
    );
  };

  const deleteTaskList = (listId: string) => {
    setTaskLists((prev) => prev.filter((list) => list.id !== listId));
  };

  const findTaskInList = (list: TaskList, taskId: string): Task | null => {
    // Check main tasks
    const mainTask = list.tasks.find((task) => task.id === taskId);
    if (mainTask) return mainTask;

    return null;
  };

  useEffect(() => {}, []);

  return (
    <>
      {tasklists.map((tasklist: TaskList) => (
        <TaskColumn
          key={tasklist.id}
          tasklist={tasklist}
          onAddTask={(title, parentId) => addTask(tasklist.id, title, parentId)}
          onToggleTask={(taskId, parentId) =>
            toggleTask(tasklist.id, taskId, parentId)
          }
          onUpdateTask={(taskId, updates, parentId) =>
            updateTask(tasklist.id, taskId, updates, parentId)
          }
          onDeleteTask={(taskId, parentId) =>
            deleteTask(tasklist.id, taskId, parentId)
          }
          onUpdateListName={(name) => updateTaskListName(tasklist.id, name)}
          onDeleteList={() => deleteTaskList(tasklist.id)}
        />
      ))}
    </>
  );
}
