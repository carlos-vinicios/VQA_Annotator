'use client'

import { useEffect } from 'react';
import { redirect } from 'next/navigation'
import { Button, Grid, TextField, Box, Typography, Paper } from '@mui/material';

export default function Home() {
  //aqui será feito o contole do usuário que está anotando
  useEffect(() => {
    redirect('/annotation')
  }, [])
  
  return (
    <Box
      pl={3} pr={3}
      mt={3} mb={3}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Em construção
      </Typography>
    </Box>
  );
}