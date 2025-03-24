import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/taskSlice";
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

// ENUM for Task Status
const TASK_STATUSES = ["To Do", "In Progress", "Done"];

const AddTask = () => {
  const dispatch = useDispatch();
  const [task, setTask] = useState({
    name: "",
    description: "",
    status: "To Do", // Default value
    dueDate: "",
  });

  // Handle Input Changes
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.trim() === "") {
      alert("Task name is required!");
      return;
    }

    dispatch(addTask(task)); // Dispatch to Redux store
    setTask({ name: "", description: "", status: "To Do", dueDate: "" }); // Reset form
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Task Name"
        name="name"
        value={task.name}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        name="description"
        value={task.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={2}
        sx={{ mb: 2 }}
      />
      
      {/* Task Status Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={task.status}
          onChange={handleChange}
          required
        >
          {TASK_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Due Date"
        name="dueDate"
        type="date"
        value={task.dueDate}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" color="primary">
        Add Task
      </Button>
    </Box>
  );
};

export default AddTask;
