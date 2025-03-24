// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { TextField, Button, Box, Typography, Container, Paper } from "@mui/material";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({
        email: usernameOrEmail,
        password
      });
      console.log('res',response)
      localStorage.setItem("token", response.access_token);
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 3, color: "#333", fontWeight: "bold", textAlign: "center" }}>
          Task Management Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Email"
            fullWidth
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            margin="normal"
            required
            sx={{ backgroundColor: "#f5f5f5", borderRadius: "4px" }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            sx={{ backgroundColor: "#f5f5f5", borderRadius: "4px" }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" } }}
          >
            LOGIN
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;