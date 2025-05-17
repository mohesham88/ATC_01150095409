import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Language,
  Login,
  Logout,
} from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { t } = useTranslation(["common"]);
  const theme = useTheme();
  const navigate = useNavigate();
  const { theme: appTheme, setTheme } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  const handleThemeToggle = () => {
    setTheme(appTheme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: appTheme === "dark" ? "background.paper" : "primary.main",
        boxShadow: 1,
        margenBottom: 8,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          MEvent
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={handleThemeToggle}
            sx={{ ml: 1 }}
          >
            {appTheme === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleLanguageMenu}
            sx={{ ml: 1 }}
          >
            <Language />
          </IconButton>

          {isAuthenticated && user ? (
            <>
              <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
                <Avatar
                  src={user.profile?.avatar}
                  alt={user.username}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchorEl}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                  },
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  {t("common:logout")}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate("/auth")}
              startIcon={<Login />}
              sx={{ ml: 1 }}
            >
              {t("common:login")}
            </Button>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLanguageClose}
        >
          <MenuItem onClick={() => handleLanguageChange("en")}>
            English
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange("ar")}>
            العربية
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
