import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import React from "react";

const Play: React.FC = (): JSX.Element => {
  return (
      <>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <QuestionMarkIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ marginTop: '30px' }}>
          Were your assignments handled individually or were they a team effort?
        </Typography>
        <TextField
            sx={{ maxWidth: '50ch', marginTop: '30px' }}
            hiddenLabel
            margin="normal"
            required
            fullWidth
            id="text"
            name="text"
            autoFocus
        />
        <Typography component="span" variant="subtitle1" sx={{ color: 'red', marginTop: '20px' }}>
          Выполнялись ли ваши задания индивидуально или это была командная работа?
        </Typography>
        <Typography component="span" variant="subtitle1" sx={{ color: 'green', marginTop: '20px' }}>
          Верно!
        </Typography>

      </>
  )
}
export default Play;
