import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    white: string;
    black: string;
    grey1: string;
    grey2: string;
    grey3: string;
    button: {
      border: string;
      background: string;
      text: string;
      borderDisabled: string;
      backgroundDisabled: string;
      textDisabled: string;
    };
    tabs: {
      active: string;
      inactive: string;
    };
    debit: {
      main: string;
    };
    credit: {
      main: string;
    };
  }
  interface PaletteOptions {
    white?: string;
    black?: string;
    grey1?: string;
    grey2?: string;
    grey3?: string;
    button?: {
      border: string;
      background: string;
      text: string;
      borderDisabled: string;
      backgroundDisabled: string;
      textDisabled: string;
    };
    tabs?: {
      active: string;
      inactive: string;
    };
    debit?: {
      main: string;
    };
    credit?: {
      main: string;
    };
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 768,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#90CAF9",
    },
    background: {
      default: "#121212",
      paper: "#222222",
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#B0B0B0",
    },
    white: "#FFFFFF",
    black: "#000000",
    grey1: "#333333",
    grey2: "#666666",
    grey3: "#999999",
    button: {
      border: "#FFFFFF",
      background: "#121212",
      text: "#FFFFFF",
      borderDisabled: "#666666",
      backgroundDisabled: "#121212",
      textDisabled: "#666666",
    },
    tabs: {
      active: "#FFFFFF",
      inactive: "#888888",
    },
    debit: {
      main: "#4CAF50",
    },
    credit: {
      main: "#F44336",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#E0E0E0",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#E0E0E0",
    },
  },
});

export default theme;
