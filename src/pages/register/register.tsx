import React, { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, Navigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { registerUser, clearError } from '../../services/slices/authSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuth } = useSelector((state) => state.auth);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuth) {
    return <Navigate to='/' replace />;
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const action = await dispatch(
      registerUser({ name: userName, email, password })
    );
    if (registerUser.fulfilled.match(action)) {
      navigate('/', { replace: true });
    }
  };

  return (
    <RegisterUI
      userName={userName}
      setUserName={setUserName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={error}
      isLoading={isLoading}
    />
  );
};
