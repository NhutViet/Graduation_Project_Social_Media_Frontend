import React from 'react';
import { useSelector } from 'react-redux';
import { VideoPauseProvider } from '../(tabs)/Home/context/VideoPauseContext';
import { RootState } from '../../services/store';

interface VideoPauseWrapperProps {
  children: React.ReactNode;
}

export const VideoPauseWrapper: React.FC<VideoPauseWrapperProps> = ({ children }) => {
  const currentUserId = useSelector((state: RootState) => state.user.user?._id);

  return (
    <VideoPauseProvider currentUserId={currentUserId}>
      {children}
    </VideoPauseProvider>
  );
};