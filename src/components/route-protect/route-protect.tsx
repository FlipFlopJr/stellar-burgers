import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';

import { Preloader } from '../ui/preloader';
import { selectAccountState } from '../../services/slices/accountSlice/accountSlice';

type ProtectRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectRoute = ({ onlyUnAuth }: ProtectRouteProps) => {
  const location = useLocation();

  const { currentUser, hasCheckedAuth, isLoggedIn } =
    useAppSelector(selectAccountState);

  if (!onlyUnAuth && !isLoggedIn) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isLoggedIn) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (hasCheckedAuth) {
    return <Preloader />;
  }

  return <Outlet />;
};
