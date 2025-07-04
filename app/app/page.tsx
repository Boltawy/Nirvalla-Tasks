import Nav from "../components/Nav";
import { TaskHeader } from "../components/task-header";
import TaskListArea from "../components/tasklist-area";

export default function TasksApp() {
  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="flex items-start gap-6 p-6 pt-24 min-w-max h-full overflow-x-auto">
            <TaskListArea />
        </div>
      </div>
    </div>
  );
}
