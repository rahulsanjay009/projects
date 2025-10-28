import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Paper
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import APIService from "../../services/APIService";
import { useAuth, isAuthenticated } from "./useAuth";

const Authorize = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const from = location.state?.from || "/";
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const handleAuthorize = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    APIService().authorizeAdmin(tokenInput).then((data) => {
      console.log(data)
      if (data?.success) {
        login();
        navigate("/");
      } else {
        setError("Invalid Admin Token. Please try again.");
      }}).catch((err) => {
        setError("An error occurred. Please try again.");
      }).finally
      (() => setIsLoading(false));
  };

  useEffect(()=>{
    if(authenticated)
      navigate("/")
  },[authenticated])
  // Already authenticated
  if (authenticated) {
    navigate("/");
    return;
  }

  return (
    <Dialog open fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Admin Console Access
      </DialogTitle>
      <DialogContent dividers>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          Enter your administrative token to proceed.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          type="password"
          label="Admin Token"
          variant="outlined"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 3 }}>
        <Button
          onClick={handleAuthorize}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading ? "Authorizing..." : "Authorize Access"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Authorize;
