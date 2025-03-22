import React from 'react';
import { Box, useTheme, keyframes } from '@mui/material';
import { alpha } from '@mui/material/styles';

// انیمیشن های مختلف
const animations = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  slideUp: keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
  slideInRight: keyframes`
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
  slideInLeft: keyframes`
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
  zoomIn: keyframes`
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `,
  pulse: keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `,
  fadeInWithGlow: keyframes`
    from { 
      opacity: 0; 
      box-shadow: 0 0 0 rgba(33, 150, 243, 0); 
    }
    to { 
      opacity: 1; 
      box-shadow: 0 0 20px rgba(33, 150, 243, 0.3); 
    }
  `,
  bounce: keyframes`
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  `,
  shimmer: keyframes`
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  `,
};

export type AnimationType = keyof typeof animations;

interface CSSAnimationProps {
  children: React.ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

const CSSAnimation: React.FC<CSSAnimationProps> = ({
  children,
  animation = 'fadeIn',
  duration = 0.5,
  delay = 0,
  repeat = 1,
  direction = 'normal',
  fillMode = 'both',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        animation: `${animations[animation]} ${duration}s ${theme.transitions.easing.easeInOut} ${delay}s ${repeat} ${direction} ${fillMode}`,
        display: 'inline-block',
      }}
    >
      {children}
    </Box>
  );
};

// هوک برای اضافه کردن انیمیشن به استایل های کامپوننت
export const useAnimationStyles = (animation: AnimationType, options?: {
  duration?: number;
  delay?: number;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}) => {
  const {
    duration = 0.5,
    delay = 0,
    repeat = 1,
    direction = 'normal',
    fillMode = 'both',
  } = options || {};

  return {
    animation: `${animations[animation]} ${duration}s ease ${delay}s ${repeat} ${direction} ${fillMode}`,
  };
};

export default CSSAnimation; 