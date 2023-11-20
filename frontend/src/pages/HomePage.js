import React, { useState } from "react"; 

import AddTask from "../components/AddTask";
import HomeHeader from "../components/HomeHeader";
import DisplayTasks from "../components/DisplayTasks";

import './HomePage.css'; // Import the CSS for HomePage layout

const HomePage = () => {
  const [updateTask, setUpdateTask] = useState(false);
  return (
    <div>
      <HomeHeader />
      <div className="task-action-container"> {/* Flex container for buttons */}
        <div className="sort-task-container">
        <div className="sort-dropdown">
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="oldest">Sort by: Oldest</option>
            <option value="newest">Sort by: Newest</option>
            <option value="priority">Sort by: Priority</option>
            <option value="name">Sort by: Name</option>
          </select>
      </div>
        </div>
        <div className="add-task-container">
          <AddTask prevState={updateTask} setUpdateTask={setUpdateTask} />
        </div>
      </div>
      <DisplayTasks updateTask={updateTask} />
    </div>
  );
}

export default HomePage;
