import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const order = useSelector((s) => s.order.orderData);
  const items = useSelector((s) => s.ingredients.items);

  useEffect(() => {
    if (number) dispatch(fetchOrderByNumber(+number));
  }, [dispatch, number]);

  const info = useMemo(() => {
    if (!order || !items.length) return null;
    const date = new Date(order.createdAt);
    const ingInfo: Record<string, TIngredient & { count: number }> = {};
    order.ingredients.forEach((id) => {
      if (!ingInfo[id]) {
        const i = items.find((x) => x._id === id);
        if (i) ingInfo[id] = { ...i, count: 1 };
      } else ingInfo[id].count++;
    });
    const total = Object.values(ingInfo).reduce(
      (sum, it) => sum + it.price * it.count,
      0
    );
    return { ...order, ingredientsInfo: ingInfo, date, total };
  }, [order, items]);

  if (!info) return <Preloader />;
  return <OrderInfoUI orderInfo={info} />;
};
