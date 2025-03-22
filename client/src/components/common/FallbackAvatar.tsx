import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';

interface FallbackAvatarProps extends Omit<AvatarProps, 'src'> {
  name?: string;
  size?: number;
  bgColor?: string;
}

// کامپوننت آواتار بدون نیاز به تصویر که حروف اول نام را نمایش می‌دهد
const FallbackAvatar: React.FC<FallbackAvatarProps> = ({
  name = '',
  size = 40,
  bgColor,
  sx,
  ...rest
}) => {
  const getInitials = (fullName: string) => {
    if (!fullName) return '';
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };
  
  // تابع تولید رنگ بر اساس نام
  const generateColorFromName = (name: string): string => {
    if (!name) return '#FFD700';
    
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
    ];
    
    // تولید هش از نام
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // انتخاب رنگ
    return colors[Math.abs(hash) % colors.length];
  };
  
  const initials = getInitials(name);
  const backgroundColor = bgColor || generateColorFromName(name);
  
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: backgroundColor,
        fontSize: size * 0.4,
        ...sx
      }}
      {...rest}
    >
      {initials}
    </Avatar>
  );
};

export default FallbackAvatar; 