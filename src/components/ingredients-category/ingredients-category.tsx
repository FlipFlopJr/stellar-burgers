import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: selected } = useSelector(
    (s) => s.burgerConstructor
  ) || { bun: null, ingredients: [] };

  const counters = useMemo(() => {
    const cnt: Record<string, number> = {};
    selected.forEach((i: TIngredient) => {
      cnt[i._id] = (cnt[i._id] || 0) + 1;
    });
    if (bun) cnt[bun._id] = 2;
    return cnt;
  }, [bun, selected]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={counters}
      ref={ref}
    />
  );
});
