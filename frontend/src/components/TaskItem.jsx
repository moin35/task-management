import React from "react";
import { ListItem, TextField, Select, MenuItem, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "../store/taskSlice";

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  const handleUpdate = (field, value) => {
    dispatch(updateTask({ ...task, [field]: value }));
  };

  return (
    <ListItem>
      <TextField value={task.name} onChange={(e) => handleUpdate("name", e.target.value)} />
      <TextField value={task.description} onChange={(e) => handleUpdate("description", e.target.value)} />
      <Select value={task.status} onChange={(e) => handleUpdate("status", e.target.value)}>
        <MenuItem value="To Do">To Do</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </Select>
      <IconButton onClick={() => dispatch(deleteTask(task.id))}>
        <Delete />
      </IconButton>
    </ListItem>
  );
};

export default TaskItem;
