"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Paper,
  FormControl,
  Button,
  InputLabel,
  Input,
  Typography,
  Alert,
  Collapse,
} from "@mui/material";
import { useRouter } from "next/navigation";
import authService from "@/services/api/authService";
import { setAuthDataCookie } from "@/services/auth";
import { decodeAuthData } from "@/services/jwt";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const authData = decodeAuthData("systems");
    if (authData) {
      router.push("/vote");
    }
  }, []);

  const handleLogin = () => {
    const loginData = { username: email, password: token };
    authService
      .login(loginData)
      .then((authData) => {
        setAuthDataCookie(authData);
        router.push("/vote");
      })
      .catch((err) => {
        console.log("Erro no login:", err);
        setLoginError(true);
      });
  };

  return (
    <Box pl={3} pr={3} mt={3} mb={3}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item sm={8} lg={4}>
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} lg={12}>
                <Typography variant="h4" sx={{ textAlign: "center" }}>
                  VQA Annotator
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <FormControl fullWidth>
                  <InputLabel>Email</InputLabel>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <FormControl fullWidth>
                  <InputLabel>Token</InputLabel>
                  <Input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <Box sx={{ textAlign: "center" }}>
                  <Button onClick={handleLogin} variant="contained">
                    Entrar
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <Collapse in={loginError}>
                  <Alert onClose={() => setLoginError(false)} severity="error">
                    Email ou token estão incorretos.
                  </Alert>
                </Collapse>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
