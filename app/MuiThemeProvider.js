'use client'
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';

export default function MuiThemeProvider({ children }) {

    const themeDark = createTheme({
        palette: {
            mode: 'dark',
        },
        typography: {
            fontFamily: 'Quicksand, sans-serif',
            button: {
                textTransform: 'none',
            },
        },
    })

    return (
        <ThemeProvider theme={themeDark}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}