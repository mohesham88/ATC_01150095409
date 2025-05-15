import React, { useMemo, type ReactNode } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material";
import { useUIStore } from "../store/uiStore";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  // Get the theme mode from Zustand store
  const appTheme = useUIStore((state) => state.theme) as PaletteMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: appTheme,
        },
      }),
    [appTheme]
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
