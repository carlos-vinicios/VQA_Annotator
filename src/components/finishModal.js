import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FinishModal({open}) {
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Anotações Finalizadas
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Não temos mais nenhum arquivo para anotar.<br></br>
            Muito obrigado por sua ajuda.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}