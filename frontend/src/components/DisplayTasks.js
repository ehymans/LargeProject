import React, { useState, useEffect } from "react";
import { retrieveToken } from "../tokenStorage";
import "../styles/DisplayTasks.css";
import axios from "axios";
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var bp = require("./Path.js");

// Set the app element for react-modal
Modal.setAppElement(document.body);

function DisplayTasks({ updateTask, sortOption, showCompletedTasks }) {
  const [tasks, setTasks] = useState([]);
  

  const [isInitialLoad, setIsInitialLoad] = useState(true); // New state to track initial load

  const [isSorting, setIsSorting] = useState(false);

  const [prevSortOption, setPrevSortOption] = useState(sortOption);
  
  const [editTaskID, setEditTaskID] = useState("");
  
  const [IsOpenPopup, setIsOpenPopup] = useState(false);
  
  const [checkedTaskID, setCheckedTaskID] = useState("");
  
  //const [showingCompleted, setShowingCompleted] = useState(false);

  //const [sortOption, setSortOption] = useState(''); // Added for sorting

  const [formData, setFormData] = useState({
    TaskID: "",
    TaskName: "",
    TaskDescription: "",
    TaskDifficulty: "",
    TaskCompleted: false,
  });
  const fetchData = async () => {
    const _ud = localStorage.getItem("user_data");
    const ud = JSON.parse(_ud || "{}");

    if (ud && ud.id) {
      try {
        const response = await fetch(bp.buildPath("api/searchtasks"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers your API expects, such as an authorization header
          },
          body: JSON.stringify({
            userId: ud.id,
            search: "", // Since we're not using search, this can be an empty string
            jwtToken: retrieveToken(), // Include the JWT token from user data
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.results) {
          setTasks(data.results); // Set the tasks

          // Reset the initial load state after the animation duration
          setTimeout(() => {
            setIsInitialLoad(false);
          }, 500); // Adjust the time to match your animation duration
        } 
        else 
        {
          setTasks([]); // Handle the case where no results are returned
        }
      } 
      catch (error) 
      {
        console.error("Failed to load tasks:", error);
      }
    }
  };


  const getFilteredTasks = () => {
    let sortedTasks = getSortedTasks(); // Use your existing sorting function
    return sortedTasks.filter(task => showCompletedTasks ? task.TaskCompleted : !task.TaskCompleted);
  };


  // Function to handle sorting
  const getSortedTasks = () => {
    let sortedTasks = [...tasks];
    switch (sortOption) {
      case 'priority':
        // Custom sorting for priority
        sortedTasks.sort((a, b) => {
          const priorityOrder = ['High', 'Medium', 'Low']; // Define the order
          return priorityOrder.indexOf(a.TaskDifficulty) - priorityOrder.indexOf(b.TaskDifficulty);
        });
        break;
      case 'newest':
        // Reversing the order of tasks
        //sortedTasks.reverse();
        sortedTasks = [...tasks].reverse();
        break;
      case 'name':
        // Sorting by name
        sortedTasks.sort((a, b) => a.TaskName.localeCompare(b.TaskName));
        break;
      case 'oldest':
      default:
        // No sorting or default sorting logic
    }
    return sortedTasks;
  };

  useEffect(() => {
    // console.log('Tasks List Updated!');
    fetchData();
    if (isInitialLoad) {
      setTimeout(() => setIsInitialLoad(false), 500); // Duration of initial load animation
    }

    if (sortOption !== prevSortOption) {
      setIsSorting(true);
      setPrevSortOption(sortOption);

      const timer = setTimeout(() => {
        setIsSorting(false);
      }, 500); // Duration of sort animation

      return () => clearTimeout(timer);
    }
  }, [updateTask, sortOption]);

  const handleUpdate = async () => {
    const _ud = localStorage.getItem("user_data");
    const ud = JSON.parse(_ud || "{}");
    const Data = {
      _id: formData.TaskID,
      taskName: formData.TaskName, // Changed to 'taskName' to match backend
      taskDescription: formData.TaskDescription, // Changed to 'taskDescription'
      taskDifficulty: formData.TaskDifficulty, // Changed to 'taskDifficulty'
      TaskCompleted: formData.TaskCompleted, // Kept as 'TaskCompleted'
      jwtToken: retrieveToken(), // Include the JWT token if needed
    };
  
    try {
      const response = await axios.post(
        bp.buildPath("api/updatetask"), 
        Data
      );
  
      if (response.status === 200) {
        toast.success('Task Updated Successfully!', {
          position: 'top-right',
          autoClose: 5000,
        });
        fetchData();
        handleModalClose();
        console.log("Tasks List Updated!");
      }
    } catch (error) {
      console.error("Error while updating task: ", error);
      toast.error('Unable to update task. Something went wrong!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  //Updates Value after every change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleSelect = async (e, id) => {
    const isChecked = e.target.checked;
    let taskID = id ? id : formData.TaskID;
  
    if (!taskID.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid Task ID: ", taskID);
      toast.error('Invalid Task ID. Operation aborted!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
  
    const Data = {
      _id: taskID,
      TaskCompleted: isChecked,
      // Add other fields if needed as per your task schema
    };
  
    console.log('Task ID: ', taskID, 'Task Completed: ', isChecked);
  
    try {
      const response = await axios.post(
        bp.buildPath("api/updatetask"),
        Data
      );
  
      if (response.status === 200) {
        toast.success('Task Status Updated Successfully!', {
          position: 'top-right',
          autoClose: 5000,
        });
        fetchData();
        handleModalClose();
        console.log("Tasks list Updated!");
      }
    } catch (error) {
      console.error("Error while updating task status: ", error);
      toast.error('Unable to update task completion status. Something went wrong!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) {
      return;
    } try {
      const response = await axios.delete(
        bp.buildPath(`api/deletetask/${task._id}`)
      );
      if (response.status === 200) {
        toast.success('Task Deleted Successfully!', {
          position: 'top-right',
          autoClose: 5000,
        });
        fetchData();
        console.log("Tasks List Updated!");
      }
    } catch (error) {
      console.log("Error while deleting task: ", error);
      toast.error('Unable to delete task. Something went wrong!', {
        position: 'top-right', // Set the toast position
        autoClose: 3000, // Close the toast after 3 seconds (optional)
      });
    }
  };

  //Show Modal when button is clicked
  const handleClick = (task) => {
    setFormData({
      TaskID: task._id,
      TaskName: task.TaskName,
      TaskDescription: task.TaskDescription,
      TaskDifficulty: task.TaskDifficulty,
      TaskCompleted: !!task.TaskCompleted,
    });
    setIsOpenPopup(true);
    document.querySelector('.home-header').classList.add('blurred-background'); // Use the actual class that wraps your main content
    document.querySelector('.task-action-container').classList.add('blurred-background');
    document.querySelector('.tasks-container').classList.add('blurred-background');
    document.querySelector('.common-btn-style').classList.add('blurred-background'); //.add-task-container
  };

  //Close Modal
  const handleModalClose = () => {
    setIsOpenPopup(false);
    document.querySelector('.home-header').classList.remove('blurred-background');
    document.querySelector('.task-action-container').classList.remove('blurred-background');
    document.querySelector('.tasks-container').classList.remove('blurred-background');
    document.querySelector('.common-btn-style').classList.remove('blurred-background');
  };
  return (
    <>
      <Modal
        className="modal"
        overlayClassName="modal-overlay"
        isOpen={IsOpenPopup}
        onRequestClose={handleModalClose}>
        <FaTimes size={25} onClick={handleModalClose} className='cross-icon' />
        <div className="modal-main">
          <h1>Edit Task</h1>
          <form className="task-form">
            <input
              type="text"
              name="TaskName"
              placeholder="Task Title"
              value={formData.TaskName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="TaskDescription"
              placeholder="Task Description"
              value={formData.TaskDescription}
              onChange={handleChange}
            />
            <select
              name="TaskDifficulty"
              value={formData.TaskDifficulty}
              onChange={handleChange}
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <br />
            <input
              type="checkbox"
              name="TaskCompleted"
              id="completion-status"
              checked={formData.TaskCompleted}
              onChange={(e) => toggleSelect(e)}
            />
            <label htmlFor="completion-status">Task Completed</label>
            <br />
            <div className="btn-div">
              <button className="common-btn-style" onClick={handleUpdate}>Update Task</button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="tasks-container">
        {getFilteredTasks().map((task, index) => (
          <div key={index} className={`task-card ${isInitialLoad ? 'new-task-animation' : isSorting ? 'teleport-animation' : ''} ${showCompletedTasks ? 'show-completed-animation' : ''} ${task.TaskCompleted ? "completed-task" : ""}`}>
            <div className="title">
              {task.TaskName}
            </div>  
            <div className={`difficulty ${task.TaskDifficulty === 'Low' ? "low-difficulty" : task.TaskDifficulty === 'Medium' ? "moderate-difficulty" : "high-difficulty"}`}>
              {task.TaskDifficulty}
            </div>
            <div className={`description ${task.TaskCompleted && (task.TaskCompleted === true ? "strike-description" : '')}`}>
              {task.TaskDescription}
            </div>
            { !task.TaskCompleted && (
              <>
                <div className="completion-status">Completed?   
                  <input 
                    type="checkbox" 
                    name="TaskCompleted" 
                    checked={formData.TaskID === task._id ? formData.TaskCompleted : task.TaskCompleted} 
                    onChange={(e) => toggleSelect(e, task._id)} 
                  />
                </div>
                <div className="btn-container">
                  <button onClick={() => handleClick(task)} className="btn btn1">
                    EDIT
                  </button>
                  <button onClick={() => handleDelete(task)} className="btn btn2">
                    DELETE
                  </button>
                </div>
              </>
            )}
            {task.TaskCompleted && (
              <div className="completed-icon">
                { <img src="../images/checked.png" alt="Completed" /> }
              </div>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </>
  );
}

export default DisplayTasks;
