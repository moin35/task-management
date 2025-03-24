import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTaskStatus } from "../redux/taskSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import AddTask from "../components/AddTask";

// ENUM for Task Status
const TASK_STATUSES = ["To Do", "In Progress", "Done"];

const Tasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);

  // Handle Drag & Drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const taskId = result.draggableId;

    dispatch(updateTaskStatus({ id: taskId, newStatus: destination.droppableId }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task List
      </Typography>
      <AddTask />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {TASK_STATUSES.map((status) => (
            <Grid item xs={12} md={4} key={status}>
              <Typography variant="h6" align="center">
                {status}
              </Typography>
              <Droppable droppableId={status}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: "200px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      p: 2,
                    }}
                  >
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 2,
                                cursor: "grab",
                                transition: "0.3s",
                                "&:hover": { boxShadow: 3 },
                              }}
                            >
                              <CardContent>
                                <Typography variant="h6">{task.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {task.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Due: {task.dueDate}
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default Tasks;
