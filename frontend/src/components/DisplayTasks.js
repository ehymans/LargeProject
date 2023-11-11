import React, { useState, useEffect } from "react";
import { retrieveToken } from "../tokenStorage";
import "../styles/DisplayTasks.css";
import axios from "axios";
var bp = require("./Path.js"); 

function DisplayTasks({ updateTask }) {
  const [tasks, setTasks] = useState([]);
  const [editTaskID, setEditTaskID] = useState("");
  const [checkedTaskID, setCheckedTaskID] = useState("");
  const [formData, setFormData] = useState({
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

  const handleEdit = async (task) => {
    if (task._id === editTaskID) {
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
          bp.buildPath(`api/updatetask/${task._id}`),
          Data
        );
        if (response.status === 200) {
          console.log("Task Updated Successfully!");
          fetchData();
          setEditTaskID("");
          setCheckedTaskID("");
          console.log("Tasks List Updated!");
        }
      } catch (error) {
        console.log("Error while updating task: ", error);
      }
    } else {
      setEditTaskID(task._id);
      setFormData({
        TaskName: task.TaskName,
        TaskDescription: task.TaskDescription,
        TaskDifficulty: task.TaskDifficulty,
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
    setCheckedTaskID(id);
    setFormData((prevState) => ({
      ...prevState,
      TaskCompleted: e.target.checked,
    }));
    const Data = {
      TaskCompleted: e.target.checked,
    };
    try {
      const response = await axios.put(
        bp.buildPath(`api/updatetask/${id}`),
        Data
      );
      if (response.status === 200) {
        console.log("Task Status Updated Successfully!");
        fetchData();
        setEditTaskID("");
        setCheckedTaskID("");
        console.log("Tasks list Updated!");
      }
    } catch (error) {
      console.log("Error while updating task status: ", error);
    }
  };

  const handleDelete = async (task) => {
    try {
      const response = await axios.delete(
        bp.buildPath(`api/deletetask/${task._id}`)
      );
      if (response.status === 200) {
        console.log("Task Deleted Successfully!");
        fetchData();
        setEditTaskID("");
        setCheckedTaskID("");
        console.log("Tasks List Updated!");
      }
    } catch (error) {
      console.log("Error while deleting task: ", error);
    }
  };
  return (
    <div className="tasks-container">
      <h2 className="tasks-header">Your Tasks</h2>
      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={index}
                className={task.TaskCompleted ? "completed-task" : ""}
              >
                <td className="data">
                  {task._id === editTaskID ? (
                    <input
                      type="text"
                      name="TaskName"
                      value={formData.TaskName}
                      onChange={handleChange}
                    />
                  ) : (
                    task.TaskName
                  )}
                </td>
                <td className="data">
                  {task._id === editTaskID ? (
                    <input
                      type="text"
                      name="TaskDescription"
                      value={formData.TaskDescription}
                      onChange={handleChange}
                    />
                  ) : (
                    task.TaskDescription
                  )}
                </td>
                <td className="data">
                  {task._id === editTaskID ? (
                    <input
                      type="text"
                      name="TaskDifficulty"
                      value={formData.TaskDifficulty}
                      onChange={handleChange}
                    />
                  ) : (
                    task.TaskDifficulty
                  )}
                </td>
                <td className="data">
                  <input
                    type="checkbox"
                    name="TaskCompleted"
                    checked={
                      checkedTaskID === task._id
                        ? formData.TaskCompleted
                        : task.TaskCompleted
                    }
                    onChange={(e) => toggleSelect(e, task._id)}
                  />
                </td>
                <td>
                  <button onClick={() => handleEdit(task)}>
                    {task._id === editTaskID ? "Update" : "Edit"}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(task)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayTasks;
