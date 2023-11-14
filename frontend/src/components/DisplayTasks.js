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

function DisplayTasks({ updateTask }) {
  const [tasks, setTasks] = useState([]);
  const [editTaskID, setEditTaskID] = useState("");
  const [IsOpenPopup, setIsOpenPopup] = useState(false);
  const [checkedTaskID, setCheckedTaskID] = useState("");
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
          setTasks(data.results); // Assuming data.results is the array of tasks
        } else {
          setTasks([]); // Handle the case where no results are returned
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []); // The empty array means this useEffect will run once, similar to componentDidMount

  useEffect(() => {
    // console.log('Tasks List Updated!');
    fetchData();
  }, [updateTask]);

  const handleUpdate = async () => {
    const _ud = localStorage.getItem("user_data");
    const ud = JSON.parse(_ud || "{}");
    const Data = {
      TaskName: formData.TaskName,
      TaskDescription: formData.TaskDescription,
      TaskDifficulty: formData.TaskDifficulty,
      UserID: ud.id,
    };
    try {
      const response = await axios.put(
        bp.buildPath(`api/updatetask/${formData.TaskID}`),
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
      console.log("Error while updating task: ", error);
      toast.error('Unable to update task. Something went wrong!', {
        position: 'top-right', // Set the toast position
        autoClose: 3000, // Close the toast after 3 seconds (optional)
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
    let taskID;
    if (id) {
      setFormData((prevState) => ({
        ...prevState,
        TaskCompleted: e.target.checked,
        TaskID: id,
      }));
      taskID = id;
    }
    else {
      setFormData((prevState) => ({
        ...prevState,
        TaskCompleted: e.target.checked,
      }));
      taskID = formData.TaskID;
    }
    const Data = {
      TaskCompleted: e.target.checked,
    };
    console.log('Task ID: ', taskID);
    try {
      const response = await axios.put(
        bp.buildPath(`api/updatetask/${taskID}`),
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
      console.log("Error while updating task status: ", error);
      toast.error('Unable to update task completion status. Something went wrong!', {
        position: 'top-right', // Set the toast position
        autoClose: 3000, // Close the toast after 3 seconds (optional)
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
  };

  //Close Modal
  const handleModalClose = () => {
    setIsOpenPopup(false);
  };
  return (
    <>
      <Modal
        className="modal1"
        overlayClassName="modal-overlay"
        isOpen={IsOpenPopup}
        //style={customStyles}
        onRequestClose={handleModalClose}>
        <FaTimes size={25} onClick={handleModalClose} className='cross-icon' />
        <div className="modal-main">
          <h1>Edit Task</h1>
          <label htmlFor="task-title">Task Title:</label>
          <input
            type="text"
            id="task-title"
            name="TaskName"
            value={formData.TaskName}
            onChange={handleChange}
          />
          <label htmlFor="difficulty">Task Priority:</label>
          <br />
          <select
            type="text"
            name="TaskDifficulty"
            id="difficulty"
            value={formData.TaskDifficulty}
            onChange={handleChange}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <br />

          <label htmlFor="description">Task Description:</label>
          <input
            type="text"
            name="TaskDescription"
            id="description"
            value={formData.TaskDescription}
            onChange={handleChange}
          />

          <label htmlFor="completion-status">Task Completed: </label>
          <input
            type="checkbox"
            name="TaskCompleted"
            id="completion-status"
            checked={
              formData.TaskCompleted
            }
            onChange={(e) => toggleSelect(e)}
          />
          <br />
          <div className="btn-div">
            <button className="btn" onClick={handleUpdate}>Update Task</button>
          </div>
        </div>
      </Modal >

      <div className="tasks-container">
        {tasks.map((task, index) => (
          <div key={index} className={`task-card ${task.TaskCompleted ? "completed-task" : ""}`}>
            <div className="title">
              {task.TaskName}
            </div>
            <div className={`difficulty ${task.TaskDifficulty === 'Low' ? "low-difficulty" : task.TaskDifficulty === 'Medium' ? "moderate-difficulty" : "high-difficulty"}`}>
              {task.TaskDifficulty}
            </div>
            <div className={`description ${task.TaskCompleted && (task.TaskCompleted === true ? "strike-description" : '')}`}>
              {task.TaskDescription}
            </div>
            <div className="completion-status">
              <input type="checkbox" name="TaskCompleted" checked={formData.TaskID === task._id ? formData.TaskCompleted : task.TaskCompleted} onChange={(e) => toggleSelect(e, task._id)} />
            </div>
            <div className="btn-container">
              <button onClick={() => handleClick(task)} className="btn btn1">
                EDIT
              </button>
              <button onClick={() => handleDelete(task)} className="btn btn2">
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </>
  );
}

export default DisplayTasks;
