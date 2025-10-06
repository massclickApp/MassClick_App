import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authAction.js';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  InputAdornment,
  IconButton,
  Link,
  TextField,
  Typography,
  Stack,
  CssBaseline,
  Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import GoogleIcon from './googleIcon.js';
import { useNavigate } from 'react-router-dom';
import companyLogo from "../../assets/mclogo.png";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


function ColorSchemeToggle({ mode, setMode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <IconButton
      aria-label="toggle light/dark mode"
      disabled={!mounted}
      sx={{
        border: '1px solid #ccc',
        transition: 'all 0.3s',
        '&:hover': { transform: 'rotate(20deg)', backgroundColor: '#f5f5f5' },
      }}
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function Login({ setIsAuthenticated }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [mode, setMode] = useState('light');
  const [showPassword, setShowPassword] = useState(false);

  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: { main: '#ea6d11' },
        secondary: { main: '#1976d2' },
        background: { default: mode === 'light' ? '#f8f9fa' : '#121212' },
      },
      typography: { fontFamily: `'Inter', sans-serif` },
    }), [mode]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userName, password));
  };

  useEffect(() => {
    if (auth.user && auth.accessToken) {
      localStorage.setItem("userName", auth.user.userName || auth.user.email);
      localStorage.setItem("accessToken", auth.accessToken);
      localStorage.setItem("refreshToken", auth.refreshToken);
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [auth, navigate, setIsAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>

        {/* Left Side - Login Form */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', px: 4 }}>
          <Paper elevation={6} sx={{ p: 6, borderRadius: 4, width: { xs: '90%', sm: 450 } }}>
            <Stack spacing={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <IconButton color="primary"><BadgeRoundedIcon /></IconButton>
                  <Box component="img" src={companyLogo} alt="Company Logo" sx={{ height: 40 }} />
                </Box>
                <ColorSchemeToggle mode={mode} setMode={setMode} />
              </Box>

              <Stack spacing={1}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Sign in</Typography>
                <Typography variant="body2">
                  New to company? <Link href="#">Sign up!</Link>
                </Typography>
              </Stack>

              <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} sx={{ borderRadius: 3 }}>
                Continue with Google
              </Button>

              <Divider>or</Divider>

              {auth.error && <Typography color="error">{auth.error.message || auth.error}</Typography>}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <TextField
                  label="Username"
                  size="small"
                  variant="outlined"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  fullWidth
                  required
                />

                <TextField
                  label="Password"
                  size="small"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
                  <Link href="#">Forgot password?</Link>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={auth.loading}
                  sx={{ borderRadius: 3, py: 1.5, fontWeight: 600 }}
                >
                  {auth.loading ? 'Logging in...' : 'Sign in'}
                </Button>
              </form>

              <Typography variant="caption" sx={{ textAlign: 'center', mt: 4 }}>
                © MassClick {new Date().getFullYear()}
              </Typography>
            </Stack>
          </Paper>
        </Box>

        {/* Right Side - Info Section */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #ea6d11 0%, #ff9800 100%)',
            flexDirection: 'column',
            textAlign: 'center',
            px: 8,
            py: 6,
            gap: 4,
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontWeight: 800,
              textShadow: '2px 2px 6px rgba(0,0,0,0.35)',
              letterSpacing: '0.5px',
              lineHeight: 1.2,
              maxWidth: '800px',
            }}
          >
            Discover & Connect with Local Businesses Instantly
          </Typography>

          <Typography
            sx={{
              color: '#fffef0',
              fontSize: { xs: '1.4rem', md: '2rem' },
              fontWeight: 500,
              textShadow: '1px 1px 4px rgba(0,0,0,0.25)',
              maxWidth: '700px',
            }}
          >
            Your trusted search engine for restaurants, shops, and services worldwide
          </Typography>

          <Typography
            sx={{
              color: '#fff',
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              opacity: 0.95,
              textShadow: '1px 1px 3px rgba(0,0,0,0.25)',
              maxWidth: '650px',
            }}
          >
            Explore reviews, ratings, contact details, and directions — all in one place
          </Typography>

          <Typography
            sx={{
              color: '#fff',
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontWeight: 400,
              opacity: 0.9,
              textShadow: '0px 1px 2px rgba(0,0,0,0.2)',
              maxWidth: '600px',
            }}
          >
            Bringing local businesses closer to you with a world-class experience
          </Typography>
        </Box>





      </Box>
    </ThemeProvider>
  );
}
