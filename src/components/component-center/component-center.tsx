import { FC, memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TCenter } from './type';
import { CenterComp } from '../ui/component-center';

export const CenteringComp: FC<TCenter> = memo(({ title, children }) => {
  const [titleStyle, setTitleStyle] = useState('text_type_main-large');
  const location = useLocation();

  useEffect(() => {
    if (/feed|profile/i.test(location.pathname)) {
      setTitleStyle('text_type_digits-default');
    }
  }, []);

  return (
    <>
      <CenterComp title={title} titleStyle={titleStyle} children={children} />
    </>
  );
});
