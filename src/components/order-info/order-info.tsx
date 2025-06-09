import { FC, useEffect, useMemo } from 'react';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import { useParams } from 'react-router-dom';
import {
  fetchOrderDetails,
  selectOrderLookupState
} from '../../services/slices/lookupOrderSlice/lookupOrderSlice';
import { selectInventoryState } from '../../services/slices/inventSlice/inventSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();

  const { orderDetails, isFetching } = useAppSelector(selectOrderLookupState);
  const { inventoryItems } = useAppSelector(selectInventoryState);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderDetails(Number(number)));
    }
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderDetails || !inventoryItems.length) return null;

    const date = new Date(orderDetails.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderDetails.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        if (!acc[itemId]) {
          const ingredient = inventoryItems.find((ing) => ing._id === itemId);
          if (ingredient) {
            acc[itemId] = { ...ingredient, count: 1 };
          }
        } else {
          acc[itemId].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderDetails,
      ingredientsInfo,
      date,
      total
    };
  }, [orderDetails, inventoryItems]);

  if (!orderInfo || isFetching) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
