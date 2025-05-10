'use client';

import GraphComponent from '@/components/GraphComponent';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ width: '100vw', height: '100vh' }}>
        <GraphComponent />
      </div>
    </ThemeProvider>
  );
}
