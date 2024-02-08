import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";

const ConfirmDialog = ({
  title,
  description,
  buttonText,
  open,
  closeDialog,
  action,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{ zIndex: 7000 }}
    >
      <Stack sx={{ minWidth: "320px", width: "100%" }}>
        <DialogTitle>{title}</DialogTitle>
        {description && (
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
              {description}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button variant='outlined' type='button' onClick={closeDialog}>
            취소
          </Button>
          <Button
            variant='contained'
            type='button'
            onClick={action}
            disabled={isLoading}
          >
            {buttonText}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

export default ConfirmDialog;
