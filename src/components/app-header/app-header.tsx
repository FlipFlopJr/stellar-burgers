import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/hooks';

import { selectAccountState } from '../../services/slices/accountSlice/accountSlice';

export const AppHeader: FC = () => {
  const { currentUser } = useAppSelector(selectAccountState);

  return <AppHeaderUI userName={currentUser?.name || ''} />;
};
