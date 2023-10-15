import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography } from "@mui/material";

export default function LoadBackdrop({ open, handleClose, message }) {
  return (
    <div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
        }}
        open={open}
      >
        <Box sx={{textAlign: 'center'}}>
            <CircularProgress color="inherit" />
            <Typography sx={{mt: 3}} variant="h5">{message}</Typography>
        </Box>
      </Backdrop>
    </div>
  );
}
