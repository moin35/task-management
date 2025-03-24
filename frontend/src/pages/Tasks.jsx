// src/pages/Tasks.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus,
  optimisticUpdate,
  revertUpdate
} from "../redux/taskSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import { Add, CalendarMonth, Delete, Edit, Save } from "@mui/icons-material";

const TASK_STATUSES = ["To Do", "In Progress", "Done"];

const Tasks = () => {
  const dispatch = useDispatch();
  const { items: tasks, status, error } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState({ name: "", description: "", dueDate: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ name: "", description: "", dueDate: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({ name: "", dueDate: "" });
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute filtered tasks directly from Redux state
  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Drag and drop handler
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const originalTask = tasks.find(t => t.id === taskId);
  
    if (originalTask) {
      dispatch(optimisticUpdate({
        id: taskId,
        status: newStatus,
        original: originalTask
      }));
  
      dispatch(updateTaskStatus({ id: taskId, status: newStatus }))
        .unwrap()
        .then(() => dispatch(fetchTasks()))  // Add fetch after successful status update
        .catch(() => dispatch(revertUpdate({ id: taskId, original: originalTask })));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = { name: "", dueDate: "" };
    let isValid = true;

    if (!newTask.name.trim()) {
      newErrors.name = "Task name is required";
      isValid = false;
    }

    if (!newTask.dueDate) {
      newErrors.dueDate = "Due date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Add new task
  const handleAddTask = (status) => {
    if (!validateForm()) return;
    
    const tempId = Date.now().toString();
    const newTaskWithStatus = { ...newTask, status, id: tempId };
    
    dispatch(optimisticUpdate(newTaskWithStatus));
    dispatch(createTask(newTaskWithStatus))
      .unwrap()
      .then(() => dispatch(fetchTasks())) // Add fetch after success
      .catch(() => dispatch(revertUpdate({ id: tempId })));
  
    setNewTask({ name: "", description: "", dueDate: "" });
    setOpenDialog(false);
  };

  // Edit existing task
  const handleSaveTask = (taskId) => {
    const original = tasks.find(t => t.id === taskId);
    
    dispatch(optimisticUpdate({ id: taskId, ...editedTask }));
    dispatch(updateTask({ id: taskId, ...editedTask }))
      .unwrap()
      .then(() => dispatch(fetchTasks())) // Add fetch after success
      .catch(() => dispatch(revertUpdate({ id: taskId, original })));
    
    setEditingTaskId(null);
  };
  // Delete task
  const handleDeleteTask = (taskId) => {
    const original = tasks.find(t => t.id === taskId);
    
    dispatch(optimisticUpdate({ id: taskId, _deleting: true }));
    dispatch(deleteTask(taskId))
      .unwrap()
      .then(() => dispatch(fetchTasks())) // Add fetch after success
      .catch(() => dispatch(revertUpdate({ id: taskId, original })));
  };

  // Loading state
  if (status === 'loading') {
    return (
      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {TASK_STATUSES.map((status) => (
            <Grid item xs={12} md={4} key={status}>
              <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Error state
  if (status === 'failed') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Error: {error}</Typography>
        <Button 
          onClick={() => dispatch(fetchTasks())} 
          variant="contained"
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
        Task Manager
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search tasks by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ 
          mb: 3, 
          backgroundColor: "background.paper",
          '& .MuiOutlinedInput-root': { borderRadius: 2 }
        }}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          {TASK_STATUSES.map((status) => (
            <Grid item xs={12} md={4} key={status}>
              <Box sx={{ 
                bgcolor: "background.paper", 
                borderRadius: 2, 
                p: 2, 
                boxShadow: 1,
                minHeight: 500
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                  {status}
                </Typography>

                <Droppable droppableId={status}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: 400 }}
                    >
                      {filteredTasks
                        .filter(task => task.status === status)
                        .map((task, index) => (
                          <Draggable 
                            key={task.id} 
                            draggableId={task.id} 
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ 
                                  mb: 2,
                                  cursor: 'grab',
                                  transition: '0.2s',
                                  opacity: task._pending ? 0.7 : 1,
                                  backgroundColor: task._pending ? '#fffde7' : '#fafafa',
                                  '&:hover': { transform: 'translateY(-2px)' }
                                }}
                              >
                                {task._pending && (
                                  <CircularProgress 
                                    size={24}
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                  />
                                )}
                                <CardContent>
                                  {editingTaskId === task.id ? (
                                    <>
                                      <TextField
                                        value={editedTask.name}
                                        onChange={(e) => setEditedTask(prev => ({
                                          ...prev,
                                          name: e.target.value
                                        }))}
                                        fullWidth
                                        sx={{ mb: 1 }}
                                      />
                                      <TextField
                                        value={editedTask.description}
                                        onChange={(e) => setEditedTask(prev => ({
                                          ...prev,
                                          description: e.target.value
                                        }))}
                                        multiline
                                        fullWidth
                                        rows={2}
                                        sx={{ mb: 1 }}
                                      />
                                      <TextField
                                        type="date"
                                        value={editedTask.dueDate}
                                        onChange={(e) => setEditedTask(prev => ({
                                          ...prev,
                                          dueDate: e.target.value
                                        }))}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <Typography variant="h6" gutterBottom>
                                        {task.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {task.description}
                                      </Typography>
                                      <Box display="flex" alignItems="center" mt={1}>
                                        <CalendarMonth fontSize="small" color="action" />
                                        <Typography variant="body2" ml={1} color="text.secondary">
                                          {task.dueDate}
                                        </Typography>
                                      </Box>
                                    </>
                                  )}

                                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    {editingTaskId === task.id ? (
                                      <IconButton 
                                        onClick={() => handleSaveTask(task.id)}
                                        size="small"
                                      >
                                        <Save fontSize="small" />
                                      </IconButton>
                                    ) : (
                                      <IconButton 
                                        onClick={() => {
                                          setEditedTask(task);
                                          setEditingTaskId(task.id);
                                        }}
                                        size="small"
                                      >
                                        <Edit fontSize="small" />
                                      </IconButton>
                                    )}
                                    <IconButton 
                                      onClick={() => handleDeleteTask(task.id)}
                                      size="small"
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setSelectedStatus(status);
                    setOpenDialog(true);
                  }}
                  sx={{ mt: 2 }}
                >
                  Add Task
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Task Name"
            fullWidth
            value={newTask.name}
            onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.dueDate}
            onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleAddTask(selectedStatus)}
            variant="contained"
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;