import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";

const Home = () => {
  return (
    <Container>
      <Typography variant="h4">Welcome to Task Manager</Typography>
      <Button component={Link} to="/tasks" variant="contained">Go to Tasks</Button>
    </Container>
  );
};

export default Home;
