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
      parentId: null,
    };

    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === taskListId) {
          // Add as main task
          return { ...list, tasks: [...list.tasks, newTask] };
        }
        return list;
      })
    );
  };

  const toggleTask = (
    taskListId: string,
    taskId: string,
    parentId?: string
  ) => {
    setTaskLists((prev: TaskList[]) =>
      prev.map((list: TaskList) => {
        if (list.id === taskListId) {
          return {
            ...list,
            tasks: list.tasks.map((task: Task) => {
              const targetTask = findTaskInListById(task, list);
              if (targetTask && targetTask.completedAt === null) {
                targetTask.completedAt = new Date();
              } else if (targetTask && targetTask.completedAt !== null) {
                targetTask.completedAt = null;
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

  const deleteTask = (listId: string, taskId: string, parentId?: string) => {
    setTaskLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          if (parentId) {
            return {
              ...list,
              tasks: list.tasks.map((task) => {
                const parentTask = findTaskInListById(task, list);
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
  const updateTaskListName = (listId: string, title: string) => {
    setTaskLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, title } : list))
    );
  };

  const deleteTaskList = (listId: string) => {
    setTaskLists((prev) => prev.filter((list) => list.id !== listId));
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
          onUpdateListName={(title) => updateTaskListName(tasklist.id, title)}
          onDeleteList={() => deleteTaskList(tasklist.id)}
          // isInbox
        />
      ))}
    </>
  );
}
