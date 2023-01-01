import Play from "@/components/play/play";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from "react";
import {useRouter} from "next/router";

const theme = createTheme();

const PlayPage: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { id: categoryId } = router.query;

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
            <Play category={Number(categoryId)} />
          </Box>
        </Container>
      </ThemeProvider>
  )
}
export default PlayPage;