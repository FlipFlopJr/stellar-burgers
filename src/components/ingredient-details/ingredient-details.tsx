import { FC } from 'react';

import { selectInventoryState } from '../../services/slices/inventSlice/inventSlice';
import { useAppSelector } from '../../services/hooks';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { inventoryItems } = useAppSelector(selectInventoryState);

  const ingredientData = inventoryItems.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
