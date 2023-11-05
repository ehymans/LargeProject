import React, { useState, useEffect } from "react";
import { retrieveToken } from "../tokenStorage";
import "./HomePage.css";

function DisplayTasks() {
  const [tasks, setTasks] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      const _ud = localStorage.getItem("user_data");
      const ud = JSON.parse(_ud || "{}");

      if (ud && ud.id) {
        try {
          const response = await fetch("/api/searchtasks", {
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

    fetchData();
  }, []); // The empty array means this useEffect will run once, similar to componentDidMount

  return (
    <div className="tasks-container">
      <h2 className="tasks-header">Your Tasks</h2>
      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.TaskName}</td>
                <td>{task.TaskDescription}</td>
                <td>{task.TaskDifficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayTasks;
