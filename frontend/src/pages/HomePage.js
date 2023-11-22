import React, { useState } from "react"; 

import AddTask from "../components/AddTask";
import HomeHeader from "../components/HomeHeader";
import DisplayTasks from "../components/DisplayTasks";

import '../styles/HomePage.css'; // Import the CSS for HomePage layout

const HomePage = () => {
  const [updateTask, setUpdateTask] = useState(false);
  // Define the sortOption state here

  const [sortOption, setSortOption] = useState('oldest'); // Default sort state
  
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  // Handler for sort dropdown change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleToggleTasksView = () => {
    setShowCompletedTasks(prevState => !prevState);
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
        <button 
          type="button" 
          className="common-btn-style dynamic-text-button" 
          onClick={handleToggleTasksView}
        >
          {showCompletedTasks ? "Show Current Tasks" : "Show Completed Tasks"}
        </button>
      </div>
      <DisplayTasks 
        updateTask={updateTask} 
        sortOption={sortOption} 
        showCompletedTasks={showCompletedTasks} 
      />
    </div>
  );
};

export default HomePage;
