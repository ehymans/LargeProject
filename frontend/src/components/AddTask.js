import React, { useState, useEffect } from "react";
import "../styles/AddTask.css";
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var bp = require("./Path.js");

// Set the app element for react-modal
Modal.setAppElement(document.body);

function LoggedInName({ prevState, setUpdateTask }) {
  const [user, setUser] = useState({});
  const [IsOpenPopup, setIsOpenPopup] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskInfo, setTaskInfo] = useState({
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
    } else {
      console.log("ud not found");
    }
  }, []);

  //Show Modal when button is clicked
  const handleClick = (e) => {
    setIsOpenPopup(true);
  };

  //Close Modal
  const handleModalClose = () => {
    setTaskInfo({
      taskName: "",
      taskDescription: "",
      taskDate: "",
      taskTime: "",
      taskImportance: "",
    });
    setIsOpenPopup(false);
  };

  // const addExperience = () => {
  //   setProgress(progress + 10);
  // };


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

    fetch(bp.buildPath("api/addTask"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("API Response:", result);
        setUpdateTask(!prevState);
        handleModalClose();
        toast.success('New Task is Added!', {
          position: 'top-right',
          autoClose: 5000,
        });
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error('Unable to create new task. Something went wrong!', {
          position: 'top-right', // Set the toast position
          autoClose: 3000, // Close the toast after 3 seconds (optional)
        });
      });

    setShowTaskForm(false);
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInfo({
      ...taskInfo,
      [name]: value,
    });
  };

  return (
    <div className="add-task">
      <Modal
        className="modal"
        overlayClassName="modal-overlay"
        isOpen={IsOpenPopup}
        //style={customStyles}
        onRequestClose={handleModalClose}>
        <FaTimes size={25} onClick={handleModalClose} className='cross-icon' />
        <div className="modal-main">
          <h1>Add Task</h1>
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
              style={{ width: '100%' }}
              value={taskInfo.taskImportance}
              onChange={handleTaskInputChange}
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <br />
            <button type="submit">Submit Task</button>
          </form>

        </div>
      </Modal>
      <div className="btn-div">
        <button type="button" className="btn" onClick={handleClick}>
          Add a New Task
        </button>
      </div>
      <ToastContainer />

    </div >
  );
}

export default LoggedInName;
