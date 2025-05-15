import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const ResetPasswordPage = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { theme: appTheme } = useUIStore();
  const { resetPassword, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    try {
      await resetPassword(token!, formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!token) {
    return null;
  }

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
              {t("auth:resetPassword")}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                {t("auth:passwordResetSuccess")}
              </Alert>
            )}

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
              <TextField
                required
                fullWidth
                label={t("auth:newPassword")}
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

              <TextField
                required
                fullWidth
                label={t("auth:confirmNewPassword")}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                error={formData.password !== formData.confirmPassword}
                helperText={
                  formData.password !== formData.confirmPassword
                    ? t("auth:passwordsDoNotMatch")
                    : ""
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={
                  isLoading || formData.password !== formData.confirmPassword
                }
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  t("auth:resetPassword")
                )}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
