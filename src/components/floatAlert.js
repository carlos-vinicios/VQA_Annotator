import { useEffect } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";

import CloseIcon from "@mui/icons-material/Close";

export default function FloatAlert({ open, closeCallback, message, severity="success" }) {
  
  useEffect(() => {
    if(open){
      setTimeout(() => {
        closeCallback();
      }, 5000)
    }
  })
  
  return (
    <Box
      sx={{
        width: "50%",
        position: "fixed",
        right: 10,
        top: 20,
        zIndex: 9999,
      }}
    >
      <Collapse in={open}>
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={closeCallback}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
}
