import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useDispatch } from '../../services/store';
import { addIngredient, setBun } from '../../services/slices/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const handleAdd = () => {
      const item = { ...ingredient, id: uuid() };
      if (ingredient.type === 'bun') dispatch(setBun(item));
      else dispatch(addIngredient(item));
    };
    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
