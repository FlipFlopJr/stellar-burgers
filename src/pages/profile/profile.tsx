import { ProfileUI } from '@ui-pages';

import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  currentUserFetch,
  selectAccountState,
  accountUpdateInfo
} from '../../services/slices/accountSlice/accountSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const { currentUser, isLoading } = useAppSelector(selectAccountState);
  const dispatch = useAppDispatch();

  const user = {
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  };

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user.name || '',
      email: user.email || ''
    }));
  }, [currentUser]);

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(accountUpdateInfo(formValue));
    dispatch(currentUserFetch());
  };

  if (isLoading) {
    return <Preloader />;
  }

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
