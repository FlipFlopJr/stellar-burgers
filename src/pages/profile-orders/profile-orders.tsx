import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((s) => s.userOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) return <p>Загрузка ваших заказов…</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return <ProfileOrdersUI orders={orders} />;
};
