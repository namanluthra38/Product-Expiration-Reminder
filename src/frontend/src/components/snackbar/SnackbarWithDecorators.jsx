import * as React from 'react';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';

export default function SnackbarWithDecorators({ open, onClose, message = "Your message was sent successfully." }) {
  return (
    <Snackbar
      variant="soft"
      color="success"
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
      endDecorator={
        <Button onClick={onClose} size="sm" variant="soft" color="success">
          Dismiss
        </Button>
      }
    >
      {message}
    </Snackbar>
  );
}
