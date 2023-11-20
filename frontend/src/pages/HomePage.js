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
        {/* Sort by dropdown can be a separate component or directly coded here */}
         <select className="sort-dropdown" value={sortOption} onChange={handleSortChange}>
          <option value="oldest">Sort by: Oldest</option>
          <option value="newest">Sort by: Newest</option>
          <option value="priority">Sort by: Priority</option>
          <option value="name">Sort by: Name</option>
        </select>
        <AddTask prevState={updateTask} setUpdateTask={setUpdateTask} />
      </div>
      <DisplayTasks updateTask={updateTask} sortOption={sortOption} setSortOption={setSortOption} />
    </div>
  );
};

export default HomePage;
