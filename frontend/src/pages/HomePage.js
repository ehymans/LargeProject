import React, { useState } from "react"; 

import LoggedInName from "../components/LoggedInName";
import HomeHeader from "../components/HomeHeader";
import DisplayTasks from "../components/DisplayTasks";

const HomePage = () => {
  const [updateTask, setUpdateTask] = useState(false);
  return (
    <div>
      <HomeHeader />
      <LoggedInName prevState={updateTask} setUpdateTask={setUpdateTask} />
      <DisplayTasks updateTask={updateTask} />
    </div>
  );
};

export default HomePage;
