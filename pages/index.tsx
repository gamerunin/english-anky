import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CategoryList from "@/components/words/components/category-list/category-list";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import React from "react";

const theme = createTheme();

export default function IndexPage() {
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
              Список программ
            </Typography>
            <CategoryList />
          </Box>
        </Container>
      </ThemeProvider>
  )
}
