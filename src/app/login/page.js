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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const authData = decodeAuthData("systems");
    if (authData) {
      router.push("/vote");
    }
  }, []);

  const handleLogin = () => {
    const loginData = { username, password };
    authService
      .login(loginData)
      .then((authData) => {
        setAuthDataCookie(authData);
        router.push("/evaluation");
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
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleLogin();
              }}
            >
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
                    <InputLabel>Username</InputLabel>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <FormControl fullWidth>
                    <InputLabel>Senha</InputLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      onClick={handleLogin}
                      variant="contained"
                      type="submit"
                    >
                      Entrar
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <Collapse in={loginError}>
                    <Alert
                      onClose={() => setLoginError(false)}
                      severity="error"
                    >
                      Email ou token estão incorretos.
                    </Alert>
                  </Collapse>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
