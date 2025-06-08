import { FC } from 'react';

import { selectLiveOrdersState } from '../../services/slices/userOrdersSlice/userOrdersSlice';
import { useAppSelector } from '../../services/hooks';
import { FeedInfoUI } from '../ui/feed-info';
import { TOrder } from '@utils-types';

const extractOrderNumbers = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((order) => order.status === status)
    .map((order) => order.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { liveOrders, totalCompleted, completedToday } = useAppSelector(
    selectLiveOrdersState
  );

  const pendingOrders = extractOrderNumbers(liveOrders, 'pending');
  const readyOrders = extractOrderNumbers(liveOrders, 'done');

  const feed = {
    totalToday: completedToday,
    total: totalCompleted,
    orders: liveOrders
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
