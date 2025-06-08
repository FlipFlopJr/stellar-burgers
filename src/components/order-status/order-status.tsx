import { FC } from 'react';

import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const STATUS_TEXT: Record<string, string> = {
  created: 'Создан',
  done: 'Выполнен',
  pending: 'Готовится'
};

const STATUS_COLOR: Record<string, string> = {
  done: '#00CCCC',
  created: '#F2F2F3',
  pending: '#E52B1A'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const TextStyle = STATUS_COLOR[status] || '#F2F2F3';
  const Text = STATUS_TEXT[status] || 'Неизвестен';
  return <OrderStatusUI textStyle={TextStyle} text={Text} />;
};
