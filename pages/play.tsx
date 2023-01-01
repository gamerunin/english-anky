import Play from "@/components/play/play";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from "react";

const theme = createTheme();

const PlayPage: React.FC = (): JSX.Element => {
  return (
      <ThemeProvider theme={theme}>
        <Container component="main">
          <CssBaseline />
          <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
          >
            <Play />
          </Box>
        </Container>
      </ThemeProvider>
  )
}
export default PlayPage;