import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { useTranslation } from "react-i18next";
import { Navigate, Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar";

const AuthPage = () => {
  const { t } = useTranslation(["auth", "common"]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { theme: appTheme } = useUIStore();
  const { login, isLoading, error, isAuthenticated, register, forgotPassword } =
    useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Redirect if user is already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await register(formData.email, formData.password, formData.username);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAuthMode = () => setIsLogin(!isLogin);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to send reset password email:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        bgcolor: appTheme === "dark" ? "background.default" : "grey.100",
      }}
    >
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: appTheme === "dark" ? "background.paper" : "white",
              borderRadius: 2,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              {showForgotPassword
                ? t("auth:forgotPassword")
                : isLogin
                ? t("auth:login")
                : t("auth:register")}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            {forgotPasswordSuccess && (
              <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                {t("auth:resetPasswordEmailSent")}
              </Alert>
            )}

            {showForgotPassword ? (
              <Box
                component="form"
                onSubmit={handleForgotPassword}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  required
                  fullWidth
                  label={t("auth:email")}
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  {isLoading ? t("common:loading") : t("auth:sendResetLink")}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => setShowForgotPassword(false)}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                  }}
                >
                  {t("auth:backToLogin")}
                </Button>
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {!isLogin && (
                  <TextField
                    required
                    fullWidth
                    label={t("auth:username")}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    variant="outlined"
                  />
                )}

                <TextField
                  required
                  fullWidth
                  label={t("auth:email")}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />

                <TextField
                  required
                  fullWidth
                  label={t("auth:password")}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {isLogin && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="text"
                      onClick={() => setShowForgotPassword(true)}
                      sx={{ textTransform: "none" }}
                    >
                      {t("auth:forgotPassword")}
                    </Button>
                  </Box>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} />
                    ) : isLogin ? (
                      <LoginIcon />
                    ) : (
                      <RegisterIcon />
                    )
                  }
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  {isLoading
                    ? t("common:loading")
                    : isLogin
                    ? t("auth:login")
                    : t("auth:register")}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={toggleAuthMode}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                  }}
                >
                  {isLogin ? t("auth:noAccount") : t("auth:haveAccount")}
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthPage;
