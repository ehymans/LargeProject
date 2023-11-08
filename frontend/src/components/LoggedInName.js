import React, { useState, useEffect } from "react";
import "./HomePage.css";

import CircularProgressBar from "./CircularProgressBar";
 
function LoggedInName() {
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskInfo, setTaskInfo] = useState
  const [tasks, setTasks] = useState([]);({
    taskName: "",
    taskDescription: "",
    taskDate: "",
    taskTime: "",
    taskImportance: "",
  });

  useEffect(() => {
    let _ud = localStorage.getItem("user_data");
    if (_ud) {
      let ud = JSON.parse(_ud);
      console.log(ud.id);
      console.log(ud.firstName);
      console.log(ud.lastName);
      setUser({ name: `${ud.firstName} ${ud.lastName}` });
    } 
    else 
    {
      console.log("ud not found");
    }
  }, []);

  const addExperience = () => {
    setProgress(progress + 10);
  };

  const addTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskFormSubmit = (e) => {
    e.preventDefault();
    // Prepare the data to send to the API
    var _ud = localStorage.getItem("user_data");
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    const data = {
      userId: userId,
      taskName: taskInfo.taskName,
      taskDescription: taskInfo.taskDescription,
      taskDifficulty: taskInfo.taskImportance,
    };

    fetch("/api/addTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("API Response:", result);
        setTasks([...tasks, taskInfo]); // Add the new task to the tasks array
        setTaskInfo({ // Reset task info
          taskName: "",
          taskDescription: "",
          taskImportance: "",
        });
        setShowTaskForm(false); // Hide the form after submitting
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
    };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInfo({
      ...taskInfo,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <div className="panel">
        {/* This is the panel header with the title and add button */}
        <div className="panel-header">
          <h1 className="panel-title">Add New Task</h1>
          {!showTaskForm && ( // Conditionally show this button
            <button
              type="button"
              id="addTask"
              onClick={() => setShowTaskForm(true)} // Toggle to show the form
            >
              Add Task
            </button>
          )}
        </div>

        {/* Task form that shows upon clicking the add task button */}
        {showTaskForm && (
          <form className="task-form" onSubmit={handleTaskFormSubmit}>
            <input
              type="text"
              name="taskName"
              placeholder="Task Name"
              value={taskInfo.taskName}
              onChange={handleTaskInputChange}
            />
            <input
              type="text"
              name="taskDescription"
              placeholder="Task Description"
              value={taskInfo.taskDescription}
              onChange={handleTaskInputChange}
            />
            <select
              name="taskImportance"
              value={taskInfo.taskImportance}
              onChange={handleTaskInputChange}
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button type="submit">Submit Task</button>
          </form>
        )}
        
        {/* Display the list of tasks below */}
        <div className="tasks-list">
          {tasks.map((task, index) => (
            <div key={index} className="task">
              <h2>{task.taskName}</h2>
              <p>{task.taskDescription}</p>
              <p>Difficulty: {task.taskImportance}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default LoggedInName;
