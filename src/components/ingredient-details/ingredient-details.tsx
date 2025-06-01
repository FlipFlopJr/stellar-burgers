import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = useSelector((s) =>
    s.ingredients.items.find((i) => i._id === id)
  );

  if (!data) return <Preloader />;
  return <IngredientDetailsUI ingredientData={data} />;
};
