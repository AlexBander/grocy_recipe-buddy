import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import axios from "axios";
import { rbTheme } from "../styles/styles";
import MenuAppBar from "../components/MenuAppBar";
import { useNavigate } from "react-router-dom";
import { tokenAtom } from "../App";

export function SettingsPage() {
  const [token, setToken] = useAtom(tokenAtom);

  const [grocyBaseUrl, setGrocyBaseUrl] = useState<string>("");
  const [grocyApiKey, setGrocyApiKey] = useState<string>("");
  const [grocySettingsCorrect, setGrocySettingsCorrect] =
    useState<boolean>(false);

  const navigate = useNavigate();

  async function updateSettings() {
    if (!(grocyApiKey && grocyBaseUrl)) throw new Error("Fill in boxes pls");

    try {
      const { data } = await axios.put(
        "/api/users",
        {
          grocyBaseUrl: grocyBaseUrl,
          grocyApiKey: grocyApiKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );
      console.log(data);
      setGrocySettingsCorrect(true);
    } catch (e) {
      console.log(e);
      setGrocySettingsCorrect(false);
    }
  }

  async function getCurrentSettings() {
    try {
      const { data } = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      console.log(data);
      setGrocyBaseUrl(data.grocyBaseUrl);
      setGrocyApiKey(data.grocyApiKey);
    } catch (e) {
      console.log(e);
    }
  }

  async function logout() {
    try {
      await axios.delete("/api/auth/login", {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      // @ts-ignore
      setToken({});
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getCurrentSettings();
  }, []);

  return (
    <ThemeProvider theme={rbTheme}>
      <Box sx={{ display: "flex" }}>
        <MenuAppBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            backgroundColor: (theme) => theme.palette.grey[100],
          }}
        >
          <Toolbar />
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Stack spacing={2}>
              <Paper>
                <Box sx={{ p: 2 }}>
                  <Stack justifyContent="center">
                    <Typography variant="h6">Grocy Settings</Typography>
                    <TextField
                      label="Grocy Base URL"
                      value={grocyBaseUrl}
                      onChange={(e) => setGrocyBaseUrl(e.target.value)}
                      margin="dense"
                    />
                    <TextField
                      label="Grocy API Key"
                      value={grocyApiKey}
                      onChange={(e) => setGrocyApiKey(e.target.value)}
                      margin="dense"
                    />
                    <Button onClick={updateSettings}>Update</Button>
                    {grocySettingsCorrect
                      ? "Connected to Grocy"
                      : "Cannot connect to Grocy"}
                  </Stack>
                </Box>
              </Paper>
              <Paper>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">User Settings</Typography>
                  <Button onClick={logout}>Log out</Button>
                </Box>
              </Paper>
              <Paper>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">System info</Typography>
                  <Typography variant="body1">
                    Backend available at {import.meta.env.VITE_BACKEND_BASE_URL}
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}