import { FC } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type Props = { guestOnly?: boolean };

export const ProtectedRoute: FC<Props> = ({ guestOnly = false }) => {
  const { isAuth, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (guestOnly && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (!guestOnly && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
