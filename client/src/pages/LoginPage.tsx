// client/src/pages/LoginPage.tsx
// صفحه ورود به سیستم با طراحی گلس‌مورفیک و مدرن

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Visibility, VisibilityOff, MailOutline, Lock, Fingerprint } from '@mui/icons-material';
import AnimatedLogo from '../components/layout/AnimatedLogo';

// پالت رنگی جدید
const colors = {
  primary: '#3a7bd5',
  secondary: '#3a6073', 
  accent: '#00d2ff',
  gradientStart: '#2c3e50',
  gradientEnd: '#4ca1af',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  cardBg: 'rgba(16, 18, 27, 0.4)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  buttonGradientStart: '#3a7bd5',
  buttonGradientEnd: '#00d2ff',
  errorBg: 'rgba(239, 83, 80, 0.15)'
};

const particles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 15
}));

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFingerprint, setShowFingerprint] = useState(true);
  
  const { login } = useAuth();

  const handleClickAnywhere = () => {
    setShowFingerprint(false);
  };

  useEffect(() => {
    setMounted(true);
    
    document.addEventListener('click', handleClickAnywhere);
    
    return () => {
      setMounted(false);
      document.removeEventListener('click', handleClickAnywhere);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await login(username, password);
    } catch (err) {
      setError((err as Error).message);
      setPassword('');
      setTimeout(() => {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
          passwordInput.focus();
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.id === 'username') {
      setUsername(e.target.value);
    } else if (e.target.id === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
      }}
    >
      {/* اثر انگشت متحرک */}
      {showFingerprint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            scale: [0.9, 1.1, 0.9],
            y: [0, -20, 0] 
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop'
          }}
          style={{
            position: 'absolute',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.accent,
            pointerEvents: 'none'
          }}
          exit={{ 
            opacity: 0, 
            scale: 2,
            rotate: 20,
            transition: { duration: 0.5 } 
          }}
        >
          <Fingerprint sx={{ fontSize: 80, filter: `drop-shadow(0 0 10px ${alpha(colors.accent, 0.7)})` }} />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Typography 
              sx={{ 
                mt: 2, 
                color: colors.textSecondary,
                textAlign: 'center'
              }}
            >
              برای ورود کلیک کنید
            </Typography>
          </motion.div>
        </motion.div>
      )}
      
      {/* ذرات متحرک پس‌زمینه */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: `${particle.x}%`, 
            y: `${particle.y}%`,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{ 
            x: [
              `${particle.x}%`, 
              `${particle.x + (Math.random() * 10 - 5)}%`,
              `${particle.x}%`
            ],
            y: [
              `${particle.y}%`, 
              `${particle.y + (Math.random() * 10 - 5)}%`,
              `${particle.y}%`
            ],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 3 + Math.random() * 7,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: alpha(colors.accent, 0.2),
            boxShadow: `0 0 ${particle.size / 2}px ${alpha(colors.accent, 0.7)}`,
            zIndex: 0
          }}
        />
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 50 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20, 
          delay: 0.2 
        }}
        style={{ width: '100%', maxWidth: '400px', zIndex: 10 }}
      >
        <Box
          sx={{
            borderRadius: '24px',
            backdropFilter: 'blur(20px)',
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`,
            p: 4,
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* افکت کریستالی روی کارت */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.04,
              background: `linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.9) 38%, rgba(255, 255, 255, 0.9) 40%, transparent 48%)`,
              backgroundSize: '200% 200%',
              backgroundPosition: '0% 0%',
              animation: 'shine 5s ease-in-out infinite alternate',
              '@keyframes shine': {
                to: {
                  backgroundPosition: '100% 100%',
                },
              },
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          
          {/* لوگو و عنوان */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={4}
            position="relative"
            zIndex={1}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.4 }}
            >
              <Box
                sx={{
                  mb: 2,
                  filter: `drop-shadow(0 0 10px ${alpha(colors.accent, 0.5)})`,
                }}
              >
                <AnimatedLogo size="large" colorMode="dark" />
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Typography 
                color={colors.textSecondary}
                variant="body2"
                align="center"
              >
                برای ورود به سیستم، لطفاً اطلاعات خود را وارد کنید
              </Typography>
            </motion.div>
          </Box>
          
          {/* فرم لاگین */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <Box component="form" onSubmit={handleSubmit} width="100%" position="relative" zIndex={1}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ type: "spring" }}
                >
                  <Typography 
                    color="error" 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      mb: 2, 
                      background: colors.errorBg,
                      backdropFilter: 'blur(5px)',
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                      textAlign: 'center',
                    }}
                  >
                    {error}
                  </Typography>
                </motion.div>
              )}
            
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="نام کاربری"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={handleInputChange}
                disabled={loading}
                error={!!error}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover, &.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.2)`,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.accent,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.accent,
                  },
                  '& .MuiInputBase-input': {
                    color: colors.textPrimary,
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                name="password"
                label="رمز عبور"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={handleInputChange}
                disabled={loading}
                error={!!error}
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover, &.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.2)`,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.accent,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.accent,
                  },
                  '& .MuiInputBase-input': {
                    color: colors.textPrimary,
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Button
                component={motion.button}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.8,
                  borderRadius: '12px',
                  background: `linear-gradient(90deg, ${colors.buttonGradientStart}, ${colors.buttonGradientEnd})`,
                  boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  color: '#ffffff',
                  '&:hover': {
                    background: `linear-gradient(90deg, ${colors.buttonGradientStart}, ${colors.buttonGradientEnd})`,
                    boxShadow: `0 15px 30px rgba(0, 0, 0, 0.4)`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    animation: 'shine 2s infinite',
                    '@keyframes shine': {
                      '100%': {
                        left: '100%',
                      },
                    },
                  },
                }}
              >
                {loading ? (
                  <Box position="relative" display="flex" alignItems="center">
                    <CircularProgress
                      size={24}
                      sx={{ 
                        color: '#ffffff',
                        position: 'absolute',
                        left: -40
                      }}
                    />
                    <Typography sx={{ ml: 4 }}>در حال ورود...</Typography>
                  </Box>
                ) : 'ورود به سیستم'}
              </Button>
            </Box>
          </motion.div>
          
          {/* فوتر */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1 }}
          >
            <Typography 
              variant="caption" 
              color={colors.textSecondary}
              align="center" 
              sx={{ 
                mt: 4, 
                display: 'block',
                fontWeight: 'light'
              }}
            >
              سامانت - نسخه ۱.۰.۰
            </Typography>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
};

export default LoginPage;