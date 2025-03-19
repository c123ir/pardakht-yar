import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
  colorMode?: 'light' | 'dark';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'medium',
  colorMode = 'dark'
}) => {
  const theme = useTheme();
  
  // تعیین اندازه لوگو بر اساس پراپ size
  const logoSize = {
    small: { height: 40, width: 120, fontSize: '1.5rem', iconSize: 32 },
    medium: { height: 50, width: 160, fontSize: '1.8rem', iconSize: 40 },
    large: { height: 60, width: 200, fontSize: '2.2rem', iconSize: 48 },
  }[size];
  
  // تعیین رنگ‌های لوگو براساس حالت رنگ
  const colors = {
    light: {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      text: theme.palette.common.white,
      accent: '#00d2ff',
      glow: alpha('#00d2ff', 0.5),
    },
    dark: {
      primary: '#3a7bd5',
      secondary: '#00d2ff',
      text: theme.palette.common.white,
      accent: '#00d2ff',
      glow: alpha('#00d2ff', 0.5),
    }
  }[colorMode];
  
  // انیمیشن برای حروف "سامانت"
  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      }
    }),
  };

  // انیمیشن برای حروف "Samanet"
  const latinLetterVariants = {
    hidden: { opacity: 0, y: -20, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0, 
      filter: 'blur(0px)',
      transition: {
        delay: 0.8 + (i * 0.1),
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      }
    }),
  };

  // انیمیشن پالس و درخشش برای آیکون S/س
  const iconAnimation = {
    scale: [1, 1.05, 1],
    filter: [
      `drop-shadow(0 0 8px ${colors.glow})`,
      `drop-shadow(0 0 16px ${colors.glow})`,
      `drop-shadow(0 0 8px ${colors.glow})`
    ],
  };

  // انیمیشن ذرات اطراف آیکون
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * 2 * Math.PI;
    const radius = 30;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return {
      x,
      y,
      size: 2 + Math.random() * 4,
      angle,
      delay: i * 0.08,
    };
  });

  // متن عنوان فارسی و انگلیسی
  const persianTitle = "سامانت";
  const latinTitle = "SAMANET";

  // محاسبه اندازه فونت برای متن انگلیسی
  const getLatinFontSize = () => {
    if (typeof logoSize.fontSize === 'string' && logoSize.fontSize.includes('rem')) {
      return `${parseFloat(logoSize.fontSize) * 0.6}rem`;
    }
    if (typeof logoSize.fontSize === 'number') {
      return logoSize.fontSize * 0.6;
    }
    return '0.9rem'; // مقدار پیش‌فرض
  };

  return (
    <Box 
      sx={{ 
        height: logoSize.height, 
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* آیکون س/S با افکت‌های ویژه */}
      <Box 
        sx={{ 
          mr: 1.5,
          position: 'relative',
          height: logoSize.iconSize,
          width: logoSize.iconSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ذرات متحرک حول آیکون */}
        {particles.map((particle, index) => (
          <motion.div
            key={`particle-${index}`}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: colors.accent,
              top: '50%',
              left: '50%',
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              x: [particle.x, particle.x + (Math.random() * 10 - 5)],
              y: [particle.y, particle.y + (Math.random() * 10 - 5)],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 2 + Math.random() * 2,
              delay: particle.delay,
            }}
          />
        ))}
        
        {/* نماد س/S متحرک */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: 45 }}
          animate={{ 
            opacity: 1, 
            rotate: 0,
            ...iconAnimation
          }}
          transition={{
            duration: 1,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 3,
            },
            filter: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 3,
            }
          }}
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            width: logoSize.iconSize,
            height: logoSize.iconSize,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text,
            fontWeight: 'bold',
            fontSize: `${logoSize.iconSize / 1.5}px`,
            zIndex: 2,
            boxShadow: `0 8px 20px ${alpha(colors.primary, 0.3)}`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* افکت موج داخل آیکون */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 30% 30%, ${alpha(colors.text, 0.2)} 0%, transparent 70%)`,
              zIndex: 1,
            }}
            animate={{
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
          />
          
          {/* انیمیشن تغییر از س به S */}
          <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
              }}
              initial={{ opacity: 1 }}
              animate={{ 
                opacity: [1, 0, 1],
                rotateY: [0, 90, 180, 270, 360],
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                times: [0, 0.15, 0.5, 0.85, 1],
              }}
            >
              س
            </motion.div>
            
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                rotateY: [90, 180, 270],
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                times: [0.15, 0.5, 0.85],
              }}
            >
              S
            </motion.div>
          </Box>
        </motion.div>
      </Box>

      {/* نام فارسی و انگلیسی با انیمیشن */}
      <Box>
        {/* عنوان فارسی */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 0.5 }}>
          {persianTitle.split('').map((letter, i) => (
            <motion.div
              key={`persian-${i}`}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              style={{ 
                display: 'inline-block',
                fontSize: logoSize.fontSize,
                fontWeight: 'bold',
                color: colors.text,
                textShadow: `0 0 10px ${colors.glow}`,
                lineHeight: 1,
              }}
            >
              {letter}
            </motion.div>
          ))}
        </Box>
        
        {/* عنوان انگلیسی */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          {latinTitle.split('').map((letter, i) => (
            <motion.div
              key={`latin-${i}`}
              custom={i}
              variants={latinLetterVariants}
              initial="hidden"
              animate="visible"
              style={{ 
                display: 'inline-block',
                fontSize: getLatinFontSize(),
                fontWeight: 'bold',
                color: alpha(colors.text, 0.8),
                letterSpacing: '0.05em',
                lineHeight: 1,
              }}
            >
              {letter}
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AnimatedLogo; 