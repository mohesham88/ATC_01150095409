import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const notify = useNotify();
  const { t } = useTranslation("admin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (e) {
      console.error(e);
      notify("Invalid credentials", { type: "error" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        minWidth: "100vw",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", mx: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            {t("admin:login.title")}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t("admin:login.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t("admin:login.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
              {t("admin:login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
