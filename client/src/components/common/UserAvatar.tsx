import React, { useState, useEffect } from 'react';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';
import { useImages } from '../../contexts/ImageContext';

interface UserAvatarProps extends Omit<MuiAvatarProps, 'src'> {
  user?: {
    fullName?: string;
    avatar?: string | null;
  } | null;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 40,
  sx,
  ...props 
}) => {
  const { getImageUrl } = useImages();
  const [imageError, setImageError] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user?.avatar) {
      const url = getImageUrl(user.avatar);
      console.log('Setting avatar URL:', url, 'for user:', user.fullName);
      setAvatarUrl(url);
      setImageError(false);
    } else {
      console.log('No avatar found for user:', user?.fullName);
      setAvatarUrl(undefined);
    }
  }, [user?.avatar, getImageUrl]);

  const getInitials = (name?: string) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const hasAvatar = Boolean(user?.avatar && avatarUrl && !imageError);

  const handleImageError = () => {
    console.error('Avatar image failed to load:', {
      url: avatarUrl,
      user: user?.fullName,
      avatar: user?.avatar
    });
    setImageError(true);
    setAvatarUrl(undefined);
  };

  useEffect(() => {
    console.log('Avatar state:', {
      hasAvatar,
      imageError,
      avatarUrl,
      userAvatar: user?.avatar
    });
  }, [hasAvatar, imageError, avatarUrl, user?.avatar]);

  return (
    <MuiAvatar
      src={avatarUrl}
      onError={handleImageError}
      sx={{ 
        width: size, 
        height: size,
        fontSize: size * 0.4,
        bgcolor: hasAvatar ? 'primary.main' : '#FFD700',
        color: hasAvatar ? 'primary.contrastText' : '#000000',
        border: `2px solid ${hasAvatar ? 'transparent' : '#FFD700'}`,
        ...sx
      }}
      {...props}
    >
      {!hasAvatar && getInitials(user?.fullName)}
    </MuiAvatar>
  );
};

export default UserAvatar; 