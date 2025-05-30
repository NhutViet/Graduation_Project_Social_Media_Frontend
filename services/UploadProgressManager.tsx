import React, {createContext, useContext, useState} from 'react';
import {UploadProgressModal} from '../components/UploadProgressModal';

export type UploadContextType = {
  showUploadModal: (uri: string, type: 'image' | 'video') => void;
  setProgress: (progress: number) => void;
  hideUploadModal: () => void;
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({children}: {children: React.ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [thumbUri, setThumbUri] = useState('');
  const [progress, setProgress] = useState(0);

  const showUploadModal = (uri: string, type: 'image' | 'video') => {
    setThumbUri(uri);
    setProgress(0);
    setVisible(true);
  };

  const hideUploadModal = () => {
    setVisible(false);
    setProgress(0);
    setThumbUri('');
  };

  return (
    <UploadContext.Provider
      value={{showUploadModal, setProgress, hideUploadModal}}>
      {children}
      <UploadProgressModal
        visible={visible}
        thumbnailUri={thumbUri}
        progress={progress}
      />
    </UploadContext.Provider>
  );
};

export const useUploadProgress = () => {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error('useUploadProgress must be used within UploadProvider');
  }
  return ctx;
};
