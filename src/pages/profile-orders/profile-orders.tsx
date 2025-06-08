import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  userOrdersFetch,
  selectAccountState
} from '../../services/slices/accountSlice/accountSlice';
import { liveOrdersFetch } from '../../services/slices/liveOrdersSlice/liveOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const { personalOrders, isLoading } = useAppSelector(selectAccountState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userOrdersFetch());
    dispatch(liveOrdersFetch());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={personalOrders} />;
};
