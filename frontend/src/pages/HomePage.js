import React, { useState } from "react"; 

import AddTask from "../components/AddTask";
import HomeHeader from "../components/HomeHeader";
import DisplayTasks from "../components/DisplayTasks";

import '../styles/HomePage.css'; // Import the CSS for HomePage layout

const HomePage = () => {
  const [updateTask, setUpdateTask] = useState(false);
  // Define the sortOption state here

  const [sortOption, setSortOption] = useState('oldest'); // Default sort state
  

  // Handler for sort dropdown change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };


  return (
    <div>
      <HomeHeader />
      <div className="task-action-container">
        <select className="common-btn-style" value={sortOption} onChange={handleSortChange}>
          <option value="oldest">Sort by: Oldest</option>
          <option value="newest">Sort by: Newest</option>
          <option value="priority">Sort by: Priority</option>
          <option value="name">Sort by: Name</option>
          </select>
        <div>
          {/* You may need to wrap AddTask in a div if it's not already and apply the common styles */}
          <AddTask className="common-btn-style" prevState={updateTask} setUpdateTask={setUpdateTask} />
        </div>
      </div>
      <DisplayTasks updateTask={updateTask} sortOption={sortOption} />
    </div>
  );
};

export default HomePage;
