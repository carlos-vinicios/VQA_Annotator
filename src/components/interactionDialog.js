import { forwardRef } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InteractionDialog({
  open,
  index,
  closeCallback,
  messages,
}) {

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{messages.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {messages.body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeCallback(false, index)}>Cancelar</Button>
        <Button onClick={() => closeCallback(true, index)}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
}
