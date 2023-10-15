"use client";

import { signIn } from "next-auth/react"
import { useState } from "react";
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
  AlertTitle,
  Collapse,
} from "@mui/material";
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleLogin =  async () => {
    const loginData = {email: email, token: token}
    const res = await signIn('credentials', {
      ...loginData,
      redirect: false,
    });
    if(!res.error){
      router.push("/");
    }else{
      setLoginError(true)
    }
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
                  <Alert 
                    onClose={() => setLoginError(false)}
                    severity="error" 
                  >
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
