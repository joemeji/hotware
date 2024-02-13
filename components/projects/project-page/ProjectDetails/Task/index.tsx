import Heading from "./Heading";
import List from "./List";
import AddTaskModal from "./modals/AddTaskModal";
import { useState } from "react";

const Task = ({ headerSize }: { headerSize?: any }) => {
  const [openNewTask, setOpenNewTask] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const onEditTask = (task?: any) => {
    setOpenNewTask(true);
    setSelectedTask(task);
  };

  return (
    <>
      <AddTaskModal
        open={openNewTask}
        onOpenChange={(open: any) => {
          setOpenNewTask(open);
          setSelectedTask(null);
        }}
        onUpdated={() => {
          setIsUpdated(true);
          setTimeout(() => {
            setIsUpdated(false);
          }, 300);
        }}
        task={selectedTask}
      />
      <div className="flex flex-col mt-2">
        <Heading onClickNewTask={() => setOpenNewTask(true)} />
        <List isUpdated={isUpdated} onEditTask={onEditTask} />
      </div>
    </>
  );
};

export default Task;
