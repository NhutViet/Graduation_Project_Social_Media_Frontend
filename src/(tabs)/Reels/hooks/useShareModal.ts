import { useCallback, useRef } from 'react';
import { Modalize } from 'react-native-modalize';

export const useShareModal = () => {
  const modalShareRef = useRef<Modalize>(null);

  const openShareModal = useCallback(() => {
    modalShareRef.current?.open();
  }, []);

  return { modalShareRef, openShareModal };
};
