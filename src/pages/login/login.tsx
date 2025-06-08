import { FC, SyntheticEvent, useState } from 'react';

import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import { Navigate } from 'react-router-dom';
import {
  selectAuthError,
  selectAccountState,
  accountLogin
} from '../../services/slices/accountSlice/accountSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useAppSelector(selectAuthError);
  const { isLoggedIn } = useAppSelector(selectAccountState);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(accountLogin({ email, password }));
  };

  if (isLoggedIn) {
    return <Navigate to='/' />;
  }

  return (
    <LoginUI
      errorText={error?.toString()}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
