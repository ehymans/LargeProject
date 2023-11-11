import React, { useState } from "react"; 

import AddTask from "../components/AddTask";
import HomeHeader from "../components/HomeHeader";
import DisplayTasks from "../components/DisplayTasks";

const HomePage = () => {
  const [updateTask, setUpdateTask] = useState(false);
  return (
    <div>
      <HomeHeader />
      <AddTask prevState={updateTask} setUpdateTask={setUpdateTask} />
      <DisplayTasks updateTask={updateTask} />
    </div>
  );
};

export default HomePage;
