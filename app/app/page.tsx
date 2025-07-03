"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TaskHeader } from "../components/task-header";
import type {
  TaskList,
  Task,
  fetchedTaskList,
  fetchedTask,
} from "../../types/types";
import TaskListArea from "../components/tasklist-area";
import { getFlightDataPartsFromPath } from "next/dist/client/flight-data-helpers";

const initialTaskLists: TaskList[] = [
  {
    id: "1",
    name: "My Tasks",
    userId: "user-1",
    isDefault: false,
    deletedAt: null,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-10"),
    tasks: [
      {
        id: "1",
        title: "Complete project proposal",
        description: "Prepare a detailed project proposal",
        userId: "user-1",
        taskListId: "1",
        parentId: null,
        completedAt: null,
        deletedAt: null,
        notes: "Include budget and timeline",
        createdAt: new Date("2023-01-02"),
        updatedAt: new Date("2023-01-03"),
      },
      {
        id: "2",
        title: "Review team feedback",
        description: "Go through the feedback from the team",
        userId: "user-1",
        taskListId: "1",
        parentId: null,
        completedAt: new Date("2023-01-04"),
        deletedAt: null,
        notes: "",
        createdAt: new Date("2023-01-02"),
        updatedAt: new Date("2023-01-04"),
      },
      {
        id: "3",
        title: "Schedule client meeting",
        description: "Arrange a meeting with the client",
        userId: "user-1",
        taskListId: "1",
        parentId: null,
        completedAt: null,
        deletedAt: null,
        notes: "Discuss Q4 goals",
        createdAt: new Date("2023-01-03"),
        updatedAt: new Date("2023-01-05"),
      },
      {
        id: "4",
        title: "Update documentation",
        description: "Revise and update project documentation",
        userId: "user-1",
        taskListId: "1",
        parentId: null,
        completedAt: null,
        deletedAt: null,
        notes: "",
        createdAt: new Date("2023-01-04"),
        updatedAt: new Date("2023-01-06"),
      },
    ],
  },
  {
    id: "2",
    name: "Personal",
    userId: "user-1",
    isDefault: true,
    deletedAt: null,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-10"),
    tasks: [
      {
        id: "5",
        title: "Buy groceries",
        description: "Purchase groceries for the week",
        userId: "user-1",
        taskListId: "2",
        parentId: null,
        completedAt: null,
        deletedAt: null,
        notes: "Milk, bread, eggs",
        createdAt: new Date("2023-01-05"),
        updatedAt: new Date("2023-01-07"),
      },
      {
        id: "6",
        title: "Call dentist",
        description: "Schedule a dentist appointment",
        userId: "user-1",
        taskListId: "2",
        parentId: null,
        completedAt: new Date("2023-01-06"),
        deletedAt: null,
        notes: "",
        createdAt: new Date("2023-01-06"),
        updatedAt: new Date("2023-01-08"),
      },
      {
        id: "7",
        title: "Plan weekend trip",
        description: "Organize a trip for the weekend",
        userId: "user-1",
        taskListId: "2",
        parentId: null,
        completedAt: null,
        deletedAt: null,
        notes: "",
        createdAt: new Date("2023-01-07"),
        updatedAt: new Date("2023-01-09"),
      },
    ],
  },
  {
    id: "3",
    name: "Work",
    userId: "user-1",
    isDefault: false,
    deletedAt: null,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-10"),
    tasks: [
      {
        id: "8",
        title: "Prepare presentation",
        description: "Create a presentation for Q3 sales",
        userId: "user-1",
        taskListId: "3",
        parentId: null,
        completedAt: null,
        deletedAt: null,
        notes: "Sales figures for Q3",
        createdAt: new Date("2023-01-08"),
        updatedAt: new Date("2023-01-10"),
      },
      {
        id: "9",
        title: "Team standup",
        description: "Daily team standup meeting",
        userId: "user-1",
        taskListId: "3",
        parentId: null,
        completedAt: new Date("2023-01-09"),
        deletedAt: null,
        notes: "",
        createdAt: new Date("2023-01-09"),
        updatedAt: new Date("2023-01-11"),
      },
    ],
  },
];

//TODO Implement login
// const baseUrl = "https://nv-tasks-api.vercel.app/api/v1";
const baseUrl = "https://nirvalla-tasks.up.railway.app/api/v1";
// const baseUrl = "http://localhost:3001/api/v1";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODYyNjM4M2RhNWRiMWRhNTg2NzQ3YzIiLCJ1c2VyTmFtZSI6InRlc3QiLCJpYXQiOjE3NTEyNzkwNzYsImV4cCI6MTc4MjgxNTA3Nn0.STDifspT-Dcsn4qVjIodz2yDdF8Tm2pMUt6DZmfAZ-4";

export default function TasksApp() {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newListName, setNewListName] = useState("");

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
        axios.get(`${baseUrl}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseUrl}/tasklists`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const fetchedTasks: Task[] = tasksRes.data.data.tasks;
      const fetchedTaskLists: fetchedTaskList[] =
        taskListsRes.data.data.taskLists;

      generateTaskLists(fetchedTasks, fetchedTaskLists);
    } catch (err) {
      console.error("Failed to fetch tasks or task lists", err);
    }
  };

  const findTaskById = (
    taskId: string
  ): { task: Task; listId: string; parentId?: string } | null => {
    for (const list of taskLists) {
      // Check main tasks
      const mainTask = list.tasks.find((task) => task.id === taskId);
      if (mainTask) {
        return { task: mainTask, listId: list.id };
      }

      // Check subtasks recursively
      // for (const task of list.tasks) {
      //   const result = findSubtask(task, taskId, list.id);
      //   if (result) return result;
      // }
    }
    return null;
  };

  // const findSubtask = (
  //   task: Task,
  //   targetId: string,
  //   listId: string
  // ): { task: Task; listId: string; parentId: string } | null => {
  //   const subtask = task.subtasks.find((sub) => sub.id === targetId);
  //   if (subtask) {
  //     return { task: subtask, listId, parentId: task.id };
  //   }

  //   // Check nested subtasks
  //   for (const sub of task.subtasks) {
  //     const result = findSubtask(sub, targetId, listId);
  //     if (result) return result;
  //   }

  //   return null;
  // };

  // const handleDragStart = (event: DragStartEvent) => {
  //   const { active } = event;
  //   setActiveId(active.id as string);

  //   if (active.id.toString().startsWith("task-")) {
  //     const taskId = active.id.toString().replace("task-", "");
  //     const result = findTaskById(taskId);
  //     if (result) {
  //       setActiveTask(result.task);
  //     }
  //   }
  // };

  // const handleDragOver = (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const activeId = active.id.toString();
  //   const overId = over.id.toString();

  //   // Handle task dragging over other tasks or lists
  //   if (activeId.startsWith("task-")) {
  //     const taskId = activeId.replace("task-", "");
  //     const result = findTaskById(taskId);
  //     if (!result) return;

  //     // Dragging over a list
  //     if (overId.startsWith("list-")) {
  //       const targetListId = overId.replace("list-", "");
  //       if (result.listId !== targetListId) {
  //         moveTaskBetweenLists(
  //           taskId,
  //           result.listId,
  //           targetListId,
  //           result.parentId
  //         );
  //       }
  //     }
  //   }
  // };

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   setActiveId(null);
  //   setActiveTask(null);

  //   if (!over) return;

  //   const activeId = active.id.toString();
  //   const overId = over.id.toString();

  //   // Handle task list reordering
  //   if (activeId.startsWith("list-") && overId.startsWith("list-")) {
  //     const activeListId = activeId.replace("list-", "");
  //     const overListId = overId.replace("list-", "");

  //     if (activeListId !== overListId) {
  //       reorderTaskLists(activeListId, overListId);
  //     }
  //   }

  //   // Handle task reordering and nesting
  //   if (activeId.startsWith("task-")) {
  //     const taskId = activeId.replace("task-", "");
  //     const result = findTaskById(taskId);
  //     if (!result) return;

  //     if (overId.startsWith("task-")) {
  //       const overTaskId = overId.replace("task-", "");
  //       const overResult = findTaskById(overTaskId);
  //       if (!overResult) return;

  //       // If both tasks are in the same parent, reorder them
  //       if (
  //         result.listId === overResult.listId &&
  //         result.parentId === overResult.parentId
  //       ) {
  //         reorderTasks(taskId, overTaskId, result.listId, result.parentId);
  //       }
  //       // Otherwise, nest task under another task (make it a subtask)
  //       else if (result.listId === overResult.listId && !overResult.parentId) {
  //         nestTaskUnderTask(taskId, overTaskId, result.listId, result.parentId);
  //       }
  //     } else if (overId.startsWith("list-")) {
  //       const targetListId = overId.replace("list-", "");
  //       if (result.listId !== targetListId) {
  //         moveTaskBetweenLists(
  //           taskId,
  //           result.listId,
  //           targetListId,
  //           result.parentId
  //         );
  //       }
  //     }
  //   }
  // };

  // const reorderTaskLists = (activeListId: string, overListId: string) => {
  //   setTaskLists((prev) => {
  //     const activeIndex = prev.findIndex((list) => list.id === activeListId);
  //     const overIndex = prev.findIndex((list) => list.id === overListId);

  //     const newLists = [...prev];
  //     const [removed] = newLists.splice(activeIndex, 1);
  //     newLists.splice(overIndex, 0, removed);

  //     return newLists;
  //   });
  // };

  // const reorderTasks = (
  //   activeTaskId: string,
  //   overTaskId: string,
  //   listId: string,
  //   parentId?: string
  // ) => {
  //   setTaskLists((prev) => {
  //     const newLists = [...prev];
  //     const list = newLists.find((l) => l.id === listId);
  //     if (!list) return prev;

  //     if (parentId) {
  //       // Reorder subtasks
  //       const parentTask = findTaskInListById(list, parentId);
  //       if (parentTask) {
  //         const activeIndex = parentTask.subtasks.findIndex(
  //           (task) => task.id === activeTaskId
  //         );
  //         const overIndex = parentTask.subtasks.findIndex(
  //           (task) => task.id === overTaskId
  //         );

  //         if (activeIndex !== -1 && overIndex !== -1) {
  //           const [removed] = parentTask.subtasks.splice(activeIndex, 1);
  //           parentTask.subtasks.splice(overIndex, 0, removed);
  //         }
  //       }
  //     } else {
  //       // Reorder main tasks
  //       const activeIndex = list.tasks.findIndex(
  //         (task) => task.id === activeTaskId
  //       );
  //       const overIndex = list.tasks.findIndex(
  //         (task) => task.id === overTaskId
  //       );

  //       if (activeIndex !== -1 && overIndex !== -1) {
  //         const [removed] = list.tasks.splice(activeIndex, 1);
  //         list.tasks.splice(overIndex, 0, removed);
  //       }
  //     }

  //     return newLists;
  //   });
  // };

  // const findTaskInTaskSubtasks = (
  //   task: Task,
  //   targetId: string
  // ): Task | null => {
  //   if (task.id === targetId) return task;

  //   for (const subtask of task.subtasks) {
  //     const result = findTaskInTaskSubtasks(subtask, targetId);
  //     if (result) return result;
  //   }

  //   return null;
  // };

  // const moveTaskBetweenLists = (
  //   taskId: string,
  //   sourceListId: string,
  //   targetListId: string,
  //   parentId?: string
  // ) => {
  //   setTaskLists((prev) => {
  //     const newLists = [...prev];
  //     const sourceList = newLists.find((list) => list.id === sourceListId);
  //     const targetList = newLists.find((list) => list.id === targetListId);

  //     if (!sourceList || !targetList) return prev;

  //     let taskToMove: Task | null = null;

  //     if (parentId) {
  //       // Moving a subtask
  //       const parentTask = findTaskInListById(sourceList, parentId);
  //       if (parentTask) {
  //         const subtaskIndex = parentTask.subtasks.findIndex(
  //           (sub) => sub.id === taskId
  //         );
  //         if (subtaskIndex !== -1) {
  //           taskToMove = parentTask.subtasks.splice(subtaskIndex, 1)[0];
  //         }
  //       }
  //     } else {
  //       // Moving a main task
  //       const taskIndex = sourceList.tasks.findIndex(
  //         (task) => task.id === taskId
  //       );
  //       if (taskIndex !== -1) {
  //         taskToMove = sourceList.tasks.splice(taskIndex, 1)[0];
  //       }
  //     }

  //     if (taskToMove) {
  //       // Add to target list as main task
  //       targetList.tasks.push(taskToMove);
  //     }

  //     return newLists;
  //   });
  // };

  // const nestTaskUnderTask = (
  //   taskId: string,
  //   parentTaskId: string,
  //   listId: string,
  //   currentParentId?: string
  // ) => {
  //   setTaskLists((prev) => {
  //     const newLists = [...prev];
  //     const list = newLists.find((l) => l.id === listId);
  //     if (!list) return prev;

  //     let taskToNest: Task | null = null;

  //     if (currentParentId) {
  //       // Moving from subtask to subtask
  //       const currentParent = findTaskInListById(list, currentParentId);
  //       if (currentParent) {
  //         const subtaskIndex = currentParent.subtasks.findIndex(
  //           (sub) => sub.id === taskId
  //         );
  //         if (subtaskIndex !== -1) {
  //           taskToNest = currentParent.subtasks.splice(subtaskIndex, 1)[0];
  //         }
  //       }
  //     } else {
  //       // Moving from main task to subtask
  //       const taskIndex = list.tasks.findIndex((task) => task.id === taskId);
  //       if (taskIndex !== -1) {
  //         taskToNest = list.tasks.splice(taskIndex, 1)[0];
  //       }
  //     }

  //     if (taskToNest) {
  //       const parentTask = findTaskInListById(list, parentTaskId);
  //       if (parentTask) {
  //         parentTask.subtasks.push(taskToNest);
  //       }
  //     }

  //     return newLists;
  //   });
  // };

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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen bg-white flex flex-col">
      <TaskHeader
        onAddList={addTaskList}
        newListName={newListName}
        setNewListName={setNewListName}
      />
      <div className="flex-1 overflow-auto">
        <div className="flex items-start gap-6 p-6 min-w-max h-full overflow-x-auto">
          <TaskListArea
            tasklists={taskLists}
            tasks={tasks}
            setTaskLists={setTaskLists}
            // tasksData={tasksData}
          />
        </div>
        {activeTask && (
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg opacity-90 max-w-64">
            <div className="text-sm font-medium truncate">
              {activeTask.title}
            </div>
            {/* {activeTask.notes && (
              <div className="text-xs text-gray-500 mt-1 truncate">
                {activeTask.notes}
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}
