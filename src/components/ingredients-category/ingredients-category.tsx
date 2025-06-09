import { forwardRef, useMemo } from 'react';

import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useAppSelector } from '../../services/hooks';

import { selectBurgerBuilder } from '../../services/slices/burgerSlice/burgerSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { builderData } = useAppSelector(selectBurgerBuilder);

  const ingredientsCounters = useMemo(() => {
    const { selectedBun, filling } = builderData;
    const counters: { [key: string]: number } = {};

    filling.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    if (selectedBun) counters[selectedBun._id] = 2;

    return counters;
  }, [builderData]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
