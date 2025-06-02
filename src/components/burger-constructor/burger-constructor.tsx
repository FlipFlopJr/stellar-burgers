import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { placeOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bun, ingredients } = useSelector((s) => s.burgerConstructor) || {
    bun: null,
    ingredients: []
  };

  const { isAuth } = useSelector((s) => s.auth);
  const orderRequest = useSelector((s) => s.order.orderRequest);
  const orderData = useSelector((s) => s.order.orderData);

  const price = useMemo(() => {
    const bunCost = bun ? bun.price * 2 : 0;
    const fillings = ingredients.reduce((sum, i) => sum + i.price, 0);
    return bunCost + fillings;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login', { replace: true });
      return;
    }
    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    dispatch(placeOrder(ids)).then((res) => {
      if (placeOrder.fulfilled.match(res)) dispatch(clearConstructor());
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
