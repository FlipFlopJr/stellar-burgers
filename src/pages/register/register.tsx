import { FC, SyntheticEvent, useState } from 'react';

import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  selectAuthError,
  accountRegister
} from '../../services/slices/accountSlice/accountSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(accountRegister({ email, password, name: userName }));
    navigate('/login');
  };

  return (
    <RegisterUI
      errorText={error?.toString()}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
