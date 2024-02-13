import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/rootStore";

const AppDialog = () => {
  const {
    rootStore: {
      dialogStore: { isDialogOpen, closeDialog, confrimAction, dialogText },
    },
  } = useStore();

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => closeDialog()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogText}</DialogTitle>

      <DialogActions>
        <Button onClick={() => closeDialog()}>No</Button>
        <Button onClick={() => confrimAction()} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(AppDialog);
