import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import {
  selectLiveOrdersState,
  liveOrdersFetch
} from '../../services/slices/userOrdersSlice/userOrdersSlice';

export const Feed: FC = () => {
  const { liveOrders, isLoading } = useAppSelector(selectLiveOrdersState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(liveOrdersFetch());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={liveOrders}
      handleGetFeeds={() => dispatch(liveOrdersFetch())}
    />
  );
};
