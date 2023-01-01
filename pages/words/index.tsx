import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import WordList from "@/components/words/components/word-list/word-list";
import React from "react";

const theme = createTheme();

const WordsPage: React.FC = (): JSX.Element => {
  return (
      <ThemeProvider theme={theme}>
        <Container component="main">
          <CssBaseline />
          <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
          >
            <Typography component="h1" variant="h4" sx={{ marginTop: '10px', marginBottom: '30px' }}>
              Список слов
            </Typography>
            <WordList />
          </Box>
        </Container>
      </ThemeProvider>
  )
}
export default WordsPage;
